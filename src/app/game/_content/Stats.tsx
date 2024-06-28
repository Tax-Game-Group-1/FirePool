"use client"
import { GameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import React from 'react'
import { PlayerDataSlot, roleToString, UniverseDataSlot } from './Spectate'
import { computed, signal } from '@preact/signals-react'

import t from "../../../elements.module.scss"
import { randomID } from '@catsums/my';
import { useSignals } from '@preact/signals-react/runtime'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'

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

	let universesData = universes.value?.map((uni, i)=>{
		return (
			<UniverseDataSlot key={i} name={uni.minister?.name} index={i} funds={uni.funds}/>
		)
	}) || []
	// let playersData = players.value?.map((p, i)=>{
	// 	return (
	// 		<PlayerDataSlot showFunds key={i} name={p.name} index={i} funds={p.funds} role={roleToString(p.role)}/>
	// 	)
	// }) || [];
	let playersData = [];

	for(let i=0; i<20; i++){
		playersData.push(
			<PlayerDataSlot name="Red" index={i+1} key={i} showFunds/>
		)
	}

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
								<div className={`p-1 ${t.solidElement} rounded-md`}>Lucy</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Salary</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(0).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Declared Tax</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(0).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Actual Tax</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(0).toFixed(2)}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Fined?</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{true ? "Yes" : "No"}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 rounded-md ${t.toolBar}`}>
								<div>Audited?</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{true ? "Yes" : "No"}
								</div>
							</div>
							<div className={`w-full flex-row justify-between items-center flex p-2 my-1 text-xl rounded-md ${t.toolBar}`}>
								<div>Total Funds</div>
								<div className={`p-1 ${t.solidElement} rounded-md`}>
									{(0).toFixed(2)}
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
