"use client"
import React, { forwardRef, MouseEvent, Ref, useEffect, useRef, useState } from 'react'

import t from '../../elements.module.scss'
import style from "./PopUp.module.scss"
import Btn from '../Button/Btn';
import { CloseIcon } from '@/assets/svg/svg';
import SVGIcon from '../SVGIcon/SVGIcon';

import { signal, computed } from "@preact/signals-react";
import { SignalEventBus, useSignalEvent } from '@catsums/signal-event-bus';
import { useSignals } from '@preact/signals-react/runtime';
import AnimationContainer from '../AnimationContainer/AnimationContainer';
import { randomID } from '@catsums/my';
import { animate, AnimationPlaybackControls, useAnimate } from 'framer-motion';
import { mergeRefs } from '@/mergeRefs/mergeRefs';

export let popUpSignalBus = new SignalEventBus();

export const activePopUps = signal<{
	[id:string] : React.ReactNode,
}>({})

export const popUpIsOpen = computed(()=>{
	return Object.values(activePopUps.value).length != 0;
});

export const PopUpContainer = forwardRef(function PopUpContainer({children}:{
	children?: React.ReactNode,
}, ref:Ref<any>) {
	//using preact signals instead of state
	useSignals();

	//using signalevents
	//on signal close, close the popup with that id
	useSignalEvent("close",(id)=>{
		let newActivePopUps = activePopUps.value;
		if(newActivePopUps[id]){
			delete newActivePopUps[id];
			activePopUps.value = {...newActivePopUps};
		}
	}, popUpSignalBus);
	//on signal create, open the popup node by adding it
	useSignalEvent("create",({node, id}:{node:React.ReactNode, id:string})=>{
		let newActivePopUps = activePopUps.value;
		if(!newActivePopUps[id]){
			newActivePopUps[id] = node;
			activePopUps.value = {...newActivePopUps};
		}
	}, popUpSignalBus);

	let popUps = Object.values(activePopUps.value);

	return  (
		popUpIsOpen.value
		
		&&

		<AnimationContainer
			enter={{
				animations:{
					opacity: [0,1],
				},
				options:{
					duration: 0.1,
				},
			}}
		>
			<div ref={ref} className={`${style.popUpContainer} rounded-md opacity-0`}>
				<div className={`${style.containerHide} rounded-md`}>
					{/* Hide */}
				</div>
					{children}
				<div className={`${style.containerElements}`}>
					{popUps}
				</div>
			</div>
		</AnimationContainer>
	)
});

interface IPopUpBtns {
	[btnName:string]: ((d:{e?:MouseEvent, id?:string}) => void);
}

export function createPopUp(opts:{
	content: React.ReactNode,
	onClose?: () => void,
	buttons?: IPopUpBtns,
}){
	let {content, onClose, buttons} = opts;

	let id = randomID();

	let node = (<PopUp 
		id={id} close={onClose || (()=>{})}
		buttons={buttons || {}}
	>
		{content}
	</PopUp>)

	setTimeout(()=>{
		popUpSignalBus.emit("create", {id, node});
	},100)
}

export const PopUp = forwardRef(function PopUp({
	id=randomID(),children, close, buttons={},
}:{
	id?:string,
	children?: React.ReactNode,
	buttons?:IPopUpBtns,
	close?:(e?:MouseEvent)=>void,
}, ref:Ref<any>){

	let [scope, animate] = useAnimate();

	useEffect(()=>{
		animate(scope.current,{
			y: [100,0], opacity: [0,1],
		}, {duration: 0.2});
	},[]);

	function clearPopUp(){
		try{
			let newActivePopUps = activePopUps.value;
			if(newActivePopUps[id]){
				delete newActivePopUps[id];
			}
			scope.current?.remove();
		}catch(err){}

	}

	function defaultClose(){
		if(scope?.current){
			animate(scope.current,{
				y: [0,100], opacity: [1,0],
			}, {duration: 0.08}).then(()=>{
				clearPopUp();
			})
		}else{
			clearPopUp();
		}
		popUpSignalBus.emit("close", id);
	}

	let btns = Object.keys(buttons).map((btnName, i)=>{
		return (
			<Btn key={btnName} onClick={(e)=>{
				buttons[btnName]?.({e, id});
				defaultClose();
			}}>{btnName}</Btn>
		)
	})

	return (
		<div data-popup-id={id} ref={mergeRefs(ref,scope)} className={`${style.popUp} ${t.solidWindow}`}>
			<div className={`${style.popUpClose} ${t.fillSolidText}`}>
				<Btn onClick={(e)=>{
					close?.(e);
					defaultClose();
				}} innerStyle={{
					padding: "0.3em",
					margin: "0",
				}} outerStyle={{
					borderRadius: "inherit",
				}}>
					<SVGIcon>
						<CloseIcon/>
					</SVGIcon>
				</Btn>
			</div>
			<div className={`${style.popUpContent}`}>
				{children}
			</div>
			<div className={`${style.popUpButtons}`}>
				{btns}
			</div>
		</div>
	)

});