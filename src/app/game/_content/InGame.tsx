"use client"
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import GameContentContainer, { closeContent, closeContentAll, createContent, GameContent } from '@/components/Game/GameContentContainer'
import GameHUD, { WorldHUD, PlayerHUD } from '@/components/Game/GameHUD'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'
import React, { useEffect } from 'react'
import RevealCard from './RevealCard'
import { signal } from '@preact/signals-react'
import { GameState } from '@/interfaces'
import ConsentForm from './ConsentForm'
import { showPlayerHUD } from '@/components/Game/PlayerHUD'
import { showWorldHUD } from '@/components/Game/WorldHUD'
import UniverseSetup from './UniverseSetup'
import { games } from '@/app/host/page'


//initial is waiting
export const gameState = signal(GameState.Waiting);

export function switchGameState(newState: GameState) {
	console.log(`new state`);
	gameState.value = newState;
	closeContentAll();
}

export function showCardOnGameState(){
	let content = (<></>);
	showPlayerHUD.value = true;
	showWorldHUD.value = true;
	console.log("SHOWING CARD ON GAME ");
	switch(gameState.value) {
		case GameState.Waiting:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
		} break;
		case GameState.Starting:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<ConsentForm/>)
		} break;
		case GameState.RolePicking:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<RevealCard/>)
		} break;
		case GameState.UniverseSetup:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<UniverseSetup/>)
		} break;
		default: 
			console.log("SHOW CARD ON GAME STATE FAILED")
	}
	
	console.log(`gamestate: ${gameState}`);
	let {timer} = createContent({
		content: content,
		id: 'mainContent',
		useWrapper: false,
	});

	timer.onComplete(()=>{
		console.log(`content now showing`);
	})

}

export default function InGame() {
	
	useEffect(() => {
		console.log("SHOWING IN GAME")
		
		// showCardOnGameState();
		
	},[gameState.value])

	let content = (<></>);

	console.log("SHOWING CARD ON GAME, value: " + gameState.value);
	
	switch(gameState.value) {
		case GameState.Waiting:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
		} break;
		case GameState.Starting:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<ConsentForm/>)
		} break;
		case GameState.RolePicking:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<RevealCard/>)
		} break;
		case GameState.UniverseSetup:{
			showPlayerHUD.value = false;
			showWorldHUD.value = false;
			content = (<UniverseSetup/>)
		} break;
		default: 
			console.log("SHOW CARD ON GAME STATE FAILED")
	}


	return (
		<ContentLayersContainer>
			<ContentLayer z={100}>
				<GameHUD>
					<WorldHUD/>
					<PlayerHUD/>
				</GameHUD>
			</ContentLayer>

			<ContentLayer z={1}>
				<GameContentContainer>
					{
						gameState.value == GameState.Starting && <ConsentForm />
					}
					{
						gameState.value == GameState.RolePicking && <RevealCard />
					}
					{
						gameState.value == GameState.UniverseSetup && <UniverseSetup />
					}
					{/* {content} */}
				</GameContentContainer>
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
