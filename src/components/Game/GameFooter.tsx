"use client"
import React, { forwardRef, MouseEvent, Ref, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';

import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon, PercentageIcon, CopyIcon, MenuIcon, InfoIcon, SettingsIcon } from "@/assets/svg/icons";
import { mergeRefs } from '@/mergeRefs/mergeRefs';

import style from "./GameFooter.module.scss";
import theme from "../../elements.module.scss";
import { animate } from 'framer-motion';
import { useSignalEvent } from '@catsums/signal-event-bus';
import { copyToClipboard } from '@/utils/utils';
import { createNotif } from '../Notification/Notification';
import { createPopUp } from '../PopUp/PopUp';

import { computed } from '@preact/signals-react';

import { GameGlobal } from '@/app/global';
import { getData } from '@/app/dummyData';

export let gameCode = computed(()=>{
	let code = GameGlobal.roomData.value?.id || "";
	let mid = Math.trunc(code.length/2);
	code = [code.slice(0, mid), code.slice(mid)].join("-");

	return code;
});
export let gameName = computed(()=>{
	let name = GameGlobal.roomData.value?.name || "";
	return name;
});
export let hostName = computed(()=>{
	let name = GameGlobal.hostData.value?.name || "";
	return name;
});
export let playerName = computed(()=>{
	let name = GameGlobal.playerData.value?.name || "";
	return name;
});
export let players = computed(()=>{
	//dependancies
	GameGlobal.playerData.value;
	GameGlobal.roomData.value;

	let code = gameCode.value.split("-").join("");
	let roomData = getData("rooms", code);
	let playerIDs = roomData?.players || [];
	let players = playerIDs.map((id) => {
		let player = getData("players", id);
		return player;
	});

	return players;
})
export let numOfPlayers = computed(()=>{
	return players.value.length;
});
export let maxNumOfPlayers = computed(()=>{
	GameGlobal.roomData.value;

	let code = gameCode.value.split("-").join("");
	let roomData = getData("rooms", code);
	let max = roomData?.maxNumberOfPlayers || 0;
	return max;
});



const MatchMedia = dynamic(async() => {
	let x = await import('@/components/useMediaQuery/useMediaQuery')
	return x.MatchMedia;
}, { ssr: false })

