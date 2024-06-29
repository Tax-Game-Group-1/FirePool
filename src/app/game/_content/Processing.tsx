"use client"
import { GameGlobal, saveGameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import { signal } from '@preact/signals-react'
import React, { useEffect } from 'react'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'
import { socket } from '@/app/socket'
import Spectate from './Spectate';
import { GameScreen, gameScreen, setGameScreen } from '../layouts'
import { PlayerData, UniverseData } from '&/gameManager/interfaces'
import { createNotif } from '@/components/Notification/Notification'
import { createPopUp } from '@/components/PopUp/PopUp'

async function fileForBankruptcyPlayer(){
	socket.emit("game-over",{
		code: GameGlobal.room.value.gameCode,
		playerId: GameGlobal.player.value.id,
	})
	
	socket.on("client-bankrupt",()=>{
		gameScreen.value = GameScreen.Spectate;
	})
	
}
async function fileForBankruptcyUniverse(){
	socket.emit("universe-game-over",{
		code: GameGlobal.room.value.gameCode,
		universeId: GameGlobal.universe.value.id,
	})
	
	socket.on("client-bankrupt",()=>{
		gameScreen.value = GameScreen.Spectate;
	})
}

let playerBankruptcy = signal(false);
let universeBankruptcy = signal(false);

function onProceedClick(){
	socket.emit("finish-round", {
		code: GameGlobal.room.value.gameCode || GameGlobal.room.value.code,
	})
	socket.on("next-round",({data})=>{

		
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

		if(GameGlobal.room.value.roundNumber >= 12){
			//end game

			createPopUp({
				content: "The game is over",
				onClose: () => {
					switchGameState(GameState.End);
				}
			})
		}

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

		switchGameState(GameState.YearStart);
	})
}

export default function Processing() {

	useEffect(()=>{
		if(GameGlobal.player.value.funds <= 0){
			playerBankruptcy.value = true;
		}
		if(GameGlobal.universe.value.funds <= 100){
			universeBankruptcy.value = true;
		}
		return;
	},[]);

	return (
		<GameContent isSub>
			{
				universeBankruptcy.value &&
				<div className={`flex flex-col`}>
					<div>
						You have insufficient funds to keep going. You have to file for bankruptcy.
					</div>
					<div>
						<Btn onClick={fileForBankruptcyPlayer}>File for Bankruptcy</Btn>
					</div>
				</div>
			}
			{
				playerBankruptcy.value &&
				<div className={`flex flex-col`}>
					<div>
						Your universe has no sufficient funds to keep going. It is going to file for bankruptcy.
					</div>
					<div>
						<Btn onClick={fileForBankruptcyUniverse}>Game Over</Btn>
					</div>
				</div>
			}{
				(!playerBankruptcy.value && !universeBankruptcy.value) &&
				<div className={`flex flex-col p-8 justify-center`}>
					<div>
						This universe has sufficient funds to keep going.
					</div>
					<div>
						<Btn onClick={onProceedClick}>Proceed</Btn>
					</div>
				</div>
			}
		</GameContent>
	)
}
