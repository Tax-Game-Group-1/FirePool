"use client"
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import GameContentContainer, { GameContent } from '@/components/Game/GameContentContainer'
import GameHUD, { WorldHUD, PlayerHUD } from '@/components/Game/GameHUD'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'
import React from 'react'

function ContentStuff(){
	return (
		<div className={``}>
			<GameContent id={``} className={`self-start`}>
				<div className={`p-4 grid grid-cols-12`}>
					<div className={`border col-span-5`}>

					</div>
					<div className={`border col-span-2`}>

					</div>
					<div className={`border col-span-4`}>

					</div>
				</div>
			</GameContent>
		</div>
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
