"use client"
import { GameGlobal } from '@/app/global'
import Btn from '@/components/Button/Btn'
import { GameContent } from '@/components/Game/GameContentContainer'
import React from 'react'
import { role, switchGameState } from './InGame'
import { PlayerRole } from '&/gameManager/interfaces'
import { GameState } from '@/interfaces'

function onProceed(){
    
    if(role.value == PlayerRole.MINISTER){
        switchGameState(GameState.TaxRateSet);
    }else if(role.value){
        switchGameState(GameState.SalarySet);
    }
}

export default function YearStart() {
	return (
		<GameContent isSub className={`w-1/3`}>
			<div className={`flex flex-col justify-center items-center w-full gap-4 p-4 py-8`}>
				<div>Year {GameGlobal.room.value.roundNumber || 0} has begun.</div>
				<div>
					<Btn onClick={onProceed}>
						View Results
					</Btn>
				</div>
			</div>
		</GameContent>
	)
}
