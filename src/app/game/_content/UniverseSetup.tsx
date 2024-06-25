"use client"

import { GameGlobal, playerID, playerName } from '@/app/global'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer'
import { GameContent } from '@/components/Game/GameContentContainer'
import { getIconURL } from '@/utils/utils'
import React from 'react'
import { AvatarIcon } from '../_waiting/namingRoom'
import { ConfirmTick } from '@/assets/svg/svg'
import Btn from '@/components/Button/Btn'

import t from "../../../elements.module.scss"
import { computed } from '@preact/signals-react'
import { PlayerDataSlot, roleToString } from './Spectate'
import { PlayerRole } from '&/gameManager/interfaces'
import { GameState } from '@/interfaces'
import { switchGameState } from './InGame'

let players = computed(()=>{
	let players = GameGlobal.universe.value.players || [];
	return players;
})

let role = computed(()=>{
	let role = GameGlobal.player.value.role;
	return role;
})

function onProceed(){
    console.log({role: role.value});
    console.log({playerRole: PlayerRole.MINISTER});
    
    if(role.value == PlayerRole.MINISTER){
        switchGameState(GameState.TaxRateSet);
    }else if(role.value){
        switchGameState(GameState.SalarySet);
    }
}

export default function UniverseSetup() {

	let playersData = players.value.map((player,i)=>{
		return (
			<PlayerDataSlot name={player.name} role={roleToString(player.role)}/>
		)
	})

	return (
		<AnimationContainer
			enter={{
				animations:{
					opacity: [0,1],
					x: [-100, 0]
				},
				options:{
					duration: 0.4,
					ease: "easeIn"
				}
			}}
		>
			<div className={`w-full h-full absolute flex flex-col md:flex-row justify-center items-center gap-2`}>
				<GameContent isSub className={` w-full h-full md:w-3/5 md:h-1/2 flex flex-row justify-evenly items-center`}>
					<div className={`grid grid-cols-12`}>
						<div className={`col-span-4 flex justify-center items-center p-2 self-center border rounded-md`}>
							<AvatarIcon url={getIconURL(playerID.value)}/>
						</div>
						<div className={`col-span-1`}></div>

						<div className={`col-span-6 flex justify-center items-center gap-2 self-center`}>
							<div className={`flex flex-col text-xs gap-2`}>
                                {
                                    (role.value == PlayerRole.MINISTER) ? "This is your universe" : "Welcome to the universe"
                                }
								<div></div>
								<div className={`text-xl ${t.toolBar} ${t.solidText} p-4 rounded-md`}>
									{
                                       (role.value == PlayerRole.MINISTER) ?  playerName : GameGlobal.universe.value?.minister?.name
                                    }
								</div>
								<div className={``}>
                                {
                                    (role.value == PlayerRole.MINISTER) ? "Make sure to take care of your citizens" : "Make sure to feel at home"
                                }
								</div>
								<div className={``}>
									<Btn onClick={onProceed}>
										<div className={`flex flex-row justify-center items-center`}>
											<div>Enter</div>
											<div>
												<ConfirmTick/>
											</div>
										</div>
									</Btn>
								</div>
							</div>
						</div>
					</div>
				</GameContent>
					<GameContent isSub className={`w-full h-fit max-h-full md:w-2/5 flex flex-col justify-center items-center`} style={{

					}}>
						<div className={`flex flex-col justify-start max-h-[40vh] md:max-h-[75vh] w-full relative`}>
							<div>Citizens</div>
							<div className={`flex flex-col justify-start items-center overflow-auto w-full max-h-10vh md:max-h-full relative`}>
								{playersData}
							</div>
						</div>
					</GameContent>
			</div>
		</AnimationContainer>

	)
}
