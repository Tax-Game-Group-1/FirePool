import React, { lazy, Suspense } from 'react'
import Image from "next/image"

import GameHUD, {WorldHUD, PlayerHUD} from '@/components/GameHUD/GameHUD'
import GameFooter from '@/components/GameFooter/GameFooter'
import GameContentContainer, { GameContent } from '@/components/GameContentContainer/GameContentContainer'
import AnimationContainer from './AnimationContainer';
import { stagger } from 'framer-motion'

export default function Game() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
		<main className="row-span-11 bg-black rounded-md flex p-2 relative justify-center items-center">
			<div className="flex rounded-md w-full h-full">

				<GameHUD>
					<WorldHUD/>
					<PlayerHUD/>
				</GameHUD>

				<GameContentContainer>
					<AnimationContainer 
						className="opacity-0" 
						enter={{
							animations:{
								opacity: [0,1],
								y: [-100, 0],
							},
							options:{
								duration: 0.5,
								ease: "circInOut",
								delay: 0.0,
							}
						}}
					>
						<GameContent className="absolute self-end m-2">
							<div className="min-w-24 aspect-square bg-green-200"></div>
						</GameContent>
					</AnimationContainer>
					<AnimationContainer 
						className="opacity-0" 
						enter={{
							animations:{
								opacity: [0,1],
								y: [-100, 0],
							},
							options:{
								duration: 0.5,
								ease: "circInOut",
								delay: 0.1,
							}
						}}
					>
						<GameContent className="absolute self-center m-2">
							<div className="min-w-24 aspect-square bg-blue-200"></div>
						</GameContent>
					</AnimationContainer>
					<AnimationContainer 
						className="opacity-0" 
						enter={{
							animations:{
								opacity: [0,1],
								y: [-100, 0],
							},
							options:{
								duration: 0.5,
								ease: "circInOut",
								delay: 0.2,
							}
						}}
					>
						<GameContent className="absolute self-start m-2">
							<div className="min-w-24 aspect-square bg-red-200"></div>
						</GameContent>
					</AnimationContainer>
				</GameContentContainer>

			</div>
		</main>
		<GameFooter/>
	</div>
  )
}
