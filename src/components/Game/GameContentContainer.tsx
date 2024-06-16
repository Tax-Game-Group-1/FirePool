"use client"

import React, { act, forwardRef, lazy, LegacyRef, Ref, Suspense, useEffect } from 'react'
import style from "./GameContentContainer.module.scss";

import t from "../../elements.module.scss"
import { SignalEventBus, useSignalEvent } from '@catsums/signal-event-bus';
import { signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { randomID } from '@catsums/my';
import { animate, useAnimate } from 'framer-motion';
import { mergeRefs } from '@/mergeRefs/mergeRefs';

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

	let contents = Object.values(activeContents.value);
	
	return (
		<div className={`${style.gameContentContainer}`}>
			{contents}
			{children}
		</div>
	)
}

export function createContent({content,className}:{
	content: React.ReactNode,
	className?: string,
}){

	let id = randomID();
	let node = (
		<GameContent className={className}>
			{content}
		</GameContent>
	);

	setTimeout(()=>{
		contentSignalBus.emit("add",{id, node});
	}, 100);

}

export const GameContent = forwardRef(function GameContent(
	{children, className, id=randomID()}:{
		children?:React.ReactNode,
		className?:string,
		id?:string,
	}, ref:Ref<any>
){

	let [scope, animate] = useAnimate();

	function onClose(){
		animate(scope.current, {
			x: [0,100], opacity: [1,0],
		}, {duration: 0.08}).then(()=>{
			try{
				let ctns = activeContents.value;
				delete ctns[id];
				scope.current?.remove();
			}catch(err){}
		}).then(()=>{
			contentSignalBus.emit(`remove`, id);
		})
	}

	useSignalEvent(`close-${id}`,onClose, contentSignalBus);

	return (
		<div data-content-id={id} className={`${style.gameContent} ${t.solidElement} ${className}`} ref={mergeRefs(ref, scope)}>
			<div className={`${style.gameContentInner}`}>
				{children}
			</div>
		</div>
	)
});