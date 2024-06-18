"use client"
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime'
import React, { forwardRef, LegacyRef, Ref, useEffect, useRef, useState } from 'react'

import { randomID } from '@catsums/my';
import { mergeRefs } from '@/mergeRefs/mergeRefs';
import { useAnimate } from 'framer-motion';

import style from "./Notification.module.scss";
import t from "../../elements.module.scss"
import Btn from '../Button/Btn';
import SVGIcon from '../SVGIcon/SVGIcon';
import { CloseIcon } from '@/assets/svg/svg';
import { createTimer, TimerInstance } from '@/utils/utils';
import _ from 'lodash';

export const notifContents = signal<{
	[id:string] : React.ReactNode,
}>({})

export const notifSignalBus = new SignalEventBus();

export default function NotifContainer({children}:{
	children?: React.ReactNode,
}) {
	useSignals();

	useSignalEvent("add", ({id, node})=>{
		let newContents = notifContents.value; 
		if(!newContents[id]){
			newContents[id] = node;
			notifContents.value = {...newContents};
		}
	}, notifSignalBus);
	useSignalEvent("remove", (id)=>{
		let newContents = notifContents.value; 
		if(newContents[id]){
			delete newContents[id];
			notifContents.value = {...newContents};
		}
	}, notifSignalBus);

	let contents = Object.values(notifContents.value);

	return (
		<div className={`${style.notifContainer}`}>
			{contents}
			{children}
		</div>
	)
}

export function createNotif({content,className, id=randomID(), useWrapper=true, time=5}:{
	content: React.ReactNode,
	className?: string,
	id?: string,
	useWrapper?: boolean,
	time?: number,
}){

	let node:React.ReactNode;
	if(useWrapper){
		node = (
			<Notif id={id} key={id} className={className} time={time}>
				{content}
			</Notif>
		);
	}else{
		node = (
			<>{content}</>
		);
	}

	let t = setTimeout(()=>{
		notifSignalBus.emit("add",{id, node});
	}, 250);

	return {
		timer: t,
		id: id,
	}

}

export function closeNotif(id){
	notifSignalBus.emit(`close-${id}`);
}

export const Notif = forwardRef(function Notif(
	{children, className="", id=randomID(), time=3}:{
		children?:React.ReactNode,
		className?:string,
		id?:string,
		time?:number,
	}, ref:Ref<any>
){

	let [active, setActive] = useState(true);
	let [scope, animate] = useAnimate();

	let progressBarRef = useRef(null);
	let timerRef = useRef(null);

	function clear(){
		let ctns = notifContents.value;
		delete ctns[id];
	}
	
	useEffect(()=>{
		// console.log(`mounting ${id}`)
		return () => {
			// console.log(`unmounting ${id}`);
		};
	},[])

	useEffect(()=>{
		if(active){
			animate(scope.current,{
				y: [100,0], opacity: [0,1], 
			}, { duration: 0.4, delay: 0.1, ease: "backInOut"})
			.then(()=>{
				let timer = createTimer(time-1);
				timer.onComplete(()=>{
					closeNotif(id);
				}).onProgress(({progress})=>{
					let pBar = progressBarRef.current as HTMLProgressElement;
					if(!pBar) return;
					pBar.value = _.clamp(progress, 0, 1);
				})
				timerRef.current = timer;
			});
		}
		return ()=>{
			let timer = timerRef.current as TimerInstance;
			if(timer) timer.end();
		}
	},[active])
	
	function onClose(){
		if(!active) return;

		animate(scope.current, {
			y: [0,-100], opacity: [1,0],
		}, {duration: 0.05}).then(()=>{
			clear();
			setActive(false);
		}).then(()=>{
			notifSignalBus.emit(`remove`, id);
		})
	}

	function onMouseEnter(){
		let timer = timerRef.current as TimerInstance;
		
		timer?.pause();
	}
	function onMouseExit(){
		let timer = timerRef.current as TimerInstance;
		timer?.resume();
	}

	useSignalEvent(`close-${id}`,onClose, notifSignalBus);

	return (
		active &&
		<div 
			data-content-id={id} className={`${style.notif} ${t.solidElement} ${className}`} ref={mergeRefs(ref, scope) as LegacyRef<any>}
			onMouseEnter={onMouseEnter}
			onMouseOver={onMouseEnter}
			onMouseLeave={onMouseExit}
			onMouseOut={onMouseExit}
		>
			<div className={`flex flex-row justify-center items-center relative`}>
				<div className={`${style.notifInner}`}>
					{children}
				</div>
				<div 
					className={`${t.fillSolidText} flex justify-end items-center p-2 h-10 aspect-square`}
					onClick={()=>{
						closeNotif(id);
					}}
				>
					<SVGIcon>
						<CloseIcon/>
					</SVGIcon>
				</div>
			</div>
			<div className={`w-full h-1 flex justify-center items-center`}>
				<progress className={`w-full h-full`} ref={progressBarRef} value={0} max={1}></progress>
			</div>
		</div>
	)
});
