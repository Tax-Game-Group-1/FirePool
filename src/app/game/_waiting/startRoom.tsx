"use client"
import React, { useEffect, useState } from 'react'

import style from "./waitingRoom.module.scss"
import { CopyIcon, EditTextIcon, ExitDoor, PlayIcon, ShareIcon, UserIcon } from '@/assets/svg/svg'
import { PlayerCard } from './PlayerCard';
import Btn from '@/components/Button/Btn';
import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { GameCodeQRCode, CurrentURL, changeWaitingRoomPage, Page } from './waitingRoom';

import Image from 'next/image';

import t from "../../../elements.module.scss";
import { copyToClipboard, getIconURL, shareURL } from '@/utils/utils';
import { signal, computed } from '@preact/signals-react';
import { createNotif } from '@/components/Notification/Notification';
import LoadingStatus from '@/components/Loading/Loading';
import { useSignals } from '@preact/signals-react/runtime';

import btnStyle from "../../../components/Button/Btn.module.scss"

import { GameGlobal, playerData, roomData, updateGameGlobal } from '../global';
import NameRoom, { AvatarIcon } from './namingRoom';
import { getData, IPlayerData, setData } from '@/app/dummyData';
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';

export let gameCode = computed(()=>{
	let code = GameGlobal.roomData.value?.id || "";
	let mid = Math.trunc(code.length/2);
	code = [code.slice(0, mid), code.slice(mid)].join("-");

	return code;
});
export let hostName = computed(()=>{
	let name = GameGlobal.hostData.value?.name || "";
	return name;
});
export let playerName = computed(()=>{
	let name = GameGlobal.playerData.value?.name || "";
	return name;
});
export let ready = computed(()=>{
	let isReady = GameGlobal.playerData.value?.isReady || false;
	return isReady;
});

export let iconURL = computed(()=>{
	let url = GameGlobal.playerData.value?.icon || getIconURL();

	return url;
})

export enum DisplayMode {
	Player,
	Host,
}

export let displayMode = signal(DisplayMode.Player);

export let players = computed(()=>{
	//dependancies
	GameGlobal.playerData.value;
	GameGlobal.roomData.value;

	let code = gameCode.value.split("-").join("");
	let roomData = getData("rooms", code);
	let playerIDs = roomData.players;
	let players = playerIDs.map((id) => {
		let player = getData("players", id);
		return player;
	});

	return players;
})

export let playerCardsSignal = new SignalEventBus();

