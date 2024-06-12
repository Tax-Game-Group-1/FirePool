"use client"
import React, { forwardRef, Ref, useState } from 'react'
import dynamic from 'next/dynamic';

import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon, PercentageIcon, CopyIcon, MenuIcon } from "@/assets/svg/icons";

const MatchMedia = dynamic(async() => {
	let x = await import('@/components/useMediaQuery/useMediaQuery')
	return x.MatchMedia;
}, { ssr: false })

const GameFooter = forwardRef(function GameFooter(props,ref:Ref<any>) {

	//temporary states, gonna be replaced with useContext later
	let [gameCode] = useState("1A2B-3C4D");
	let [gameName] = useState("Game 1");
	let [hostName] = useState("Dr F. Tax");
	let [numOfPlayers] = useState(8);
	let [maxNumOfPlayers] = useState(20);


	const Mobile = forwardRef(function Mobile(props,ref:Ref<any>){
		return (
			<footer ref={ref} className="row-span-1 grid grid-cols-12 bg-black rounded-md p-0 px-2 gap-0 text-xs sm:text-sm">
				<div className="rounded-md col-span-4 px-0 flex items-center justify-center">
					<div className="bg-white text-black font-medium text-[0.5rem] sm:text-xs p-1 flex items-center rounded-md">
						<span className="game-room-code inline-flex justify-center items-center p-0 m-0">{gameCode}</span>
					</div>
					<div className="px-2 w-10 h-full flex justify-center items-center">
						<SVGIcon className="">
							<CopyIcon fill="none" stroke="white"/>
						</SVGIcon>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center rounded-md col-span-6">
					<div>
						<span className="">Game:</span>
						<span className="game-name px-1">{gameName}</span>
					</div>
					<div>
						<span className="">Host:</span>
						<span className="host-name px-1">{hostName}</span>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center rounded-md col-span-2">
					<div className="popmenu-menu absolute grid grid-flow-row bg-black border rounded-md w-20 p-4 bottom-[9%] gap-4">
						<div className="grid grid-flow-row">
							<SVGIcon resizeBasedOnContainer={false}>
								<BackSquare fill="white"/>
							</SVGIcon>
							<SVGIcon resizeBasedOnContainer={false}>
								<BackSquare fill="white"/>
							</SVGIcon>
							<SVGIcon resizeBasedOnContainer={false}>
								<BackSquare fill="white"/>
							</SVGIcon>
						</div>
						<div className="popmenu-spacing"></div>
					</div>
					<div className="popmenu-icon flex absolute justify-center items-center rounded-full border w-14 p-3 bottom-[4.5%] aspect-square bg-black">
						<SVGIcon resizeBasedOnContainer={false}>
							<MenuIcon fill="none" stroke="white"/>
						</SVGIcon>
					</div>
				</div>
			</footer>
		)
	})

	const PC = forwardRef(function PC(props,ref:Ref<any>){
		return (
			<footer ref={ref} className="row-span-1 grid grid-cols-12 bg-black rounded-md p-0 md:p-1 gap-2 text-sm">
				<div className="rounded-md col-span-3 px-2 flex items-center justify-center">
					<div className="mx-2">Game Code:</div>
					<div className="bg-white text-black font-medium text-xs p-2 rounded-md">ABCD1234</div>
					<div className="px-2 w-12 h-full flex justify-center items-center">
						<SVGIcon className="">
							<CopyIcon fill="none" stroke="white"/>
						</SVGIcon>
					</div>
				</div>
				<div className="flex justify-center items-center rounded-md col-span-3">
					<span className="">Game:</span><span className="game-name px-1">Game 1</span>
				</div>
				<div className="flex justify-center items-center rounded-md col-span-2">
					<span className="">Players:</span>
					<span className="px-1">
						<span className="player-count px-1">8</span>
						/
						<span className="player-max-count px-1">10</span>
					</span>
				</div>
				<div className="flex justify-center items-center rounded-md col-span-2">
				<span className="">Host:</span><span className="host-name px-1">Dr F. Tax</span>
				</div>
				<div className="flex relative justify-center items-center rounded-md col-start-11 px-2 w-12">
					<SVGIcon className="">
						<BackSquare fill='white'/>
					</SVGIcon>
				</div>
				<div className="flex justify-center items-center rounded-md col-start-12 px-2 w-12">
					<SVGIcon className="">
						<ExitDoor fill='white'/>
					</SVGIcon>
				</div>
			</footer>
		)
	})
		
	return (
		<>
			<MatchMedia 
				query={{
					not: ["xs","sm","md"]
				}} hidingType="display"
			>
				<PC/>
			</MatchMedia>
			<MatchMedia 
				query={["xs","sm","md"]} 
				hidingType="display"
			>
				<Mobile/>
			</MatchMedia>
		</>
	)
});

export default GameFooter;