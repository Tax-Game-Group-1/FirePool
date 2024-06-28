"use client"
import { GameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import { signal } from '@preact/signals-react'
import React, { useEffect } from 'react'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'
import { socket } from '@/app/socket'

async function fileForBankruptcyPlayer(){
	
}
async function fileForBankruptcyUniverse(){
	
}

let playerBankruptcy = signal(false);
let universeBankruptcy = signal(false);

function onProceedClick(){
	socket.emit("proceed",{
		code: GameGlobal.room.value.gameCode,
		playerId: GameGlobal.player.value.id,
	})

	socket.emit("client-proceed",()=>{
		switchGameState(GameState.YearStart)
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
						Your universe has sufficient funds to keep going. It is going to file for bankruptcy.
					</div>
					<div>
						<Btn onClick={fileForBankruptcyUniverse}>Game Over</Btn>
					</div>
				</div>
			}{
				(!playerBankruptcy.value && !universeBankruptcy.value) &&
				<div className={`flex flex-col`}>
					<div>
						Your universe has sufficient funds to keep going. It is going to file for bankruptcy.
					</div>
					<div>
						<Btn onClick={onProceedClick}>Game Over</Btn>
					</div>
				</div>
			}
		</GameContent>
	)
}
