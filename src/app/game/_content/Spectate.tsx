"use client"
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import GameContentContainer, { GameContent } from '@/components/Game/GameContentContainer'
import GameHUD, { WorldHUD, PlayerHUD } from '@/components/Game/GameHUD'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'
import React from 'react'

function ContentStuff(){
	return (
		<GameContent id={``} className={`border border-green-500 w-full md:w-5/6 h-full`}>
			<div className={`p-4 gap-2 grid grid-cols-12 border border-red-500 w-full`}>
				<div className={`border col-span-5`}>
					Mik
				</div>
				<div className={`border col-span-2`}>
					Milk
				</div>
				<div className={`border col-span-4`}>
					Milk3
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
