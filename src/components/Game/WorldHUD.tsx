"use client"
import React, { forwardRef, Ref } from "react"
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { CurrencyIcon, PercentageIcon } from "@/assets/svg/icons";

import t from "../../elements.module.scss";
import style from "./WorldHUD.module.scss";

import { computed } from '@preact/signals-react';

import { GameGlobal, round, universeFunds, universeName, universeTaxRate } from '@/app/global';
import { getData } from '@/app/dummyData';


export const WorldHUD = forwardRef(function WorldHUD({}, ref:Ref<any>){
	
	return (
		<div ref={ref} className={`${style.worldHUD} ${t.solidElement} ${t.solidText}`}>
			<div className={`${style.row} gap-2 justify-between`}>
				<div className="world-year-label mx-1 text-sm">
					<span>World name</span>
				</div>
				<div className="flex font-bold">
					<span>{universeName}</span>
				</div>
			</div>
			<div className={`${style.row} gap-2`}>
				<div className="flex flex-col justify-between ">
					<div className="world-taxrate-label mx-1 text-sm">
						<span>Tax Rate</span>
					</div>
					<div className={`${t.inputBox} ${style.displayBox} ${t.fillSolidText} min-w-24`}>
						<span className="world-taxrate-value">{universeTaxRate}</span>
						<span className="percent-icon px-0 w-5">
							<SVGIcon>
								<PercentageIcon fill=""/>
							</SVGIcon>
						</span>
					</div>
				</div>
				<div className={`${style.col} self-end min-w-28 sm:min-w-40`}>
					<div className="world-year-label mx-1 ml-8 text-sm">
						<span>Year</span>
					</div>
					<div className={`${t.inputBox} ${t.mainText} ${style.displayBox}`}>
						<span className="world-year-value">{round}</span>
					</div>
				</div>
			</div>
			<div className={`${style.row} gap-2 justify-end self-end`}>
				<div className={`${style.col} min-w-40 justify-items-end`}>
					<div className="world-funds-label world-funds mx-1 ml-8 text-sm">
						<span>World Funds</span>
					</div>
					<div className={`${t.inputBox} ${t.mainText} ${style.displayBox}`}>
						<div className={`${t.currencyIcon} ${style.currencyIcon}`}>
							<SVGIcon>
								<CurrencyIcon fill='white'/>
							</SVGIcon>
						</div>
						<div className="world-funds-amount mx-1 ml-8">
							<span className="world-funds-value">{universeFunds.value?.toFixed(2)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
});
