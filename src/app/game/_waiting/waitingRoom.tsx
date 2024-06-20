"use client"
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import React, { forwardRef, Ref, useEffect, useRef, useState } from 'react'

import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { CopyIcon, DiceIcon, EnterArrow, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg';

import t from "../../../elements.module.scss";
import style from "./waitingRoom.module.scss"
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import QRCode from 'react-qr-code';
import Btn from '@/components/Button/Btn';
import { useAnimate } from 'framer-motion';
import StartRoom, { DisplayMode, displayMode } from './startRoom';
import NotifContainer, { closeNotif, createNotif, Notif } from '@/components/Notification/Notification';
import { PopUpContainer } from '@/components/PopUp/PopUp';
import NameRoom from './namingRoom';
import { useSignals } from '@preact/signals-react/runtime';
import { signal } from '@preact/signals-react';
import { GameGlobal } from '@/app/global';

export enum Page {
	NameRoom,
	StartRoom,
}

export let pageState = signal(Page.NameRoom);

export const roomSignal = new SignalEventBus();

export const GameCodeQRCode = forwardRef(function GameCodeQRCode({}, ref:Ref<any>){

	let [url, setUrl] = useState("");

	useEffect(() => {
		if(!url){
			setUrl(window.location.href);
		}
	},[])

	return (
		<QRCode ref={ref} value={url}/>
	)

})
export const CurrentURL = forwardRef(function CurrentURL({}, ref:Ref<any>){

	let [url, setUrl] = useState("");

	useEffect(() => {
		if(!url){
			setUrl(window.location.href);
		}
	},[])

	return (
		<>{url}</>
	)

})

export function changeWaitingRoomPage(page:Page){
	roomSignal.emit("page", page);
}

export function WaitingRoom() {
	useSignals();

	useSignalEvent("page",(newState:Page)=>{
		pageState.value = newState;
	}, roomSignal);

	useEffect(() => {

		if(GameGlobal.hostData.value?.id){
			pageState.value = Page.StartRoom;
			displayMode.value = DisplayMode.Host;
		}

		let k = requestAnimationFrame(()=>{
			let x = createNotif({
				content: (<p>Joined Game</p>),
				time: 3,
			})
		});

		return () => {
			cancelAnimationFrame(k);
		}
	},[])

	let other = (<></>)

	switch(pageState.value){
		case Page.NameRoom:
			other = (<NameRoom/>)
			break;
		case Page.StartRoom:
			other = (<StartRoom/>)
			break;
	}

	return (
		<ContentLayersContainer>
			<ContentLayer z={1} className='flex flex-col justify-center items-center p-4 pointer-events-auto'>
				{other}
			</ContentLayer>
			<ContentLayer z={100}>
				<NotifContainer></NotifContainer>
			</ContentLayer>
			<ContentLayer z={100}>
				<PopUpContainer></PopUpContainer>
			</ContentLayer>
		</ContentLayersContainer>
	)
}
