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
import { signal } from '@preact/signals-react'


export const universes = signal([]);
export const players = signal([]);

const UniverseData = forwardRef(function UniverseData({index=0, name="", funds=0}:{
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
const PlayersData = forwardRef(function PlayersData({index=0, name="", role="A", funds=0}:{
	index?:number,
	name?:string,
	role?:string,
	funds?:number,
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

	let universesData = universes.value.map((uni, i)=>{
		return (
			<UniverseData key={i} name={uni.name} index={i} funds={uni.funds}/>
		)
	})
	let playersData = universes.value.map((uni, i)=>{
		return (
			<PlayersData key={i} name={uni.name} index={i} funds={uni.funds} role={uni.role}/>
		)
	})


	return (
		<GameContent id={``} className={` w-full md:w-5/6 h-full`}>
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
