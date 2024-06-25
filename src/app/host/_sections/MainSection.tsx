import React from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer from '@/components/Notification/Notification'
import { createPopUp, PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../../elements.module.scss"
import "@/app/page.scss"
import { signal, computed } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { BinIcon, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { GameCardsContainer } from '../GameCards'
import { EditTextIcon } from '@/assets/svg/svg';
import { GameGlobal } from '@/app/global'
import { currGame, goToSection, hostName, PageHeader, PageSection, tryDelete, tryStart } from '../page'
import { getIconURL } from '@/utils/utils'
import { useSignals } from '@preact/signals-react/runtime'


export default function MainSection() {
	useSignals();

	function onStartClick(){
		createPopUp({
			content: "Start the game? This will create a lobby for participants to join",
			buttons:{
				"Yes": ()=>{
					tryStart(currGame.value);
				},
				"No": ()=>{},
			}
		})
	}
	function onDeleteClick(){
		createPopUp({
			content: "Delete Game?",
			buttons:{
				"Yes": ()=>{
					tryDelete(currGame.value.id);
				},
				"No": ()=>{},
			}
		})
	}

	return (
		<div className={` rounded-md w-full h-full grid grid-rows-12 grid-cols-1 md:grid-cols-12 gap-2 p-2 ${t.solidText}`}>
			<div className={`grid gap-1 grid-rows-12 grid-cols-12 row-span-8 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-8`}>
				<div className={`${t.toolBar} grid gap-4 p-2 grid-cols-12 rounded-md row-span-2 col-span-12`}>
					<PageHeader username={hostName.value}/>
				</div>
				<div className={`border row-span-10 col-span-12 ${t.toolBar} ${t.gradient} ${t.solidElemBorder} overflow-auto rounded-md flex flex-col justify-start p-2 items-stretch`}>
					<GameCardsContainer>
					</GameCardsContainer>
				</div>

			</div>
			
			<div className={`${t.solidElement} rounded-md row-span-4 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-4 flex flex-row md:flex-col justify-evenly md:justify-center items-center p-2 gap-1 md:gap-2`}>
				{
					currGame.value && (<>
						<div className={` h-full md:h-auto w-auto md:w-full aspect-square flex flex-col justify-center items-center gap-2 p-2`}>
							<div className={`${t.solidBorder} border p-2 w-5/6 lg:w-3/4 relative aspect-square flex justify-center items-center rounded-md`}>
								<div className={`${t.accent} w-full relative aspect-square flex justify-center items-center rounded-md`}>
									<span className={`absolute z-10 flex justify-center items-center text-center`}>Loading image...</span>
									<img className={`w-full aspect-square relative z-20 rounded-md`} src={getIconURL(currGame.value.gameId).href} alt="game icon"/>
								</div>
							</div>
							<div className={` flex justify-center text-lg md:text-xl`}>
								{currGame.value.name}
							</div>
						</div>
						<div className={` h-full md:h-auto w-auto md:w-full flex flex-col justify-evenly items-center gap-4`}>
							<div className={`flex flex-row justify-center items-center`}>
								<Btn onClick={onStartClick}>
									<div className={`flex gap-2`}>
										<div>Open Game</div>
										<div className={`aspect-square w-8 ${t.fillSolidText}`}>
											<SVGIcon>
												<PlayIcon/>
											</SVGIcon>
										</div>
									</div>
								</Btn>
							</div>
							<div className={`flex flex-row justify-center gap-2 items-center`}>
								<Btn onClick={()=>{
									goToSection(PageSection.Create);
								}} >
									<div className={`flex gap-2`}>
										<div>Edit</div>
										<div className={`aspect-square w-8 ${t.fillSolidText}`}>
											<SVGIcon>
												<EditTextIcon/>
											</SVGIcon>
										</div>
									</div>
								</Btn>
								<Btn onClick={onDeleteClick}>
									<div className={`flex gap-2`}>
										<div>Delete</div>
										<div className={`aspect-square w-8 ${t.fillSolidText}`}>
											<SVGIcon>
												<BinIcon/>
											</SVGIcon>
										</div>
									</div>
								</Btn>
							</div>
						</div>
					</>)
				}
			</div>
		</div>
	)
}
