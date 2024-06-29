"use client"
import { GameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import React from 'react'
import { role, switchGameState } from './InGame'
import { PlayerRole } from '&/gameManager/interfaces'
import { GameState } from '@/interfaces'
import { useSignals } from '@preact/signals-react/runtime'

function onProceed(){
    
	switchGameState(GameState.SalarySet);
}

export default function YearStart() {
	useSignals();
	return (
		<GameContent isSub className={`w-1/3`}>
			<div className={`flex flex-col justify-center items-center w-full gap-4 p-4 py-8`}>
				<div>Year {GameGlobal.room.value.roundNumber || 0} has begun.</div>
				<div>
					<Btn onClick={onProceed}>
						Start
					</Btn>
				</div>
			</div>
		</GameContent>
	)
}
