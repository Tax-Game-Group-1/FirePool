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


export const gameState = signal(GameState.RolePicking);

export function switchGameState(newState: GameState) {
	gameState.value = newState;
}

export function showCardOnGameState(){
	let content = (<></>);
	switch(gameState.value) {
		case GameState.Waiting:{

		} break;
		case GameState.Starting:{

		} break;
		case GameState.RolePicking:{
			content = (<RevealCard/>)
		} break;
	}

	createContent({
		content: content,
		id: 'mainContent',
		useWrapper: false,
	});

}

export default function InGame() {
	
	useEffect(() => {
		let k = requestAnimationFrame(()=>{
			closeContentAll();
			showCardOnGameState();
		})
		
		return () => {
			cancelAnimationFrame(k);
		}
	},[gameState.value])


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
