"use client"

import React, { act, CSSProperties, forwardRef, lazy, LegacyRef, Ref, Suspense, useEffect, useState } from 'react'
import s from "./GameContentContainer.module.scss";

import t from "../../elements.module.scss"
import { SignalEventBus, useSignalEvent } from '@catsums/signal-event-bus';
import { signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { randomID } from '@catsums/my';
import { animate, useAnimate } from 'framer-motion';
import { mergeRefs } from '@/mergeRefs/mergeRefs';
import { createTimer } from '@/utils/utils';

export const activeContents = signal<{
	[id:string] : React.ReactNode,
}>({})

export const contentSignalBus = new SignalEventBus();

export default function GameContentContainer({children}:{
	children?: React.ReactNode,
}){
	useSignals();

	useSignalEvent("add", ({id, node})=>{
		let newActiveContents = activeContents.value; 
		if(!newActiveContents[id]){
			newActiveContents[id] = node;
			activeContents.value = {...newActiveContents};
		}
	}, contentSignalBus);
	useSignalEvent("remove", (id)=>{
		let newActiveContents = activeContents.value; 
		if(newActiveContents[id]){
			delete newActiveContents[id];
			activeContents.value = {...newActiveContents};
		}
	}, contentSignalBus);
	useSignalEvent("closeAll", ()=>{
		let keys = Object.keys(activeContents.value); 
		for(let k of keys){
			closeContent(k);
		}
	}, contentSignalBus);

	let contents = Object.values(activeContents.value);
	
	return (
		<div className={`${s.gameContentContainer}`}>
			{contents}
			{children}
		</div>
	)
}

export function createContent({content,className, id=randomID(), useWrapper=true, style={}, time= 0.1,}:{
	content: React.ReactNode,
	className?: string,
	id?: string,
	style?: CSSProperties,
	useWrapper?: boolean,
	time?:number,
}){

	let node:React.ReactNode;
	if(useWrapper){
		node = (
			<GameContent id={id} key={id} className={className} style={style}>
				{content}
			</GameContent>
		);
	}else{
		node = (
			<>{content}</>
		);
	}

	let t = createTimer(0.240 + time).onComplete(()=>{
		contentSignalBus.emit("add",{id, node});
	});

	return {
		timer: t,
		id: id,
	}

}

export function closeContent(id){
	// console.log(activeContents.value[id])
	contentSignalBus.emit(`close-${id}`);
}
export function closeContentAll(){
	// console.log(activeContents.value[id])
	contentSignalBus.emit(`closeAll`);
}

export const GameContent = forwardRef(function GameContent(
	{children, className="", id=randomID(), isSub=false, style={}, isAbsolute=false}:{
		children?:React.ReactNode,
		className?:string,
		id?:string,
		isSub?:boolean,
		isAbsolute?: boolean,
		style?:CSSProperties,
	}, ref:Ref<any>
){

	let [active, setActive] = useState(true);
	let [scope, animate] = useAnimate();

	function clear(){
		let ctns = activeContents.value;
		delete ctns[id];
	}
	function onMount(){
		let ctns = activeContents.value;
		if(!ctns[id] && !isSub){
			contentSignalBus.emit("add", {id, node: children});
		}
	}
	
	useEffect(()=>{
		console.log(`mounting ${id}`)
		onMount();
		return () => {
			console.log(`unmounting ${id}`)
			// let ctns = activeContents.value;
			// delete ctns[id];
		};
	},[])
	
	function onClose(){
		if(!active) return;

		animate(scope.current, {
			x: [0,100], opacity: [1,0],
		}, {duration: 0.08}).then(()=>{
			clear();
			setActive(false);
		}).then(()=>{
			contentSignalBus.emit(`remove`, id);
		})
	}

	useSignalEvent(`close-${id}`,onClose, contentSignalBus);

	return (
		active &&
		<div 
			data-content-id={id} 
			className={`${s.gameContent} ${t.solidElement} ${className} ${isAbsolute ? "absolute" : "relative"}`} 
			ref={mergeRefs(ref, scope) as any} 
			style={style}
		>
			<div className={`${s.gameContentInner}`}>
				{children}
			</div>
		</div>
	)
});