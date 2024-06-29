"use client"

import { GameContent } from '@/components/Game/GameContentContainer'
import React, { useRef } from 'react'

import t from "../../../elements.module.scss"
import { PercentageIcon } from '@/assets/svg/svg'
import Btn from '@/components/Button/Btn'
import { GameGlobal, saveGameGlobal } from '@/app/global'
import { socket } from '@/app/socket'
import _ from 'lodash'

import { createNotif } from '@/components/Notification/Notification'
import { GameState } from '@/interfaces'
import { switchGameState } from './InGame'
import LoadingStatus from '@/components/Loading/Loading'
import { signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { taxRate } from '../../global';

let waiting = signal(false);

function onCitizensPaidTax({success, data, message}){
	if(!success){
		createNotif({
			content: `Error: ${message}`,
		})
		return;
	}

	console.log({data})

	GameGlobal.universe.value.declared = data.declaredVSPaidUniverse;
	for(let universe of data.universeData){
		if(universe.id = GameGlobal.universe.value.id){
		
			GameGlobal.universe.value = {... GameGlobal.universe.value,
				funds: universe.funds,
				taxRate: universe.taxRate,
			};
			break;
		}
	}

		
	console.log("All citizens paid to minister");
	console.log({
		declaredVsPaid: data.declaredVSPaidUniverse,
	})

	saveGameGlobal();
	
	switchGameState(GameState.Audit);



}

export default function TaxRateSet() {
	useSignals();

	let inputRef = useRef(null);

	function onClick(){
		let inputBox = inputRef.current as HTMLInputElement;

		if(!inputBox.value){
			inputBox.value = inputBox.placeholder;
		}
		let value = _.clamp(Number(inputBox.value), 0, 100);

		socket.emit("set-tax-rate",{

			code: GameGlobal.room.value.gameCode,
			taxRate: (value/100),
			universeId: GameGlobal.universe.value.id,
		});

		socket.on("client-paid-tax", onCitizensPaidTax);

		waiting.value = true;

	}


	return (
		<GameContent isSub isAbsolute>
			{
				waiting.value
				
				? 

				<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
					<div className={`text-lg`}>
						Waiting for citizens to pay taxes...
					</div>
					<div>
						<LoadingStatus/>
					</div>
				</div>

				:
				
				<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
					<div className={`text-lg`}>
						{"What is this year's tax going to be?"}
					</div>
					<div className={`flex flex-row`}>
						<input ref={inputRef} type="number" placeholder="40" className={`${t.inputBox} ${t.solidText} justify-end flex p-1 rounded-md text-lg`} />
						<div className={`w-12 ${t.fillSolidText}`}>
							<PercentageIcon/>
						</div>
					</div>
					<div className={``}>
						<Btn onClick={onClick}>
							Confirm
						</Btn>
					</div>
				</div>

			}
		</GameContent>
	)
}