export function PlayerCards(){
	useSignals();

	let users:IPlayerData[] = players.value;

	let playerCards = users.map((user, i) => {
		players.value;
		return (
			<PlayerCard key={user.id} name={user.name} isReady={user.isReady}>
				<img className={`rounded-md`} src={user.icon} alt={`${user.name} icon`}/>
			</PlayerCard>
		)
	})
	if(!playerCards.length){
		playerCards.push(
			<>
				<div className={`flex flex-col gap-2 justify-center text-center items-center col-span-12 row-span-12 h-full `}>
					<LoadingStatus/>
					<span>Waiting for players to join...</span>
				</div>
				<div className={`flex flex-col justify-center text-center items-center col-span-12 row-span-6 h-full gap-2`}>
					<div>Share the link:</div>
					<div className={`flex justify-center items-center p-4 px-8 ${t.background} rounded-md`}>
						<CurrentURL/>
					</div>
					<div className={`flex justify-center items-center gap-4 p-1 h-10`}>
						<span className={`aspect-square h-full`} onClick={async()=>{
							let url = new URL(window.location.href);
							await shareURL(url);
						}}>
							<SVGIcon>
								<ShareIcon className={`${t.fillSolidText}`}/>
							</SVGIcon>
						</span>
						<span className={`aspect-square h-full`} onClick={async()=>{
							let url = new URL(window.location.href);
							await copyToClipboard(url.href);

							let notifData = (
								<p className={`mx-4`}>Copied to clipboard!</p>
							)

							createNotif({
								content: (notifData),
								time: 1.5,
							});
						}}>
							<SVGIcon>
								<CopyIcon className={`${t.strokeSolidText}`}/>
							</SVGIcon>
						</span>
					</div>
				</div>
			</>
		)
	}

	return (
		<div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1 lg:p-4 overflow-hidden h-auto`}>
			{playerCards}
		</div>
	)


}

export function readyPlayer(){
	let playerdata = GameGlobal.playerData.value;
	playerdata.isReady = !playerdata.isReady;
	GameGlobal.playerData.value = {...playerdata};

	setData("players", {...playerdata});
	updateGameGlobal("players")
	// playerCardsSignal.emit("update");
}

export function AsideCardPlayer(){
	useSignals();

	return (
		<div className={`${t.solidElement} ${t.solidText} ${style.formCard} hidden md:flex`}>
			<AvatarIcon url={iconURL.value}/>
			<div className={`${style.nameInputContainer} `}>
				<div className={`flex flex-row justify-between h-10 w-full`}>
					<div className={`${t.solidText} flex justify-center items-center rounded-md p-2 w-full break-all text-2xl`}>
						{playerName}
					</div>
					<div 
						className={`${t.fillSolidText} h-full aspect-square flex justify-center items-center p-2`}
						onClick={()=>{
							changeWaitingRoomPage(Page.NameRoom);
						}}
					>
						<SVGIcon>
							<EditTextIcon/>
						</SVGIcon>
					</div>
				</div>
			</div>
			<div className={`${t.fillSolidText} lg:max-h-full text-xs lg:text-base`}>
				<Btn invert={ready.value} onClick={()=>{
					readyPlayer();
				}}>
					<div className={`flex flex-row justify-center items-center m-0 p-0 h-full gap-1`}>
						{
							(!ready.value) ? (
								<>
									<div className={`flex text-center w-full`}>
										Ready up
									</div>
								</>
							) : (
								<>
									<div className={`flex text-center`}>
										Ready!
									</div>
									<div className={`h-full aspect-square`}>
										<SVGIcon>
											<PlayIcon/>
										</SVGIcon>
									</div>
								</>
							)
						}
					</div>
				</Btn>
			</div>
		</div>
	)
}

export function AsideCard(){
	useSignals();

	return (
		<div className={`${t.solidElement} ${t.solidText} ${style.formCard} hidden md:flex`}>
			<div className={`flex flex-col justify-center text-center items-center m-0 text-[0.5rem] lg:text-xs xl:text-base`}>
				<div>Join game and enter this code:</div>
				<div className={`${t.inputBox} ${t.solidText} p-1 lg:p-2 px-4 lg:px-12 rounded-md text-lg lg:text-2xl xl:text-4xl md:tracking-wide`}>
					{gameCode}
				</div>
			</div>
			<div className={`${style.qrContainer}`}>
				<div className={`bg-white w-full h-full aspect-square flex justify-center items-center rounded-md p-4`}>
					<SVGIcon>
						<GameCodeQRCode/>
					</SVGIcon>
				</div>
			</div>
			<div className={`${style.nameInputContainer} text-xs lg:text-sm`}>
				<div className={`self-center text-center w-full m-1`}>Or enter this URL into your browser</div>
				<div className={`flex flex-row justify-between h-10 w-full`}>
					<div className={`${t.inputBox} ${t.solidText} flex justify-center items-center rounded-md p-2 w-full break-all`}>
						<CurrentURL/>
					</div>
					<div className={`${t.strokeSolidText} h-full aspect-square flex justify-center items-center p-2`}>
						<SVGIcon>
							<CopyIcon/>
						</SVGIcon>
					</div>
				</div>
			</div>
			<div className={`${t.fillSolidText} lg:max-h-full text-xs lg:text-base`}>
				<Btn>
					<div className={`flex flex-row m-0 p-0 h-full gap-1`}>
						<div>Start Game</div>
						<div className={`h-full aspect-square`}>
							<SVGIcon>
								<PlayIcon/>
							</SVGIcon>
						</div>
					</div>
				</Btn>
			</div>
		</div>
	)
}

export function RoomHeader() {
	useSignals();

	return (
		<div className={`relative p-2 col-span-12 lg:col-span-9 gap-4 rounded-md ${t.solidElement} flex flex-row justify-start items-center`}>
			<div className={`h-full aspect-square border ${t.fillSolidText} ${t.solidBorder} p-4 m-2 rounded-full`}>
				<UserIcon/>
			</div>
			{
				(displayMode.value == DisplayMode.Player) ? (
					<>
						<div className={`text-sm`}>
							{playerName}
						</div>
						<div className={`${t.fillSolidText} flex md:hidden lg:max-h-full text-xs lg:text-base`}>
							<Btn invert={ready.value} onClick={()=>{
								readyPlayer();
							}}>
								<div className={`flex flex-row justify-center items-center m-0 p-0 h-full gap-1`}>
									{
										(!ready.value) ? (
											<>
												<div className={`flex text-center w-full`}>
													Ready up
												</div>
											</>
										) : (
											<>
												<div className={`flex text-center`}>
													Ready!
												</div>
												<div className={`h-full aspect-square`}>
													<SVGIcon>
														<PlayIcon/>
													</SVGIcon>
												</div>
											</>
										)
									}
								</div>
							</Btn>
						</div>
					</>
				) : (
					<>
						<div className={`text-sm`}>
							{hostName}
						</div>
					</>
				)
			}

			<div className={`flex flex-row items-center absolute right-0 text-xs md:text-sm h-full p-4`}>
				<div>Exit</div>
				<div className={`aspect-square h-full m-0 p-2 md:p-1 ${t.fillSolidText}`}>
					<ExitDoor/>
				</div>
			</div>
		</div>
	)
}


export default function StartRoom() {
	useSignals();

	useEffect(() => {
		updateGameGlobal("players")
	},[])

	return (
		<div className={`${style.area} flex justify-between w-full h-full`}>
			<div className={`grid grid-rows-12  w-full gap-2 p-2`}>
				<div className={`row-span-2 grid grid-cols-12`}>
					<RoomHeader/>
				</div>
				<div className={`row-span-12 overflow-auto`}>
					<PlayerCards/>
				</div>
			</div>
			{
				(displayMode.value == DisplayMode.Player) ? (
					<>
					<AsideCardPlayer/>
					</>
				) : (
					<>
					<AsideCard/>
					</>
				)
			}
			
		</div>
	)
}
