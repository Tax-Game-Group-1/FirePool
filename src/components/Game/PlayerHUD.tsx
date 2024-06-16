"use client"

import React, { forwardRef, Ref, useState } from "react"
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { CurrencyIcon, SettingsIcon, StatsIcon } from "@/assets/svg/icons";

import t from "../../elements.module.scss";
import style from "./PlayerHUD.module.scss";

export const PlayerHUD = forwardRef(function PlayerHUD({}, ref:Ref<any>){

	let [playerName] = useState("Qwertyuiopasdfghjklzxcvbnm");
	let [playerRole] = useState("Qwertyuiopasdfghjkl");

	let [playerFunds] = useState("100.00");


	return (
		<div ref={ref} className={`${style.playerHUD} ${t.solidElement} ${t.solidText}`}>
			<div className={`${style.HUDIcon} ${t.toolBar}`}>
				<div className={`${style.icon} ${t.solidWindow}`}>

				</div>
			</div>
			<div className="flex flex-col items-stretch min-w-0 sm:min-w-64 gap-2">
				<div className="flex flex-col sm:flex-row justify-evenly md:justify-between gap-2">
					<div className="flex flex-col items-baseline justify-center md:items-start overflow-hidden">
						<div className={`${style.playerName} overflow-hidden`}>
							<span className="player-name-value">{playerName}</span>
						</div>
						<div className={`${style.playerRole} ${t.accent} overflow-hidden`}>
							<span className="player-role-value">{playerRole}</span>
						</div>
					</div>
					<div className={`${style.hudIcons}`}>
						<div className={`${style.iconContainer}`}>
							<SVGIcon resizeBasedOnContainer={false} className={`${t.fillSolidText} ${t.solidBorder} m-1 rounded-md p-1 border `}>
								<StatsIcon/>
								<SettingsIcon/>
							</SVGIcon>
						</div>
					</div>
				</div>
				<div className={`${style.playerFunds} ${t.inputBox} ${t.mainText}`}>
					<div className={`${style.currencyIcon} ${t.fillCurrency} ${t.currencyIcon} `}>
						<SVGIcon>
							<CurrencyIcon/>
						</SVGIcon>
					</div>
					<div className="player-currency-amount mx-1 ml-8 self-end">
						<span className="player-currency-value">{playerFunds}</span>
					</div>
				</div>
			</div>
		</div>
	)
})