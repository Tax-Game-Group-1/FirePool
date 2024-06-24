"use client"
import { GameGlobal } from '@/app/global'
import { socket } from '@/app/socket'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import LoadingStatus from '@/components/Loading/Loading'
import { signal, computed } from '@preact/signals-react'
import React, { useEffect } from 'react'

import t from "../../../elements.module.scss"
import { PlayerChosenForAudit } from '&/gameManager/interfaces'
import { CurrencyIcon } from '@/assets/svg/svg'
import { GameState } from '@/interfaces'
import { switchGameState } from './InGame'
import { useSignals } from '@preact/signals-react/runtime'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer'
import { createNotif } from '@/components/Notification/Notification'


let isUpForAudit = signal(false);
let showResult = signal(false);
let hasPenalty = signal(false);

let oldFunds = signal(0);
let newFunds = signal(0);

/*export interface PlayerChosenForAudit {
  id: number,
  newFunds: number
}*/


function onAudited({success, message, data}){
	if(!success){
		createNotif({
			content: `Error in auditing: ${message}`
		})
		return;
	}

	let arr : PlayerChosenForAudit[] = data;

	for(let player of arr){
		if(player.id == GameGlobal.player.value.id){
			//handle audit

			isUpForAudit.value = true;

			let _currFunds = GameGlobal.player.value.funds;
			let _newFunds = player.newFunds;
			
			oldFunds.value = _currFunds;
			newFunds.value = _newFunds;

			if(_newFunds < _currFunds){
				hasPenalty.value = true;
			}

			GameGlobal.player.value.funds = player.newFunds;
			return;
		}
	}

	onProceed();

}

//todo: check for bankcruptcy
function onProceed(){

	switchGameState(GameState.Redistribution);
	
}

function onRevealClick(){
	showResult.value = true;
}

function doAudit(){
	socket.emit("audit",{
		code: GameGlobal.room.value.gameCode,
	})

	socket.on("client-audited", onAudited);
}

export function AuditCitizen() {

	useSignals();

	useEffect(()=>{
		doAudit();
	},[])


	return (
		<AnimationContainer
			enter={{
				animations:{
					opacity:[0,1],
					y:[100,0]
				},
				options:{
					duration: 0.3,
				}
			}}
		>
		<GameContent isSub isAbsolute>
			{
				showResult.value

				?

				(
					hasPenalty.value

					?

					<div className={`flex flex-col justify-center items-center p-4 gap-2`}>
						<div className={`text-base`}>
							You were made to pay a penalty for tax evasion.
						</div>
						<div className={`flex flex-row justify-between items-center w-full`}>
							<div>Old Funds</div>
							<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
								<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
								<div className={``}>{oldFunds.value?.toFixed(2)}</div>
							</div>
						</div>
						<div className={`flex flex-row justify-between items-center w-full`}>
							<div>Penalty</div>
							<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
								<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
								<div className={``}>
									{ (oldFunds.value - newFunds.value).toFixed(2)}
								</div>
							</div>
						</div>
						<div className={`flex flex-row justify-between items-center w-full text-xl m-2`}>
							<div>New Funds</div>
							<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 bg-black text-red-400`}>
								<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
								<div className={``}>{newFunds.value?.toFixed(2)}</div>
							</div>
						</div>
						<div className={`flex flex-row text-lg`}>
							<Btn onClick={onProceed}>
								Pay Penalty
							</Btn>
						</div>
					</div>

					:

					<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
						<div className={`text-base`}>
							No penalty has to be paid. Thank you for your honesty.
						</div>
						<div className={`text-lg`}>
							<Btn onClick={onProceed}>
								Continue
							</Btn>
						</div>
					</div>
				)

				:

				(

					isUpForAudit.value
			
					?
			
					<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
						<div className={`text-lg`}>
							Tax Authority has chosen you for an audit!
						</div>
						<div>
							<Btn onClick={onRevealClick}>
								View Result
							</Btn>
						</div>
					</div>
			
					:

					<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
						<div className={`text-lg`}>
							Tax Authority is currently auditing other citizens.
						</div>
						<div className={`text-sm`}>
							Waiting for other citizens...
						</div>
						<div>
							<LoadingStatus/>
						</div>
					</div>

				)

			}
			</GameContent>

		</AnimationContainer>
		
		

	)
}


export function AuditMinister() {

	useEffect(()=>{
		doAudit();
	},[])

	return (
		<GameContent isSub>
			<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
				<div className={``}>
					Waiting for all citizens to finish being audited...
				</div>
				<div>
					<LoadingStatus/>
				</div>
			</div>
		</GameContent>
	)
}
