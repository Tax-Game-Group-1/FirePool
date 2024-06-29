"use client"
import { GameContent } from '@/components/Game/GameContentContainer'
import React, { useEffect, useRef, useState } from 'react'

import t from "../../../elements.module.scss"
import { CurrencyIcon, PercentageIcon } from '@/assets/svg/svg'
import Btn from '@/components/Button/Btn'
import { GameGlobal } from '@/app/global'
import { socket } from '@/app/socket'
import _ from 'lodash'
import { createPopUp } from '@/components/PopUp/PopUp'
import { signal, useSignal } from '@preact/signals-react'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'
import { animate } from 'framer-motion'
import { createNotif } from '@/components/Notification/Notification'
import { computed } from '@preact/signals-react'
import LoadingStatus from '@/components/Loading/Loading'
import { useSignals } from '@preact/signals-react/runtime'

let waiting = signal(true);
let revealed = signal(false);

let oldFunds = signal(0);

let received = computed(()=>{
	let r = oldFunds.value - GameGlobal.player.value.funds;
	return r;
})

let newFunds = computed(()=>{
	let currFunds = GameGlobal.universe.value.funds;
	let taxCoeff = GameGlobal.room.value.taxCoefficient;

	return currFunds * taxCoeff;
})

function redistributeFunds(percentage: number){
	socket.emit("redistribute",{
		universeId: GameGlobal.universe.value.id,
		code: GameGlobal.room.value.gameCode,
		redistributionPercentage: percentage,
	})

	socket.once("client-redistribution", ({success, data, message})=>{
		if(!success){
			createNotif({
				content: `Error when redistributing: ${message}`
			})
			return;
		}

		let minister = data.universeData.minister;

		GameGlobal.player.value = {...GameGlobal.player.value, funds: minister.funds};

		onProceed();
	})
}

function onProceed(){

	//advance to round end

	switchGameState(GameState.YearEnd);
}

export function CitizenRedistribution(){
	useSignals()

	let [waitingforRedistribution, setWaitingforRedistribution] = useState(true);

	let hiderRef = useRef(null);
	let amountRef = useRef(null);

	async function onReveal(){
		if(revealed.value) return;

		await animate(hiderRef.current, {
			opacity: [1,0],
			y: [0, 100],
		}, {duration: 0.2});
		revealed.value = true;
		await animate(amountRef.current, {
			scale: [1, 1.2],
		}, {duration: 0.3, ease:"backInOut"});

	}

	useEffect(()=>{
		socket.on("client-redistribution", ({success, data, message})=>{
			if(!success) return;

			let players = data.universeData.players;

			for(let player of players){
				if(GameGlobal.player.value.id == player.id){
					oldFunds.value = GameGlobal.player.value.funds;
					GameGlobal.player.value = {...GameGlobal.player.value, funds: player.funds};
					break;
				}
			}
			
			setWaitingforRedistribution(false)
			// waiting.value = false;
		})
	},[])


	return (
		<GameContent isSub className={`w-5/6 md:w-2/5 h-1/2 justify-center items-center flex-col`}>
			<div className={`flex flex-col justify-center items-center gap-4 p-4 w-full`}>
				{
					waitingforRedistribution && 
					<div>
						<div>Waiting for redistribution of funds to you</div>
						<LoadingStatus/>
					</div>
				}
				{
					!waitingforRedistribution &&
					<>
								<div>{
							revealed.value ?
							`You received`
							:
							`It's time to receive your redistribution of the year. Your new amount is:`
						}</div>
						<div onClick={onReveal} className={` pointer-events-auto relative flex flex-col w-full items-center h-1/4 ${t.toolBar} rounded-md`}>
							<div ref={amountRef} className={`z-[1] absolute ${t.fillSolidText} ${t.currencyIcon} ${t.toolBar} border items-center justify-center gap-4 text-xl flex flex-row rounded-md w-full h-full p-2`}>
								<div className={`flex w-1/12 rounded-full border ${t.solidBorder}`}>
									<CurrencyIcon/>
								</div>
								<div className={`flex`}>
									{(GameGlobal.player.value.funds)?.toFixed(2)}
								</div>
							</div>
							<div ref={hiderRef} className={`z-[2] ${t.fillSolidText} ${t.currencyIcon} ${t.toolBar} border items-center flex flex-col rounded-md w-full h-full p-2`}>
								<div className={`rounded-full border w-1/12 aspect-square ${t.solidBorder}`}>
									<CurrencyIcon/>
								</div>
							</div>
						</div>
						{
							revealed.value ?
							<>
								<div className={`flex justify-center items-center text-center text-base`}>
									Congratulations! You received <span className={`p-2 m-2 ${t.toolBar} rounded-md`}>R {(received.value).toFixed(2)}</span> for this round.
								</div>
								<div className={`flex justify-center items-center text-center text-base`}>
									<Btn onClick={onProceed}>
										Proceed
									</Btn>
								</div>
							</>

							:

							<>
								<div className={`flex justify-center items-center text-center text-lg`}>
									Press to receive your redistribution
								</div>
								<div className={`flex justify-center items-center text-center text-xs`}>
									This is provided by the universe
								</div>
							</>
						}
					</>
				}
				
				
			</div>
		</GameContent>
	)

}

