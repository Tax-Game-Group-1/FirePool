"use client"
import { GameGlobal, saveGameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import React, { useEffect } from 'react'
import { PlayerDataSlot, roleToString, UniverseDataSlot } from './Spectate'
import { computed, signal } from '@preact/signals-react'

import t from "../../../elements.module.scss"
import { randomID } from '@catsums/my';
import { useSignals } from '@preact/signals-react/runtime'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'
import { socket } from '@/app/socket'
import { UniverseData, PlayerData } from '&/gameManager/interfaces'
import { createNotif } from '@/components/Notification/Notification'
import { setGameScreen, GameScreen } from '../layouts'

export let salary = computed(()=>{
	let s = GameGlobal.player.value.salary || 0;
	return s;
})
export let declared = computed(()=>{
	let s = GameGlobal.player.value.declated || 0;
	return s;
})
export let taxRate = computed(()=>{
	let s = GameGlobal.universe.value.taxRate || 0;
	return s;
})
export let tax = computed(()=>{
	let s = salary.value * taxRate.value;
	return s || 0;
})

export const universes = computed(()=>{
	let u = GameGlobal.room.value.universes || [];
	return u;
});
export const players = computed(()=>{
	let u = universes.value as Array<any>;
	let p = [];
	for(let universe of u){
		let players = universe.players;
		p.push(universe.minister);
		for(let player of players){
			p.push(player);
		}
	}
	return p;
});


function onProceed(){
	switchGameState(GameState.Processing);
}

export enum StatsMode {
	LeaderBoard,
	Statistics,
}

let mode = signal(StatsMode.Statistics)

export default function Stats() {
	useSignals();


	// let universesData = universes.value?.map((uni, i)=>{
	// 	return (
	// 		<UniverseDataSlot key={i} name={uni.minister?.name} index={i} funds={uni.funds}/>
	// 	)
	// }) || []
	let playersData = players.value?.map((p, i)=>{
		return (
			<PlayerDataSlot showFunds key={i} name={p.name} index={i} funds={p.funds} role={roleToString(p.role)}/>
		)
	}) || [];

	function switchModeTo(newMode: StatsMode){
		mode.value = newMode;
	}

	return (
		<GameContent isSub className={`w-4/5 md:w-3/5 h-5/6`}>
			<div className={`flex flex-col justify-start items-center w-full h-full gap-4 p-4`}>
				<div className={`self-start text-lg flex flex-row gap-2 ${t.toolBar} rounded-md p-1`}>
					<div className={`rounded-md ${mode.value == StatsMode.LeaderBoard && t.solidElement} p-1`} onClick={()=>{
						switchModeTo(StatsMode.LeaderBoard)
					}}>
						Leaderboard
					</div>
					<div className={`rounded-md ${mode.value == StatsMode.Statistics && t.solidElement} p-1`} onClick={()=>{
						switchModeTo(StatsMode.Statistics)
					}}>
						Statistics
					</div>
				</div>
				<div className={`flex flex-row justify-center items-start gap-4 h-[90%] w-full`}>
					{
						mode.value === StatsMode.LeaderBoard && 

						<div className={`flex flex-col justify-start items-baseline overflow-auto border ${t.accentBorder} rounded-md h-full w-full`}>
							{
								playersData.length ?
								playersData
								:
								<div className={`w-full p-2 rounded-md ${t.toolBar}`}>
									No players found...
								</div>
							}
						</div>
					}{
						mode.value == StatsMode.Statistics &&
						<div className={`flex flex-col justify-start items-baseline overflow-auto  rounded-md h-full w-full`}>
							<div className={`w-full flex-row justify-between items-center flex p-2 my-2 rounded-md ${t.toolBar}`}>
								<div>Name</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>{GameGlobal.player.value?.name}</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Salary</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(salary.value).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Declared Tax</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(declared.value).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Actual Tax</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(tax.value).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Fined?</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{GameGlobal.player.value.fined ? "Yes" : "No"}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Audited?</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{GameGlobal.player.value.audited ? "Yes" : "No"}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 my-1 text-xl rounded-md ${t.toolBar}`}>
								<div>Total Funds</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(GameGlobal.player.value.funds).toFixed(2)}
								</div>
							</div>
						</div>
					}
					<div className={`flex flex-col h-full justify-end items-center`}>
						<Btn onClick={onProceed}>
							Proceed
						</Btn>
					</div>
				</div>
			</div>
		</GameContent>
	)
}
