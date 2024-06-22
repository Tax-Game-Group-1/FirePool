"use client"

import { forwardRef, Ref, lazy, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import t from '../../elements.module.scss';
import style from "./layouts.module.scss"

const GameFooter = lazy(() => import('@/components/Game/GameFooter'));
import InGame from './_content/InGame';
import { signal } from '@preact/signals-react';
import { WaitingRoom } from './_waiting/waitingRoom';
import { GameGlobal, gameCodeLength, hostID, loadGameGlobal, playerID, saveGameGlobal } from '@/app/global';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { createPopUp} from '@/components/PopUp/PopUp';
import { createNotif} from '@/components/Notification/Notification';
import Spectate from './_content/Spectate';
import { socket } from '@/app/socket';

let isLoaded = signal(true);

let code = "";
export enum GameScreen {
	WaitingRoom,
	InGame,
	Spectate,
}

//currently working on spectate, will change later
export let gameScreen = signal(GameScreen.WaitingRoom);

export function setGameScreen(screen: GameScreen) {


	gameScreen.value = screen;
}

export function startGame(){
	if(playerID.value > -1){
		setGameScreen(GameScreen.InGame);
	}else if(hostID.value > -1){
		setGameScreen(GameScreen.Spectate);
	}
}

function redirect(){
	window.location.href = "/";
}

function onUpdatePlayers({data, message, success}){
	console.log("Showing players on update")
	if(!success){
		createNotif({
			content: `Error: ${message}. `,
		});
		return;
	}
	
	let roomData = GameGlobal.room.value;

	GameGlobal.room.value = {
		...roomData, 
		playersInRoom: data.playersInRoom,
		hostName: data.hostName,
		gameName: data.name,
	};
	saveGameGlobal();
	
}

function onGetRoomData(res){
	
	console.log("gettting room data")
	console.log(res);
	console.log({res});

	let {data, message, success} = res;
	if(!success){
		createPopUp({
			content: `Error: ${message}. Redirecting you back.`,
			buttons:{
				"okay": redirect,
			},
			onClose: redirect,
		});
		return;
	}

	let roomData = data;

	GameGlobal.room.value = {...roomData, gameCode: code};
	saveGameGlobal();
}

const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {
	useSignals();

	
	useEffect(()=>{
		loadGameGlobal();
		console.log("LOADING STUFF ABC")
			let gameLayout = document.querySelector(`.${style.gameLayout}`);
		gameLayout?.classList.remove("hidden");
		// if(!isLoaded.value) return;

		let url = new URL(window.location.href);
		let params = url.searchParams;
	
		code = "";
	
		if(params.has("c")){
			code = params.get("c");
		}
		if(params.has("code")){
			code = params.get("code");
		}

		code = code.replaceAll(/[^a-zA-Z0-9]/g,"").slice(0, gameCodeLength);

		console.log("LOADED")

		socket.on("client-roomData", onGetRoomData);
		socket.on("client-update-players", onUpdatePlayers);
		
		socket.emit("server-roomData", {
			code: code,
			hostID: hostID.value || null,
			waitingId: GameGlobal.player.value.waitingId || null,
		})

		let {timer,id} = createNotif({
			content: "Joined game!",
		});
		return () => {
			timer.end();
			
			socket.off("client-roomData", onGetRoomData);
			socket.off("client-update-players", onUpdatePlayers);

		}
	},[isLoaded.value])

	// useRemoveLoadingScreen(()=>{
	// 	isLoaded.value = true;
	// },()=>{
	// 	let gameLayout = document.querySelector(`.${style.gameLayout}`);
	// 	gameLayout?.classList.remove("hidden");
	// });
	
	
	let content = (<></>)

	switch(gameScreen.value){
		case GameScreen.InGame:
			content = (<InGame/>);
			break;
		case GameScreen.WaitingRoom:
			content = (<WaitingRoom/>);
			break;
		case GameScreen.Spectate:
			content = (<Spectate/>);
			break;
	}

	return (
		<>
			<div ref={ref} className={`${style.gameLayout} ${t.background} ${t.mainText}`}>
					<main className={``}>
						{content}
					</main>
					<GameFooter/>
				</div>
		</>
	);
});

export default Layouts;
