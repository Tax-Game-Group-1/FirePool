import React, { lazy, Suspense } from 'react'
import Image from "next/image"

import GameHUD, {WorldHUD, PlayerHUD} from '@/components/GameHUD/GameHUD'
import GameFooter from '@/components/GameFooter/GameFooter'

export function GameContent({children}:{
	children?: React.ReactNode,
}){
	return (
		<div className="game-content h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col justify-center items-center">
			{children}
		</div>
	)
}

export default function Game() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
		<main className="row-span-11 bg-black rounded-md flex p-2 relative justify-center items-center">
			<div className="flex rounded-md w-full h-full">

				<GameHUD>
					<WorldHUD/>
					<PlayerHUD/>
				</GameHUD>

				<GameContent>
				<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-start">
					Left Content
				</div>
				<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-center">
					Center Content
				</div>
				</GameContent>

			</div>
		</main>
		<GameFooter/>
	</div>
  )
}
