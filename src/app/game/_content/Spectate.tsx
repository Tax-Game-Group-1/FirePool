"use client"
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import GameContentContainer, { GameContent } from '@/components/Game/GameContentContainer'
import GameHUD, { WorldHUD, PlayerHUD } from '@/components/Game/GameHUD'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'
import React, { Ref } from 'react'

import t from "../../../elements.module.scss"
import Btn from '@/components/Button/Btn'
import {forwardRef} from 'react';
import { GameGlobal } from '@/app/global'
import { computed, signal } from '@preact/signals-react'

import { PlayerRole } from '&/gameManager/interfaces'

export function roleToString(role: PlayerRole){
	switch(role){
		case PlayerRole.MINISTER: return "Minister";
		case PlayerRole.LOCAL_WORKER:  return "Local Worker";
		case PlayerRole.FOREIGN_WORKER:  return "Foreign Worker";
	}
	return "No Role";
}

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

export const UniverseDataSlot = forwardRef(function UniverseDataSlot({index=0, name="", funds=0}:{
	index?:number,
	name?:string,
	funds?:number
}, ref:Ref<any>){


	return (
		<div ref={ref} className={`${t.toolBar} ${t.solidText} rounded-md grid grid-cols-12 p-3 gap-1`}>
			<div className={`col-span-1 text-center p-1 aspect-square rounded-md ${t.accent}`}>{index}</div>
			<div className={`col-span-7 text-left p-1`}>{name}</div>
			<div className={`col-start-9 col-span-4 text-right p-1`}>{funds.toFixed(2)}</div>
		</div>
	)
})
export const PlayerDataSlot = forwardRef(function PlayerDataSlot({index=0, name="", role="A", funds=0, showFunds=false}:{
	index?:number,
	name?:string,
	role?:string,
	funds?:number,
	showFunds?:boolean,
}, ref:Ref<any>){


	return (
		<div className={`${t.toolBar} ${t.solidText} rounded-md grid grid-cols-12 p-3 gap-1`}>
			<div className={`col-span-1 text-center p-1 aspect-square rounded-md ${t.accent}`}>{index}</div>
			<div className={`col-span-4 text-left p-1`}>{name}</div>
			<div className={`col-span-3 text-left right-1`}>{funds.toFixed(2)}</div>
			<div className={`col-start-9 col-span-4 text-center p-1`}>{role}</div>
		</div>
	)
})

export function ContentStuff(){

	console.log({universes:universes.value, players:players.value})
	console.log("universe type" + typeof universes.value);
	console.log("player type" + typeof players.value);

	let universesData = universes.value?.map((uni, i)=>{
		return (
			<UniverseDataSlot key={i} name={uni.minister?.name} index={i} funds={uni.funds}/>
		)
	}) || []
	let playersData = players.value?.map((p, i)=>{
		return (
			<PlayerDataSlot showFunds key={i} name={p.name} index={i} funds={p.funds} role={roleToString(p.role)}/>
		)
	}) || [];


	return (
		<GameContent isSub id={``} className={` w-full md:w-5/6 h-full`}>
			<div className={`p-4 gap-2 grid grid-cols-12 w-full `}>
				<div className={` col-span-5 flex flex-col gap-2`}>
					<div className={`flex flex-row justify-between gap-2`}>
						<div className={`${t.toolBar} rounded-md p-2`}>Year 1</div>
						<div className={`${t.buttonBackground} ${t.buttonBorder} border rounded-md p-2`}>View Game Stats</div>
					</div>
					<div className={``}>
						<div className={`h-32`}>
							
						</div>
					</div>
					<div className={` border-blue-200 flex flex-row justify-between gap-2`}>
						<div className={`border ${t.buttonBackground} ${t.buttonBorder} rounded-md p-1`}>View Universe Stats</div>
						<div className={`border ${t.buttonBackground} ${t.buttonBorder} rounded-md p-1`}>Export Data</div>
					</div>
					<div className={` flex flex-col max-h-72`}>
						<div>Universes</div>
						<div className={`flex flex-col overflow-auto gap-2`}>
							
							{universesData}
							
						</div>
					</div>
				</div>
				<div className={`flex flex-col gap-2 col-span-6`}>
					<div className={` flex flex-row justify-between`}>
						<div className={` ${t.toolBar} rounded-md p-2`}>Players</div>
						<div className={` ${t.buttonBackground} ${t.buttonBorder} border rounded-md p-2`}>View Player Stats</div>
					</div>
					<div className={` flex flex-col h-72`}>
						<div className={`flex flex-col overflow-auto gap-2`}>
							
							{playersData}
							
						</div>
					</div>
					<div className={`flex flex-row justify-evenly p-2 gap-2`}>
						<Btn>
							Export Data
						</Btn>
						<Btn>
							End Game
						</Btn>
					</div>
				</div>
			</div>
		</GameContent>
	)
}

export default function Spectate() {
  return (
	<ContentLayersContainer>
		<ContentLayer z={1}>
			<GameContentContainer>
				<ContentStuff/>
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
