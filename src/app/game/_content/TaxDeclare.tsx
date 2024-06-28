"use client"

import { GameContent } from '@/components/Game/GameContentContainer'
import React, { useRef } from 'react'

import t from "../../../elements.module.scss"
import { CurrencyIcon, PercentageIcon } from '@/assets/svg/svg'
import Btn from '@/components/Button/Btn'
import { GameGlobal } from '@/app/global'
import { socket } from '@/app/socket'
import _ from 'lodash'

import { createNotif } from '@/components/Notification/Notification'
import { GameState } from '@/interfaces'
import { switchGameState } from './InGame'
import LoadingStatus from '@/components/Loading/Loading'
import { computed, signal } from '@preact/signals-react'
import { createPopUp } from '@/components/PopUp/PopUp'

let waiting = signal(false)

let salary = computed(()=>{
	let s = GameGlobal.player.value.salary;
	return s;
})
let taxRate = computed(()=>{
	let s = GameGlobal.universe.value.taxRate;
	return s;
})
let tax = computed(()=>{
	let s = salary.value * taxRate.value;
	return s;
})

/*

export interface declarePlayerArray {
  incomeReceived: number;
  declared: number;
  calculatedTax: number;
}

export interface declarePlayer {
  id: string, 
  delcared: declarePlayerArray[]
}

what object receved: 

export interface declaredVsPaidUniverse {
  universeId: string, 
  declaredVsPaidPlayers: declarePlayer[]
}

*/

function onCitizensPaidTax({success, data, message}){
	if(!success){
		createNotif({
			content: `Error: ${message}`,
		})
		return;
	}

	GameGlobal.universe.value.declared = data.declaredVSPaidUniverse;

	
	console.log("All citizens paid");
	console.log({
		declaredVsPaid: data.declaredVSPaidUniverse,
	})

	switchGameState(GameState.Audit);

}

export default function TaxDeclare() {

	let inputRef = useRef(null);

	function onConfirm(){
		let inputBox = inputRef.current;
	
		let value = _.clamp(Number(inputBox.value), 0, salary.value);
	
		socket.emit("pax-tax",{
			code: GameGlobal.room.value.gameCode,
			received: salary.value,
			universeId: GameGlobal.universe.value.id,
			declared: value,
		});
	
		socket.on("client-paid-tax", onCitizensPaidTax);
	
		waiting.value = true;

		let playerdata = GameGlobal.player.value;
		
		GameGlobal.player.value = {...playerdata,
			funds: playerdata.funds + salary.value - value,
			salary: playerdata.salary,
			declared: value,
		}

	}

	function onClick(){
		let inputBox = inputRef.current;
	
		let value = _.clamp(Number(inputBox.value), 0, salary.value);
	
		if(value < tax.value){
			createPopUp({
				content:(
					<div className={`flex flex-col justify-center items-center gap-4`}>
						<div>Are you sure you want to declare this amount?</div>

						<div className={`${t.toolBar} p-4 justify-end`}>
							{(value)}
						</div>

						<div>
							<p>This is {(tax.value - value)} credits away from the expected amount.</p>
							<p>You get to keep the profit, but you might face a penalty for being audited. </p>
						</div>

					</div>
				),
				buttons: {
					"Yes": onConfirm,
					"No": ()=>{},
				}
			})
		}
	}

	return (
		<GameContent isSub isAbsolute>
			{
				waiting.value
				
				? 

				<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
					<div className={`text-lg`}>
						Waiting for other citizens to declare taxes...
					</div>
					<div>
						<LoadingStatus/>
					</div>
				</div>

				:
				
				<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
					<div className={`flex flex-row justify-between items-center w-full`}>
						<div>Income Received</div>
						<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
							<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
							<div className={``}>{salary.value}</div>
						</div>
					</div>
					<div className={`flex flex-row justify-between items-center w-full`}>
						<div>Calculated tax income</div>
						<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
							<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
							<div className={``}>{tax.value}</div>
						</div>
					</div>
					<div className={`text-lg`}>
						What is the the tax amount you want to pay?
					</div>
					<div className={`flex flex-row justify-between items-center w-full`}>
						<input placeholder={`${tax.value}`} step="0.01" type="number" className={`flex flex-row justify-center text-right items-center p-2 rounded-md gap-2 ${t.toolBar}`} />	
					</div>
					<div>
						<Btn onClick={onClick}>
							<div>Proceed</div>
						</Btn>
					</div>
				</div>

			}
		</GameContent>
	)
}
