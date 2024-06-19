"use client"

import React from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../elements.module.scss"
import "../page.scss"
import { PlayerCard } from '../game/_waiting/PlayerCard'
import { AvatarIcon } from '../game/_waiting/namingRoom'
import { signal } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { PlayIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'

let currentGameName = signal("Game 1");

export default function Page() {

	const {theme} = useTheme();

	let url = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"

	return (
		<main className={`${theme} h-screen w-screen flex flex-row p-8 justify-evenly items-center`}>
			<div className={` rounded-md w-full h-full grid grid-rows-12 grid-cols-1 md:grid-cols-12 gap-2 p-2 ${t.solidText}`}>
				<div className={`border ${t.toolBar} ${t.gradient} rounded-md row-span-8 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-8 flex flex-col justify-evenly md:gap-20 md:justify-center items-center`}>
					
				</div>
				<div className={`${t.solidElement} rounded-md row-span-4 md:row-span-12 col-span-12 md:col-span-6 lg:col-span-4 flex flex-row md:flex-col justify-evenly md:justify-center items-center p-2 gap-1 md:gap-2`}>
					<div className={` h-full md:h-auto w-auto md:w-full aspect-square flex flex-col justify-center items-center gap-2 p-2`}>
						<div className={`${t.solidBorder} border p-2 w-5/6 relative aspect-square flex justify-center items-center rounded-md`}>
							<div className={`${t.accent} w-full relative aspect-square flex justify-center items-center rounded-md`}>
								<span className={`absolute z-10 flex justify-center items-center text-center`}>Loading image...</span>
								<img className={`w-full aspect-square relative z-20 rounded-md`} src={url} alt="game icon"/>
							</div>
						</div>
						<div className={` flex justify-center text-lg md:text-xl`}>
							{currentGameName}
						</div>
					</div>
					<div className={` h-full md:h-auto w-auto md:w-full flex flex-col justify-evenly items-center`}>
						<div className={`flex flex-row justify-center items-center`}>
							<Btn>
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
							<Btn>Edit</Btn>
							<Btn>Delete</Btn>
						</div>
					</div>
					{/* <div className={`border p-1 md:p-4 gap-2 flex flex-col h-full md:h-auto w-1/6 md:w-2/3 justify-center items-center`}>
						<div className={`flex p-2 border border-red-500 flex-col rounded-md h-5/6 md:h-auto aspect-square md:w-full`}>
							<div className={`${t.accent} w-full aspect-square flex justify-center items-center rounded-md`}>
								<span className={`absolute z-10 flex justify-center items-center text-center`}>Loading image...</span>
								<img className={`w-full aspect-square relative z-20 opacity-0 rounded-md`} src={url} alt="game icon"/>
							</div>
						</div>
						<div className={`border flex justify-center text-base md:text-xl`}>
							{currentGameName}
						</div>
					</div>
					<div className={``}>
						<Btn>Start Game</Btn>
					</div> */}
				</div>
			</div>
			<ContentLayer z={10}>
				<NotifContainer></NotifContainer>
			</ContentLayer>
			<ContentLayer z={10}>
				<PopUpContainer></PopUpContainer>
			</ContentLayer>
		</main>
	)
}
