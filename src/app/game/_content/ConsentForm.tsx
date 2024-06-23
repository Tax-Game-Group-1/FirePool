"use client"
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import { createPopUp } from '@/components/PopUp/PopUp'
import React from 'react'

import {socket} from "@/app/socket"

import t from "../../../elements.module.scss"
import { GameGlobal, playerID } from '@/app/global'
import { createNotif } from '@/components/Notification/Notification'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'


export default function ConsentForm() {

	

    //socket.on("sign-consent", ({playerId, hasConsented, code}) => {
	async function onSignConsent(consent: boolean){
		console.log("ON SIGN CONSENT (ConserntFrom.tsx)")
		
		socket.emit("sign-consent",{
			hasConsented: consent,
			playerId: GameGlobal.player.value.id,
			code: GameGlobal.room.value.gameCode
		});

		console.log("emmitting to server");

		switchGameState(GameState.RolePicking);
	}
	
	function onBtnClick(){

		let content = (
			<div>
				<p>
					{`By pressing accept, you are agreeing to have your play data to be used in the research anonymously.`}
				</p>
				<p>
					{`However, rejecting will let you use the application while not having your data recorded.`}
				</p>
			</div>
		)
		createPopUp({
			content: content,
			buttons: {
				"I accept": ()=>{
					onSignConsent(true)
				},
				"I reject": ()=>{
					onSignConsent(false)
				},
			}
		})

	}

	return (
		<GameContent isSub className={`w-5/6 h-3/4 self-center md:self-start lg:self-center`}>
			<div className={`grid grid-rows-12 w-full h-full gap-2`}>
				<div className={`row-span-10 border flex justify-center items-start overflow-auto rounded-md ${t.solidBG}`}>
					<img src="/images/letter-of-informed-consent.jpeg" className={`rounded-md`}/>
				</div>
				<div className={`row-span-2 flex justify-center`}>
					<Btn onClick={onBtnClick}>Sign to accept/reject</Btn>
				</div>
			</div>
		</GameContent>
	)
}
