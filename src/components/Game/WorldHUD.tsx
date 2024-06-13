"use client"
import React, { forwardRef, Ref } from "react"
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { CurrencyIcon, PercentageIcon } from "@/assets/svg/icons";

export const WorldHUD = forwardRef(function WorldHUD({}, ref:Ref<any>){
	return (
		<div ref={ref} className="world-hud bg-white text-black rounded-md p-2 flex flex-col gap-1">
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
});
