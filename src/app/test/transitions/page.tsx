import React, { lazy, Suspense } from 'react'

import GameContentContainer, { GameContent } from '@/components/GameContentContainer/GameContentContainer'

import Boxes from './testingStuff'

export default function TestPage() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
		<main className="row-span-11 bg-black rounded-md flex p-2 relative justify-center items-center">
			<div className="flex rounded-md w-full h-full">
				<GameContentContainer>
					<Boxes/>
				</GameContentContainer>
			</div>
		</main>
	</div>
  )
}
