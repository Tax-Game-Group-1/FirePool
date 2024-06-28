"use client"
import { GameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import React from 'react'
import { switchGameState } from './InGame'
import { GameState } from '@/interfaces'

function onProceed(){
	switchGameState(GameState.Stats);
}

export default function YearEnd() {
	return (
		<GameContent isSub className={`w-1/3`}>
			<div className={`flex flex-col justify-center items-center w-full gap-4 p-4 py-8`}>
				<div>Year {GameGlobal.room.value.roundNumber || 0} has ended.</div>
				<div>
					<Btn onClick={onProceed}>
						View Results
					</Btn>
				</div>
			</div>
		</GameContent>
	)
}
