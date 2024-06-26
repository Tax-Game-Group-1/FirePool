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

import { gameCode, GameGlobal, hostName, playerIconURL, playerName, saveGameGlobal } from '@/app/global';
import NameRoom, { AvatarIcon } from './namingRoom';
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import { createPopUp } from '@/components/PopUp/PopUp';
import { useRouter } from 'next/navigation';
import { Game } from '&/gameManager/gameManager';
import { GameScreen, setGameScreen, startGame } from '../layouts';
import { socket } from '@/app/socket';


export enum DisplayMode {
	Player,
	Host,
}

export let ready = computed(()=>{
	let r = GameGlobal.player.value?.ready;
	return r;
})

export let displayMode = signal(DisplayMode.Player);

export let players = computed(()=>{
	let p = GameGlobal.room.value.playersInRoom || [];
	return p;
})

export let playerCardsSignal = new SignalEventBus();



// async function getPlayers(){
// 	let res = await fetch("/",{
// 		method: "POST",
// 		body: JSON.stringify({

// 		}),
// 	}).then(r => r.json())

// 	if(!res.success){
// 		//handle fail
// 	}

// 	players.value = res.data;

// }

export function PlayerCards(){
	useSignals();

	let users = players.value;

	let playerCards = users.map((user, i) => {
		players.value;
		return (
			<PlayerCard key={i} name={user.name || "Player joining..."} ready={user.ready}>
				<img className={`rounded-md`} src={getIconURL(user.name).href} alt={`${user.name} icon`}/>
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
							let url = new URL(location.href);
							let host = url.host;

							let _url = `http://${host}/home?c=${gameCode.value}`;
							await shareURL(new URL(_url));
						}}>
							<SVGIcon>
								<ShareIcon className={`${t.fillSolidText}`}/>
							</SVGIcon>
						</span>
						<span className={`aspect-square h-full`} onClick={async()=>{
							let url = new URL(location.href);
							let host = url.host;

							let _url = `http://${host}/home?c=${gameCode.value}`;
							await copyToClipboard(gameCode.value);

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

export async function onStart(){

	let allPlayersReady = players.value.every((player)=>player.ready);

	if(!allPlayersReady){
		createNotif({
			content: "Some players are not ready yet.",
		})
		return;
	}

	createPopUp({
		content: "Do you want to start the game?",
		buttons:{
			"Yes": ()=>{
				startGame();
			},
			"No": ()=>{}
		}
	});

}

export async function readyPlayer(){
	let playerdata = GameGlobal.player.value;
	playerdata.ready = !playerdata.ready;
	GameGlobal.player.value = {...playerdata};

	saveGameGlobal("players")
	// playerCardsSignal.emit("update");

	//for testing
	// startGame();

	socket.emit("update-ready", {
		waitingId: playerdata.waitingId,
		ready: playerdata.ready,
		code: GameGlobal.room.value.gameCode,
	})
}

export function AsideCardPlayer(){
	useSignals();

	return (
		<div className={`${t.solidElement} ${t.solidText} ${style.formCard} hidden md:flex`}>
			<AvatarIcon url={playerIconURL.value}/>
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
				<Btn invert={GameGlobal.player.value?.ready} onClick={()=>{
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
				<Btn onClick={onStart}>
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

	let router = useRouter();

	function onExitClick(){
		createPopUp({
			content: "Leave the room? This will close the game",
			buttons: {
				"Yes": () => {
					GameGlobal.room.value = {};
					saveGameGlobal();
					router.push("/home");
				},
				"No": () => {}
			}
		})
	}

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

			<div 
				className={`flex flex-row items-center absolute right-0 text-xs md:text-sm h-full p-4`}
				onClick={onExitClick}
			>
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
		// saveGameGlobal();
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
