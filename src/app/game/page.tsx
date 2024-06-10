import React from 'react'
import Image from "next/image"

import { BackSquare } from '@/assets/svg/icons'
import SVGIcon from '@/components/SVGIcon/SVGIcon'

export default function Game() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-4 p-4">
		<main className="row-span-11 bg-black rounded">
			Game
		</main>
		<footer className="row-span-1 grid grid-cols-12 bg-black rounded p-0 md:p-2 gap-2 text-sm">
			<div className="border border-white rounded col-span-3 px-2 flex items-center justify-center">
				<div className="">Game Code:</div>
				<div className="bg-white text-black px-2 mx-2 rounded">ABCD1234</div>
			</div>
			<div className="flex justify-center items-center border border-white rounded col-span-3">
				<span className="">Game:</span><span className="game-name px-1">Game 1</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded col-span-2">
				<span className="">Players:</span>
				<span className="px-1">
					<span className="player-count px-1">8</span>
					/
					<span className="player-max-count px-1">10</span>
				</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded col-span-2">
			<span className="">Host:</span><span className="host-name px-1">Dr F. Tax</span>
			</div>
			<div className="flex relative justify-center items-center border border-white rounded col-start-11">
				<SVGIcon className=" w-0 h-0">
					<BackSquare/>
				</SVGIcon>
				{/* <Image className="w-full" src={BackSquare} alt="back button" /> */}
			</div>
			<div className="flex justify-center items-center border border-white rounded col-start-12">
				{/* <span className="">Game:</span><span className="p-1">Game 1</span> */}
			</div>
		</footer>
	</div>
  )
}