const GameFooter = forwardRef(function GameFooter(props,ref:Ref<any>) {

	//temporary states, gonna be replaced with useContext later
	
	let router = useRouter();

	const Mobile = forwardRef(function Mobile(props,ref:Ref<any>){
		let popMenuBtnRef = useRef<any>();
		let popMenuRef = useRef<any>();

		let popMenuOpen = useRef(false);

		let toggleClasses = {
			stroke: [theme.strokeSolidText, theme.strokeSolidElement],
			fill: [theme.toolBar, theme.textBoxBackground],
		}


		function toggleOpen(){
			popMenuOpen.current = !popMenuOpen.current;

			let popMenu = popMenuRef.current as HTMLDivElement;
			let popUpBtn = popMenuBtnRef.current as HTMLDivElement;
	
			if(popMenuOpen.current){
				popUpBtn?.classList.remove(toggleClasses.stroke[0]);
				popUpBtn?.classList.add(toggleClasses.stroke[1]);
				
				popMenu?.classList.remove(style.popMenuClosed);
	
				popUpBtn?.classList.remove(toggleClasses.fill[0]);
				popUpBtn?.classList.add(toggleClasses.fill[1]);
	
				animate(popMenu, { scaleY: [0,1], opacity: [0,1] }, {duration: 0.2, ease:"circInOut"});
	
			}else{
				popUpBtn?.classList.add(toggleClasses.stroke[0]);
				popUpBtn?.classList.remove(toggleClasses.stroke[1]);
	
				popUpBtn?.classList.add(toggleClasses.fill[0]);
				popUpBtn?.classList.remove(toggleClasses.fill[1]);
				animate(popMenu, { scaleY: [1,0], opacity: [1,0] }, {duration: 0.2, ease:"circInOut"}).then(()=>{
					popMenu?.classList.add(style.popMenuClosed);
				});
			}

		}

		return (
			<footer ref={ref} className={`${style.gameFooter} ${style.mobileGameFooter} ${theme.toolBar} ${theme.solidText}`}>
				<div className={`${style.col} col-span-4 md:col-span-3 px-0`}>
					<div className={`${style.roomCodeCont} ${theme.textBoxBackground} ${theme.inputText}`}>
						<span className={`${style.roomCodeTxt}`}>{gameCode}</span>
					</div>
					<div 
						className={`${style.roomCodeCopyCont} ${theme.strokeSolidText}`}
						onClick={async()=>{
							let url = new URL(window.location.href);
							await copyToClipboard(url.href);

							let notifData = (
								<p className={`mx-4`}>Copied to clipboard!</p>
							)

							createNotif({
								content: (notifData),
								time: 1.5,
							});
						}}
					>
						<SVGIcon>
							<CopyIcon fill="none"/>
						</SVGIcon>
					</div>
				</div>
				<div className={`${style.col} col-span-6 md:col-span-4 flex-col`}>
					<div>
						<span className="">Game:</span>
						<span className="game-name px-1">{gameName}</span>
					</div>
					<div>
						<span className="">Host:</span>
						<span className="host-name px-1">{hostName}</span>
					</div>
				</div>
				<div className={`justify-center items-center rounded-md hidden md:flex md:col-span-3 flex-col`}>
					<div>
						<span className="">Number of players:</span>
					</div>
					<div>
						<span className="player-count px-1">{numOfPlayers}</span>
						<span>/</span>
						<span className="player-max-count px-1">{maxNumOfPlayers}</span>
						
					</div>
				</div>
				<div className={`${style.col} flex-col col-start-11 md:col-start-12`}>
					<div ref={popMenuRef} className={`${style.popMenu} ${style.popMenuClosed} ${theme.toolBar}`}>
						<div className="grid grid-flow-row">
							<SVGIcon resizeBasedOnContainer={false} className={`${theme.fillSolidText} my-2`}>
								<span>
									<InfoIcon />
								</span>
								<span>
									<StatsIcon />
								</span>
								<span>
									<SettingsIcon />
								</span>
								<span>
									<ExitDoor />
								</span>
							</SVGIcon>
						</div>
						<div className="popmenu-spacing"></div>
					</div>
					<div ref={popMenuBtnRef} onClick={()=>{
						toggleOpen();
					}} className={`${style.popMenuIcon} ${toggleClasses.stroke[0]} ${toggleClasses.fill[0]} ${theme.buttonBorder}`}>
						<SVGIcon resizeBasedOnContainer={false} className={``}>
							<MenuIcon/>
						</SVGIcon>
					</div>
				</div>
			</footer>
		)
	})

	const PC = forwardRef(function PC(props,ref:Ref<any>){

		return (
			<footer ref={ref} className={`${style.gameFooter} ${style.PCGameFooter} ${theme.toolBar} ${theme.solidText}`}>
				<div className={`${style.col} col-span-3 px-2`}>
					<div className="mx-2">Game Code:</div>
					<div className={`${theme.textBoxBackground} ${theme.inputText} font-medium text-xs p-2 rounded-md`}>{gameCode}</div>
					<div 
						className={`${style.roomCodeCopyCont} ${theme.strokeSolidText}`}
						onClick={async()=>{
							let url = new URL(window.location.href);
							await copyToClipboard(url.href);

							let notifData = (
								<p className={`mx-4`}>Copied to clipboard!</p>
							)

							createNotif({
								content: (notifData),
								time: 1.5,
							});
						}}
					>
						<SVGIcon>
							<CopyIcon fill="none"/>
						</SVGIcon>
					</div>
				</div>
				<div className={`${style.col} col-span-3`}>
					<span className="">Game:</span>
					<span className="game-name px-1">{gameName}</span>
				</div>
				<div className={`${style.col} col-span-2`}>
					<span className="">Players:</span>
					<span className="px-1">
						<span className="player-count px-1">{numOfPlayers}</span>
						<span>/</span>
						<span className="player-max-count px-1">{maxNumOfPlayers}</span>
					</span>
				</div>
				<div className={`${style.col} col-span-2`}>
					<span className="">Host:</span>
					<span className="host-name px-1">{hostName}</span>
				</div>
				<div className={`${style.col} ${theme.fillSolidText} col-start-11 px-2 w-12`}>
					<SVGIcon>
						<BackSquare/>
					</SVGIcon>
				</div>
				<div 
					className={`${style.col} ${theme.fillSolidText} col-start-12 px-2 w-12`} 
					onClick={()=>{
						createPopUp({
							content: (
								<p>Are you sure you want to exit the game room?</p>
							),
							buttons: {
								"Yes": () => {
									router.push("/");
								},
								"No": () => {},
							}
						})
					}}
				>
					<SVGIcon>
						<ExitDoor/>
					</SVGIcon>
				</div>
			</footer>
		)
	})
		
	return (
		<>
			<MatchMedia 
				query={{
					"min-width": "lg"
				}}
			>
				<PC/>
			</MatchMedia>
			<MatchMedia 
				query={{
					"max-width": "md",
				}} 
			>
				<Mobile/>
			</MatchMedia>
		</>
	)
});

export default GameFooter;