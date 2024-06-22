"use client"

import React, { useEffect, useRef } from 'react'

import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { DiceIcon, EnterArrow } from '@/assets/svg/svg';

import Image from 'next/image';

import t from "../../../elements.module.scss";
import style from "./waitingRoom.module.scss"
import { changeWaitingRoomPage, Page } from './waitingRoom';

import { computed } from '@preact/signals-react';
import { GameGlobal, saveGameGlobal } from '@/app/global';
import { getIconURL } from '@/utils/utils';
import { useSignals } from '@preact/signals-react/runtime';
import { animate, useAnimate } from 'framer-motion';
import { randomID, sanitizeString } from '@catsums/my';
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import { createNotif } from '@/components/Notification/Notification';
import { socket } from '@/app/socket';

export let iconURL = computed(()=>{
	let url = GameGlobal.player.value?.icon || getIconURL().href;

	return url;
})
export let playerName = computed(()=>{
	let n = GameGlobal.player.value?.name || "";

	return n;
})

let avatarSignal = new SignalEventBus();

function generateNewAvatarIcon(){
	let url = getIconURL();

	avatarSignal.emit("newImage", url);
}


export function AvatarIcon({url}){
	useSignals();

	let [scope, animate] = useAnimate();

	useSignalEvent("newImage",(url)=>{
		animate(scope.current,{
			opacity: [1,0]
		}, {duration: 0.1}).then(()=>{
			let playerdata = GameGlobal.player.value;
			playerdata.icon = url.href;
			GameGlobal.player.value = {...playerdata};

			saveGameGlobal();
		})
	}, avatarSignal);

	useEffect(()=>{
		let img = scope.current as HTMLImageElement;
		let k:number;
		function onload(){
			k = requestAnimationFrame(()=>{
				animate(scope?.current, {
					opacity: [0, 1]
				}, {duration: 0.3, ease: "easeInOut"});
			})
		}
		img?.addEventListener("load", onload);

		return () => {
			img?.removeEventListener("load", onload);
			cancelAnimationFrame(k);
		}
	},[url])

	return (
		<div className={`${style.iconContainer}`}>
			<div className={`${t.accent} w-full h-full aspect-square flex justify-center items-center rounded-md`}>
				<span className={`absolute z-10 flex justify-center items-center text-center`}>Loading image...</span>
				<img ref={scope} className={` object-cover w-full relative z-20 opacity-0 rounded-md`} src={url} alt="player icon"/>
			</div>
		</div>
	)
}

function ImageGenerator(){

	let [scope, animate] = useAnimate();

	function diceRoll(){
		animate(scope?.current, {
			rotate: [0,360],
		},{ duration: 1  })
	}

	return (
		<div className={`${t.fillMain} ${style.randomizerContainer}`}>
			<div 
				ref={scope}
				className={`w-10 aspect-square p-2 rounded-full ${t.fillSolidText} ${t.inputBox}`}
				onClick={()=>{
					
					generateNewAvatarIcon();
					diceRoll();
				}}
			>
				<SVGIcon resizeBasedOnContainer={false}>
					<DiceIcon/>
				</SVGIcon>
			</div>
			<div className={`text-sm`}>
				Press to randomise avatar
			</div>
		</div>
	)
}


async function updateName(name:string){
	
	function onUpdateName({success, message, data}){
		console.log("received update-name request")
		if(!success){
			createNotif({
				content: `Error: ${message}`,
			})
			return;
		}
	
		let playerData = GameGlobal.player.value;
		GameGlobal.player.value = {...playerData, name:name};
		saveGameGlobal();
	
		changeWaitingRoomPage(Page.StartRoom);
	}
	socket.emit("update-name",{
		name: name,
		waitingId: GameGlobal.player.value.waitingId,
		code: GameGlobal.room.value.gameCode,
	})
	socket.once("client-update-name", onUpdateName);
}

let nameLimit = 16;

export default function NameRoom() {
	useSignals();

	let inputTextRef = useRef(null);

	useEffect(()=>{
		let inputBox = inputTextRef.current as HTMLInputElement;
		if(inputBox){
			inputBox.value = playerName.value;
		}

	},[])

	function onEnter(){

		let inputBox = inputTextRef.current as HTMLInputElement;
		if(!inputBox) return;
		let textValue = inputBox.value;
		textValue = sanitizeString(textValue.trim());
		textValue = textValue.substring(0, nameLimit);

		if(!textValue.length){
			createNotif({
				content: "Your name cannot be blank!"
			})
			return;
		}

		console.log({textValue})

		updateName(textValue);
	}

	return (
		<div className={`${t.solidElement} ${t.solidText} ${style.formCard}`}>
			<AvatarIcon url={iconURL.value}/>
			<ImageGenerator/>
			<div className={`${style.nameInputContainer} w-full`}>
				<label className={`self-start w-full`} htmlFor="name">Name</label>
				<div className={`flex flex-row justify-center h-10 w-full gap-1`}>
					<input 
						ref={inputTextRef} 
						name="name" 
						className={`${t.inputBox} ${t.solidText} ${style.nameInputBox}`}
						maxLength={nameLimit}
					/>
					<button className={`${t.inputBox} ${t.solidText} ${t.fillSolidText} ${style.nameInputBtn}`}
						onClick={onEnter}
					>
						<SVGIcon>
							<EnterArrow/>
						</SVGIcon>
					</button>
				</div>
			</div>
		</div>
	)
}
