"use client"

import React, { useEffect, useRef } from 'react'

import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { DiceIcon, EnterArrow } from '@/assets/svg/svg';

import Image from 'next/image';

import t from "../../../elements.module.scss";
import style from "./waitingRoom.module.scss"
import { changeWaitingRoomPage, Page } from './waitingRoom';

import { computed } from '@preact/signals-react';
import { GameGlobal, updateGameGlobal } from '../global';
import { getIconURL } from '@/utils/utils';
import { useSignals } from '@preact/signals-react/runtime';
import { animate, useAnimate } from 'framer-motion';
import { sanitizeString } from '@catsums/my';
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import { findData, getData, IPlayerData, setData } from '@/app/dummyData';
import { createNotif } from '@/components/Notification/Notification';

export let iconURL = computed(()=>{
	let url = GameGlobal.playerData.value?.icon || getIconURL().href;

	return url;
})
export let playerName = computed(()=>{
	let n = GameGlobal.playerData.value?.name || "";

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
			let playerdata = GameGlobal.playerData.value;
			playerdata.icon = url.href;
			GameGlobal.playerData.value = {...playerdata};

			setData("players", {...playerdata});
			updateGameGlobal("players");
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
				<span className={`absolute z-10`}>Loading image...</span>
				<img ref={scope} className={`w-full relative z-20 opacity-0 rounded-md`} src={url} alt="player icon"/>
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
		if(inputBox){
			let textValue = inputBox.value;
			textValue = sanitizeString(textValue.trim());
			textValue = textValue.substring(0, nameLimit);

			if(!textValue.length){
				createNotif({
					content: "Your name cannot be blank!"
				})
				return;
			}

			let playerdata = GameGlobal.playerData.value;
			let existing = findData("players",{
				name: textValue,
			});
			if(existing.length && existing.find(p => p.id != playerdata.id)){
				createNotif({
					content: "A player already has that name! Pick something else!"
				})
				return;
			}

			playerdata.name = textValue;

			GameGlobal.playerData.value = {...playerdata};

			setData("players", {...playerdata});
			updateGameGlobal("players");
		}

		changeWaitingRoomPage(Page.StartRoom);
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