export function MinisterRedistribution() {

	let inputRef = useRef(null);

	function onBlurOut(){
		let inputBox = inputRef.current as HTMLInputElement;
		let value = _.clamp(Number(inputBox.value), 0, 100);

		inputBox.value = `${value}`;
	}

	function onRedistributeClick(){
		let inputBox = inputRef.current as HTMLInputElement;
		let value = _.clamp(Number(inputBox.value), 0, 100);

		if(value == 0){
			//just summon that same pop up and handle it the same way as distributing nothing
			onDontRedistributeClick();
		}else{
			redistributeFunds(value);
		}


	}
	function onDontRedistributeClick(){
		createPopUp({
			content: "Are you sure you want to redistribute 0% of the funds to the citizens?",
			buttons:{
				"Yes": ()=>{
					redistributeFunds(0);
				},
				"No":()=>{},
			}
		})
	}
	

	return (
		<GameContent isSub className={`w-1/2 justify-center items-center`}>
			<div className={`flex flex-col justify-center items-center p-2 w-full relative`}>
				<div className={`gap-2 flex flex-col text-sm`}>
					<div className={`flex flex-row justify-between gap-8 items-center w-full`}>
						<div>Funds received</div>
						<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
							<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
							<div className={``}>{(GameGlobal.universe.value?.funds)?.toFixed(2)}</div>
						</div>
					</div>
					<div className={`flex flex-row justify-between gap-8 items-center w-full`}>
						<div>Tax co-efficient</div>
						<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.solidElement}`}>
							<div className={``}>x {GameGlobal.room.value?.taxCoefficient}</div>
						</div>
					</div>
					<div className={`flex flex-row justify-between gap-8 my-2 items-center w-full text-2xl`}>
						<div>New funds</div>
						<div className={`flex flex-row justify-between items-center p-2 rounded-md gap-2 ${t.toolBar}`}>
							<div className={`w-8 rounded-full border ${t.currencyIcon} ${t.solidBorder} ${t.fillSolidText} justify-center items-center`}><CurrencyIcon/></div>
							<div className={``}>{(newFunds.value)?.toFixed(2)}</div>
						</div>
					</div>
				</div>
				<div className={`gap-2 flex flex-col p-2`}>
					<div className={`flex flex-row justify-center items-center text-center w-full`}>
						How much would you like to redistribute back to the citizens?
					</div>
					<div className={`flex flex-row justify-center items-center p-2 rounded-md gap-2`}>
						<input ref={inputRef} type="number" placeholder="50" onBlur={onBlurOut} className={`${t.inputBox} text-right p-2 flex justify-center rounded-md`}/>
						<div className={`w-8 ${t.fillSolidText} justify-center items-center`}><PercentageIcon/></div>
					</div>
					<div className={`flex flex-col justify-between gap-2 items-center w-full`}>
						<Btn onClick={onRedistributeClick}>
							{`Redistribute`}
						</Btn>
						<Btn onClick={onDontRedistributeClick}>
							{`Don't redistribute at all`}
						</Btn>
					</div>
				</div>
			</div>
		</GameContent>
	)
}
