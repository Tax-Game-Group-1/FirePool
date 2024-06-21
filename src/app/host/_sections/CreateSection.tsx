import React, { ChangeEvent, FormEvent, MouseEvent, useRef } from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer from '@/components/Notification/Notification'
import { createPopUp, PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../../elements.module.scss"
import "@/app/page.scss"
import { signal, computed } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { BinIcon, CancelCross, ConfirmTick, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { GameCardsContainer } from '../GameCards'
import { EditTextIcon } from '@/assets/svg/svg';
import { GameGlobal } from '@/app/global'
import { currGame, goToSection, hostID, hostName, PageHeader, PageSection, tryCreate, tryEdit } from '../page';
import { getIconURL } from '@/utils/utils'

import _ from "lodash"
import { formDataToJSON, randomID } from '@catsums/my'
import { useSignals } from '@preact/signals-react/runtime'



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
	useSignals();

	let formRef = useRef(null);

	function onConfirm(e:MouseEvent){
		let form = formRef.current as HTMLFormElement;

		let formData = new FormData(form);
		let obj = formDataToJSON(formData);
		
		for(let key of Object.keys(obj)){
			let elem = document.getElementsByName(key)[0];
			if(elem instanceof HTMLInputElement && elem.type === "number"){
				obj[key] = Number(elem.value);
			}else if(elem instanceof HTMLSelectElement && elem.name === "kickPlayersOnBankruptcy"){
				obj[key] = (obj[key].toLowerCase() == "yes");
			}
		}

		// obj.id = currGame.value?.id || randomID();

		let imgIcon = document.getElementById("imgIcon") as HTMLImageElement;

		obj.icon = imgIcon.src;

		obj.host = hostID.value;
		obj.adminId = hostID.value;
		obj.roundNumber = 0;

		if(currGame.value){
			tryEdit(obj);
		}else{
			tryCreate(obj);
		}
	}
	function onCancel(e:MouseEvent){
		let form = formRef.current as HTMLFormElement;
		
		let formData = new FormData(form);
		let obj = formDataToJSON(formData);


		if(obj.name){
			createPopUp({
				content: "You have changes. Return anyway?",
				buttons: {
					"Yes": () => {
						goToSection(PageSection.Main);
					},
					"No": () => {},
				}
			});
		}else{
			goToSection(PageSection.Main);
		}
	}

	//await createGame(req.body.adminId, req.body.name, req.body.taxCoefficient, req.body.maxPlayers, req.body.finePercent, req.body.roundNumber, req.body.auditProbability, req.body.kickPlayersOnBankruptcy)
	return (
		<div className={` rounded-md w-full h-full grid grid-rows-12 grid-cols-1 md:grid-cols-12 gap-2 p-2 ${t.solidText}`}>
			<div className={`grid gap-1 grid-rows-12 grid-cols-12 row-span-8 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-8`}>
				<div className={`${t.toolBar} grid gap-2 p-2 grid-cols-12 rounded-md row-span-2 col-span-12`}>
					<PageHeader username={hostName.value} />
				</div>
				<div className={`border row-span-10 col-span-12 ${t.toolBar} ${t.gradient} ${t.solidElemBorder} overflow-auto rounded-md flex flex-col justify-start p-2 items-stretch`}>
					<form ref={formRef} className={`${t.solidElement} h-full w-full p-8 text-xs md:text-base lg:p-32 flex flex-col justify-center items-baseline gap-1 md:gap-2`}>
						<div className={`flex flex-col gap-1 py-2 items-baseline`}>
							<label htmlFor="name">Game Name</label>
							<input name="name" defaultValue={currGame.value?.name || ""} className={`${t.inputBox} ${t.solidText} p-2 rounded-md text-sm md:text-lg lg:text-xl`} />
						</div>
						<div className={`flex flex-row justify-between items-center w-full gap-4`}>
							<label htmlFor="taxCoefficient">Tax Coeffient</label>
							<input name="taxCoefficient" onBlur={onNumInput} type="number"  min="1" max="2" defaultValue={`${currGame.value?.taxCoefficient || 1.5}`} step="0.01" className={` w-3/4 md:w-1/5 p-0 md:p-1 ${t.inputBox} ${t.solidText} text-right rounded-md text-sm md:text-base`} />
						</div>
						<div className={`flex flex-row justify-between items-center w-full gap-4`}>
							<label htmlFor="maxPlayers">Max No. Of Players</label>
							<input name="maxPlayers" onBlur={onNumInput} type="number" min="6" max="100" defaultValue={`${currGame.value?.maxNumberOfPlayers || 15}`} step="1" className={` w-3/4 md:w-1/5 p-0 md:p-1 ${t.inputBox} ${t.solidText} text-right rounded-md text-sm md:text-base`} />
						</div>
						<div className={`flex flex-row justify-between items-center w-full gap-4`}>
							<label htmlFor="finePercent">Penalty %</label>
							<input name="finePercent" onBlur={onNumInput} type="number" min="0" max="100" defaultValue={`${currGame.value?.penalty || 30}`} step="1"  className={` w-3/4 md:w-1/5 p-0 md:p-1 ${t.inputBox} ${t.solidText}  text-right rounded-md text-sm md:text-base`} />
						</div>
						<div className={`flex flex-row justify-between items-center w-full gap-4`}>
							<label htmlFor="auditProbability">Audit Probability %</label>
							<input name="auditProbability" onBlur={onNumInput} type="number" min="0" max="100" defaultValue={`${currGame.value?.auditProbability || 10}`} step="1"  className={` w-3/4 md:w-1/5 p-0 md:p-1 ${t.inputBox} ${t.solidText}  text-right rounded-md text-sm md:text-base`} />
						</div>
						<div className={`flex flex-row justify-between items-center w-full gap-4`}>
							<label htmlFor="kickPlayersOnBankruptcy">Kick Players on Bankruptcy</label>
							<select name="kickPlayersOnBankruptcy" defaultValue={`${currGame.value?.kickPlayersOnBankruptcy ? "yes" : "no"}`} className={`${t.inputBox} ${t.solidText} p-0 md:p-1 text-right rounded-md text-sm md:text-base`}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
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
							<img id="imgIcon" className={`w-full aspect-square relative z-20 rounded-md`} src={getIconURL(currGame.value.gameId).href} alt="game icon"/>
						</div>
					</div>
				</div>
				<div className={` h-full md:h-auto w-auto md:w-full flex flex-col justify-evenly items-center gap-4`}>
					<div className={`flex flex-col md:flex-row justify-center gap-2 items-center`}>
						<Btn onClick={onConfirm}>
							<div className={`flex gap-2 text-sm md:text-base`}>
								<div>Confirm</div>
								<div className={`aspect-square w-3 sm:w-5 md:w-8 ${t.fillSolidText}`}>
									<SVGIcon>
										<ConfirmTick/>
									</SVGIcon>
								</div>
							</div>
						</Btn>
						<Btn onClick={onCancel} >
							<div className={`flex gap-2 text-sm md:text-base`}>
								<div>Cancel</div>
								<div className={`aspect-square w-3 sm:w-5 md:w-8 ${t.fillSolidText}`}>
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
