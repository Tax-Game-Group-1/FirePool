
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer'
import GameContentContainer, { GameContent } from '@/components/Game/GameContentContainer'
import GameHUD, { WorldHUD, PlayerHUD } from '@/components/Game/GameHUD'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'
import React from 'react'

export default function InGame() {
  return (
	<ContentLayersContainer>
		<ContentLayer z={100}>
			<GameHUD>
				<WorldHUD/>
				<PlayerHUD/>
			</GameHUD>
		</ContentLayer>

		<ContentLayer z={1}>
			<GameContentContainer>
				
			</GameContentContainer>
		</ContentLayer>

		<ContentLayer z={200}>
			<PopUpContainer>
			</PopUpContainer>
		</ContentLayer>
		<ContentLayer z={300}>
			<NotifContainer>
			</NotifContainer>
		</ContentLayer>
	</ContentLayersContainer>
  )
}
