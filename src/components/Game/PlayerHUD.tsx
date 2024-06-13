"use client"

import React, { forwardRef, Ref } from "react"
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { CurrencyIcon, StatsIcon } from "@/assets/svg/icons";

export const PlayerHUD = forwardRef(function PlayerHUD({}, ref:Ref<any>){
	return (
		<div ref={ref} className="player-hud border-2 border-white rounded-md p-2 inline-flex justify-center items-center flex-row gap-3 max-w-full">
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
})