import React, { ChangeEvent, FormEvent } from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../../elements.module.scss"
import "@/app/page.scss"
import { signal, computed } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { BinIcon, CancelCross, ConfirmTick, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { GameCardsContainer } from '../GameCards'
import { EditTextIcon } from '@/assets/svg/svg';
import { GameGlobal } from '@/app/global'
import { currGame, hostName } from '../page'
import { getIconURL } from '@/utils/utils'

import _ from "lodash"



function onNumInput(e:ChangeEvent){
	let elem = e.currentTarget as HTMLInputElement;

	// console.log({val, min, max})

	elem.value = `${_.clamp(
		Number( elem.value.trim().replaceAll(/[^[+-]?([0-9]*[.])?[0-9]+]/g,"") || 0 ),
		Number(elem.min),
		Number(elem.max),
	)}`;
}



export default function CreateSection() {

	return (
		<div className={` rounded-md w-full h-full grid grid-rows-12 grid-cols-1 md:grid-cols-12 gap-2 p-2 ${t.solidText}`}>
			<div className={`grid gap-1 grid-rows-12 grid-cols-12 row-span-8 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-8`}>
				<div className={`${t.toolBar} grid gap-2 p-2 grid-cols-12 rounded-md row-span-2 col-span-12`}>
					<div className={`h-full col-span-1 aspect-square border ${t.fillSolidText} ${t.solidBorder} p-4 rounded-full`}>
						<UserIcon/>
					</div>
					<div className={`col-span-6 p-4 flex justify-start items-center`}>
						{hostName}
					</div>
					<div className={`flex flex-row h-full justify-center items-center col-start-11 col-span-1`}>
						<div>Exit</div>
						<div className={`aspect-square h-full m-0 p-2 md:p-1 ${t.fillSolidText}`}>
							<ExitDoor/>
						</div>
					</div>
				</div>
				<div className={`border row-span-10 col-span-12 ${t.toolBar} ${t.gradient} ${t.solidElemBorder} overflow-auto rounded-md flex flex-col justify-start p-2 items-stretch`}>
					<form className={`${t.solidElement} h-full w-full p-20 md:p-32 flex flex-col justify-center items-baseline gap-1 md:gap-2`}>
						<div className={`flex flex-col gap-1 py-2 items-baseline`}>
							<label htmlFor="game-name">Game Name</label>
							<input name="game-name" className={`${t.inputBox} ${t.solidText} p-2 rounded-md text-xl`} />
						</div>
						<div className={`flex flex-row justify-between w-full gap-4`}>
							<label htmlFor="taxcoeff">Tax Coeffient</label>
							<input name="taxcoeff" onBlur={onNumInput} type="number"  min="1" max="2" placeholder="1.5" step="0.01" className={` w-3/4 md:w-1/5 p-1 ${t.inputBox} ${t.solidText} text-right rounded-md text-lg`} />
						</div>
						<div className={`flex flex-row justify-between w-full gap-4`}>
							<label htmlFor="max-players">Max No. Of Players</label>
							<input name="max-players" onBlur={onNumInput} type="number" min="6" max="100" placeholder="15" step="1" className={` w-3/4 md:w-1/5 p-1 ${t.inputBox} ${t.solidText} text-right rounded-md text-lg`} />
						</div>
						<div className={`flex flex-row justify-between w-full gap-4`}>
							<label htmlFor="penalty">Penalty %</label>
							<input name="penalty" onBlur={onNumInput} type="number" min="0" max="100" placeholder="30" step="1"  className={` w-3/4 md:w-1/5 p-1 ${t.inputBox} ${t.solidText}  text-right rounded-md text-lg`} />
						</div>
						<div className={`flex flex-row justify-between w-full gap-4`}>
							<label htmlFor="audit">Audit Probability %</label>
							<input name="audit" onBlur={onNumInput} type="number" min="0" max="100" placeholder="10" step="1"  className={` w-3/4 md:w-1/5 p-1 ${t.inputBox} ${t.solidText}  text-right rounded-md text-lg`} />
						</div>
						<div className={`flex flex-row justify-between w-full gap-4`}>
							<label htmlFor="kick">Kick Players on Bankruptcy</label>
							<select name="kick" className={`${t.inputBox} ${t.solidText} p-1 text-right rounded-md text-lg`}>
								<option value="yes">Yes</option>
								<option value="yes">No</option>
							</select>
						</div>
					</form>
				</div>

			</div>
			<div className={`${t.solidElement} rounded-md row-span-4 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-4 flex flex-row md:flex-col justify-evenly md:justify-center items-center p-2 gap-1 md:gap-2`}>
				<div className={` h-full md:h-auto w-auto md:w-full aspect-square flex flex-col justify-center items-center gap-2 p-2`}>
					<div className={`${t.solidBorder} border p-2 w-5/6 lg:w-3/4 relative aspect-square flex justify-center items-center rounded-md`}>
						<div className={`${t.accent} w-full relative aspect-square flex justify-center items-center rounded-md`}>
							<span className={`absolute z-10 flex justify-center items-center text-center`}>Loading image...</span>
							<img className={`w-full aspect-square relative z-20 rounded-md`} src={getIconURL(currGame.value.id).href} alt="game icon"/>
						</div>
					</div>
				</div>
				<div className={` h-full md:h-auto w-auto md:w-full flex flex-col justify-evenly items-center gap-4`}>
					<div className={`flex flex-row justify-center gap-2 items-center`}>
						<Btn>
							<div className={`flex gap-2`}>
								<div>Confirm</div>
								<div className={`aspect-square w-8 ${t.fillSolidText}`}>
									<SVGIcon>
										<ConfirmTick/>
									</SVGIcon>
								</div>
							</div>
						</Btn>
						<Btn>
							<div className={`flex gap-2`}>
								<div>Cancel</div>
								<div className={`aspect-square w-8 ${t.fillSolidText}`}>
									<SVGIcon>
										<CancelCross/>
									</SVGIcon>
								</div>
							</div>
						</Btn>
					</div>
				</div>
			</div>
		</div>
	)
}
