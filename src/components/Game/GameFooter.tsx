
import React from 'react'

import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon, PercentageIcon, CopyIcon } from "@/assets/svg/icons";

export default function GameFooter() {
  return (
	<footer className="row-span-1 grid grid-cols-12 bg-black rounded-md p-0 md:p-1 gap-2 text-sm">
			<div className="rounded-md col-span-3 px-2 flex items-center justify-center">
				<div className="mx-2">Game Code:</div>
				<div className="bg-white text-black font-medium text-xs p-2 rounded-md">ABCD1234</div>
				<div className="px-2 w-12 h-full flex justify-center items-center">
					<SVGIcon className="">
						<CopyIcon fill="none" stroke="white"/>
					</SVGIcon>
				</div>
			</div>
			<div className="flex justify-center items-center rounded-md col-span-3">
				<span className="">Game:</span><span className="game-name px-1">Game 1</span>
			</div>
			<div className="flex justify-center items-center rounded-md col-span-2">
				<span className="">Players:</span>
				<span className="px-1">
					<span className="player-count px-1">8</span>
					/
					<span className="player-max-count px-1">10</span>
				</span>
			</div>
			<div className="flex justify-center items-center rounded-md col-span-2">
			<span className="">Host:</span><span className="host-name px-1">Dr F. Tax</span>
			</div>
			<div className="flex relative justify-center items-center rounded-md col-start-11 px-2 w-12">
				<SVGIcon className="">
					<BackSquare fill='white'/>
				</SVGIcon>
			</div>
			<div className="flex justify-center items-center rounded-md col-start-12 px-2 w-12">
				<SVGIcon className="">
					<ExitDoor fill='white'/>
				</SVGIcon>
			</div>
		</footer>
  )
}
