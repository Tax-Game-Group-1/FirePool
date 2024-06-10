
import React from "react"
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon, PercentageIcon } from "@/assets/svg/icons";

export function WorldHUD(){
	return (
		<div className="world-hud bg-white text-black rounded-md p-2 flex flex-col gap-1">
			<div className="flex gap-2 justify-between">
				<div className="world-year-label mx-1 text-sm">
					<span>World name</span>
				</div>
				<div className="flex font-bold">
					<span>Mike Hunt</span>
				</div>
			</div>
			<div className="flex gap-2">
				<div className="flex flex-col justify-between border border-white">
					<div className="world-taxrate-label mx-1 text-sm">
						<span>Tax Rate</span>
					</div>
					<div className="world-taxrate mx-1 text-white bg-black rounded-md p-1 flex justify-end min-w-24">
						<span className="world-taxrate-value">40</span>
						<span className="percent-icon px-0 w-5">
							<SVGIcon>
								<PercentageIcon fill='white'/>
							</SVGIcon>
						</span>
					</div>
				</div>
				<div className="flex flex-col justify-between self-end border border-white min-w-40">
					<div className="world-year-label mx-1 ml-8 text-sm">
						<span>Year</span>
					</div>
					<div className="world-year mx-1 ml-8 text-white bg-black rounded-md p-1 flex justify-end">
						<span className="world-year-value">1</span>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<div className="flex flex-col justify-items-end border border-white min-w-40">
					<div className="world-funds-label world-funds mx-1 ml-8 text-sm">
						<span>World Funds</span>
					</div>
					<div className="mx-1 ml-8 text-white bg-black rounded-md p-1 text-xl flex justify-end">
						<div className="w-6 flex justify-start player-currency-icon">
							<SVGIcon>
								<CurrencyIcon fill='white'/>
							</SVGIcon>
						</div>
						<div className="world-funds-amount mx-1 ml-8">
							<span className="world-funds-value">1000.00</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function PlayerHUD(){
	return (
		<div className="player-hud border-2 border-white rounded-md p-2 inline-flex justify-center items-center flex-row gap-3">
			<div className="player-hud-icon min-h-24 aspect-square border-2 border-white rounded-md p-2 flex self-center items-center justify-center">
				<div className="icon bg-white w-full h-full rounded-md">

				</div>
			</div>
			<div className="flex flex-col items-stretch min-w-64 gap-2">
				<div className="flex justify-between gap-2">
					<div className="flex flex-col justify-center items-start">
						<div className="p-1 text-xl">
							<span className="player-name-value">Qwertyuiopasdfghjklzxcvbnm</span>
						</div>
						<div className="border border-white rounded-3xl p-1 px-4 flex justify-center text-sm">
							<span className="player-role-value">Qwertyuiopasdfghjklzxcvbnm</span>
						</div>
					</div>
					<div className="w-10 flex flex-col justify-start items-center gap-1 p-1">
						<div className="aspect-square w-8"></div>
						<div className="aspect-square w-8 p-0">
							<SVGIcon className="p-1 m-0 border border-white rounded-md">
								<StatsIcon className="rounded-md border" fill='white'/>
							</SVGIcon>
						</div>
					</div>
				</div>
				<div className="flex justify-between self-end border border-white rounded-md p-1 text-xl">
					<div className="w-6 flex justify-start player-currency-icon">
						<SVGIcon>
							<CurrencyIcon fill='white'/>
						</SVGIcon>
					</div>
					<div className="player-currency-amount mx-1 ml-8">
						<span className="player-currency-value">100.00</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function GameHUD({children}:{
	children?: React.ReactNode
}){	
	return (
		<div className="game-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col items-end justify-between">
			{children}
		</div>
	)
}