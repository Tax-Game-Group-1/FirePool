"use client"

import dynamic from 'next/dynamic'
import { useState, forwardRef, Ref, Suspense, lazy, useEffect } from 'react';

import { useSignals } from '@preact/signals-react/runtime';
import { useTheme } from '@/components/ThemeContext/themecontext';
import Themes from '../../components/ThemeContext/themes.module.scss'
import t from '../../elements.module.scss';

import style from "./layouts.module.scss"

const GameFooter = lazy(() => import('@/components/Game/GameFooter'));
import InGame from './_content/InGame';
import { signal, computed } from '@preact/signals-react';
import { WaitingRoom } from './_waiting/waitingRoom';
import { GameGlobal, loadGameGlobal, updateGameGlobal } from '@/app/global';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { getData } from '../dummyData';
import { createPopUp, popUpSignalBus } from '@/components/PopUp/PopUp';
import { createNotif, notifSignalBus } from '@/components/Notification/Notification';

let isLoaded = signal(false);

export let playerID = computed(()=>{
	let id = GameGlobal.playerData.value?.id || "";
	return id;
});
export let hostID = computed(()=>{
	let id = GameGlobal.hostData.value?.id || "";
	return id;
});

export enum GameScreen {
	WaitingRoom,
	InGame,
	Spectate,
}

export let gameScreen = signal(GameScreen.WaitingRoom);

export function setGameScreen(screen: GameScreen) {


	gameScreen.value = screen;
}

export function startGame(){
	if(playerID){
		setGameScreen(GameScreen.InGame);
	}else if(hostID){
		setGameScreen(GameScreen.Spectate);
	}
}

const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {
	useSignals();

	useEffect(()=>{
		window.scrollTo(0,0);
		if(!isLoaded.value) return;

		console.log("LOADED")

		function redirect(){
			window.location.href = "/";
		}

		let url = new URL(window.location.href);
		let params = url.searchParams;

		let code = "";

		if(params.has("c")){
			code = params.get("c");
		}
		if(params.has("code")){
			code = params.get("code");
		}
		
		let roomData = getData("rooms", code);
		if(!roomData){
			let {timer} = createPopUp({
				content: "This is an invalid room code. Redirecting you back...",
				buttons:{
					"okay": redirect,
				},
				onClose: redirect,
			});
			return () => {
				timer.end();
			}
		}
		console.log({roomData,playerID:playerID.value})
		if(!roomData.players.includes(playerID.value)){
			let {timer} = createPopUp({
				content: "You can't join this room because you did not join it properly. Redirecting you back...",
				buttons:{
					"okay": redirect,
				},
				onClose: redirect,
			});
			return () => {
				timer.end();
			}
		}

		GameGlobal.roomData.value = roomData;
		updateGameGlobal();

		let {timer,id} = createNotif({
			content: "Joined game!",
		});
		return () => {
			timer.end();
		}
	},[isLoaded.value])

	useRemoveLoadingScreen(()=>{
		isLoaded.value = true;
		loadGameGlobal();
	},()=>{
		let gameLayout = document.querySelector(`.${style.gameLayout}`);
		gameLayout?.classList.remove("hidden");
	});
	
	
	let content = (<></>)

	switch(gameScreen.value){
		case GameScreen.InGame:
			content = (<InGame/>);
			break;
		case GameScreen.WaitingRoom:
			content = (<WaitingRoom/>);
			break;
	}

	return (
		<>
			<LoadingScreen/>
			<Suspense fallback={<span></span>}>
				{isLoaded && (
					
					<div ref={ref} className={`${style.gameLayout} ${t.background} ${t.mainText} hidden`}>
						<main className={``}>
							{content}
						</main>
						<GameFooter/>
					</div>
				)}
			</Suspense>
		</>
	);
});

export default Layouts;
