import React from 'react'
import Image from "next/image"

import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon } from '@/assets/svg/icons'
import SVGIcon from '@/components/SVGIcon/SVGIcon'

export default function Game() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
		<main className="row-span-11 bg-black rounded-md flex p-1 relative ">
			<div className="border border-red-500 game-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col items-end justify-between">
				<div className="player-hud border border-green-500 p-2">
					World HUD
				</div>
				<div className="player-hud border-2 border-white rounded-md p-2 inline-flex justify-center items-center flex-row gap-2">
					<div className="min-h-24 aspect-square border border-red-500 flex self-center items-center justify-center">
						Icon
					</div>
					<div className="flex flex-col items-stretch min-w-64 gap-2 border border-green-800">
						<div className="flex justify-between gap-2">
							<div className="flex flex-col justify-center items-start gap-2">
								<div className="border border-red-900 p-1 text-lg">
									My Name Here
								</div>
								<div className="border border-white rounded-3xl p-1 px-4 flex justify-center text-sm">
									Role Here
								</div>
							</div>
							<div className="w-10 border border-green-500 flex flex-col justify-start items-center gap-1 p-1">
								<div className="bg-red-400 aspect-square w-5"></div>
								<div className="aspect-square w-5 border border-white">
									<SVGIcon>
										<StatsIcon fill='white'/>
									</SVGIcon>
								</div>
							</div>
						</div>
						<div className="flex justify-between self-end border border-white rounded-md p-1 w-3/5">
							<div className="w-6 flex justify-start">
								<SVGIcon>
									<CurrencyIcon fill='white'/>
								</SVGIcon>
							</div>
							<div className="">100000.00</div>
						</div>
					</div>
				</div>
			</div>
			<div className="border border-red-500 player-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col justify-center items-center">
				<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-start">
					Left Content
				</div>
				<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-center">
					Center Content
				</div>
			</div>
		</main>
		<footer className="row-span-1 grid grid-cols-12 bg-black rounded-md p-0 md:p-1 gap-2 text-sm">
			<div className="border border-white rounded-md col-span-3 px-2 flex items-center justify-center">
				<div className="">Game Code:</div>
				<div className="bg-white text-black p-1 px-2 mx-2 rounded-md">ABCD1234</div>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-3">
				<span className="">Game:</span><span className="game-name px-1">Game 1</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-2">
				<span className="">Players:</span>
				<span className="px-1">
					<span className="player-count px-1">8</span>
					/
					<span className="player-max-count px-1">10</span>
				</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-2">
			<span className="">Host:</span><span className="host-name px-1">Dr F. Tax</span>
			</div>
			<div className="flex relative justify-center items-center border border-white rounded-md col-start-11">
				<SVGIcon className="">
					<BackSquare fill='white'/>
				</SVGIcon>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-start-12">
				<SVGIcon className="">
					<ExitDoor fill='white'/>
				</SVGIcon>
			</div>
		</footer>
	</div>
  )
}
