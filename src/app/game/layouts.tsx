"use client"

import { forwardRef, Ref, lazy, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import t from '../../elements.module.scss';
import style from "./layouts.module.scss"

const GameFooter = lazy(() => import('@/components/Game/GameFooter'));
import InGame, { switchGameState } from './_content/InGame';
import { signal } from '@preact/signals-react';
import { WaitingRoom } from './_waiting/waitingRoom';
import { GameGlobal, gameCodeLength, hostID, loadGameGlobal, playerID, saveGameGlobal } from '@/app/global';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { createPopUp} from '@/components/PopUp/PopUp';
import { createNotif} from '@/components/Notification/Notification';
import Spectate from './_content/Spectate';
import { socket } from '@/app/socket';
import {  } from '&/gameManager/interfaces';


import { UniverseData, PlayerData, PlayerRole } from '&/gameManager/interfaces';
import { GameState } from '@/interfaces';

let isLoaded = signal(true);

let code = "";
export enum GameScreen {
	WaitingRoom,
	InGame,
	Spectate,
}

// was currently working on reveal card, will change later
//should be waiting room by default
export let gameScreen = signal(GameScreen.WaitingRoom);

export function setGameScreen(screen: GameScreen) {
	console.log(`Screen: ${screen}`);
	gameScreen.value = screen;
}

export function onGameStart({success, message, data}){
	if(!success){
		createNotif({
			content: `Error starting game: ${message}`,
		})
	}
	
	let universes = data.universeData as UniverseData[];
	//if its hose, just save all universes
	if(GameGlobal.user.value.id){
		GameGlobal.room.value.universes = [...universes];

		console.log("universes for host")
		console.log(GameGlobal.room.value.universes)

	}else{
		let waitingId = GameGlobal.player.value.waitingId;
	
		let currPlayer:PlayerData;
		let currUniverse:UniverseData;
	
		for(let universe of universes){
			if(currUniverse && currPlayer) break;
	
			if(universe.minister.waitingId == waitingId){
				currPlayer = universe.minister;
				currUniverse = universe;
				break;
			}
			let players = universe.players;
			for(let player of players){
				if(waitingId == player.waitingId){
					currPlayer = player;
					currUniverse = universe;
					break;
				}
			}
		}
		///receive data of players, universe and game room
		GameGlobal.player.value = {... currPlayer};
		GameGlobal.universe.value = {... currUniverse};
		console.log("player data")
		console.log({
			currPlayer, currUniverse
		})
	}

	saveGameGlobal();

	if(GameGlobal.player.value.id !== undefined){
		setGameScreen(GameScreen.InGame);
	}else if(GameGlobal.user.value.id !== undefined){
		setGameScreen(GameScreen.Spectate);
	}else{
		createNotif({
			content: "Error! Invalid settings for player",
		})
		return;
	}

	console.log("STARTING GAME");
	switchGameState(GameState.Starting);

}

export async function startGame(){

	socket.emit("start-game",{
		code: GameGlobal.room.value.gameCode,
	});

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
	let newRoomData = data.gameData;
	
	let roomData = GameGlobal.room.value;

	GameGlobal.room.value = {
		...newRoomData, 
		playersInRoom: data.playersInRoom,
		universes: data.universeData,
		hostName: data.gameData.host,
		gameName: data.gameData.name,
		name: data.gameData.name,
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

	GameGlobal.room.value = {...roomData, name: data.name, gameCode: code};
	saveGameGlobal();
}

const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {
	useSignals();

	
	useEffect(()=>{
		socket.connect();

		socket.once("disconnect",(reason)=>{
			console.log("disconnected");
			console.log(`reason: ${reason}`)

			// createPopUp({
			// 	content: "Disconnected from server. Redirecting you back home.",
			// 	buttons:{
			// 		"Go back":()=>{
			// 			window.location.href = "/"
			// 		}
			// 	}
			// })
			return;
		})

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
		socket.on("client-start-game", onGameStart);
		
		socket.emit("server-roomData", {
			code: code,
			hostID: hostID.value || null,
			waitingId: GameGlobal.player.value.waitingId || null,
		})

		return () => {
			
			socket.off("client-roomData", onGetRoomData);
			socket.off("client-update-players", onUpdatePlayers);
			socket.off("client-start-game", onGameStart);

			socket.disconnect();
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
