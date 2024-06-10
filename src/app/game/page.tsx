import React, { lazy, Suspense } from 'react'
import Image from "next/image"

import SVGIcon from '@/components/SVGIcon/SVGIcon'

import { BackSquare, CurrencyIcon, ExitDoor, StatsIcon } from "@/assets/svg/icons";


export default function Game() {
  return (
	<div className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
		<main className="row-span-11 bg-black rounded-md flex p-2 relative justify-center items-center">
			<div className="flex rounded-md w-full h-full">
				<div className="game-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col items-end justify-between">
					<div className="world-hud bg-white text-black rounded-md p-2 inline-flex justify-center items-center flex-col gap-3">
						
						<div className="flex items-stretch justify-between min-w-64 gap-2">
							<div className="flex flex-col justify-between self-end border border-white min-w-40">
								<div className="world-year-label mx-1 ml-8 text-sm">
									<span>Year</span>
								</div>
								<div className="world-year mx-1 ml-8 text-white bg-black rounded-md p-1 text-xl flex justify-end">
									<span className="world-year-value">1</span>
								</div>
							</div>
							<div className="flex flex-col justify-between self-end border border-white min-w-40">
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
										<span className="world-funds-value">100.00</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-stretch justify-between min-w-64 gap-2">
							<div className="flex flex-col justify-between self-end border border-white min-w-40">
								<div className="world-year-label mx-1 ml-8 text-sm">
									<span>Year</span>
								</div>
								<div className="world-year mx-1 ml-8 text-white bg-black rounded-md p-1 text-xl flex justify-end">
									<span className="world-year-value">1</span>
								</div>
							</div>
							<div className="flex flex-col justify-between self-end border border-white min-w-40">
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
										<span className="world-funds-value">100.00</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="player-hud border-2 border-white rounded-md p-2 inline-flex justify-center items-center flex-row gap-3">
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
					</div>
					<div className="player-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col justify-center items-center">
						<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-start">
							Left Content
						</div>
						<div className="border absolute border-blue-500 p-2 inline-flex justify-center items-center self-center">
							Center Content
						</div>
					</div>
			</div>
		</main>
		<footer className="row-span-1 grid grid-cols-12 bg-black rounded-md p-0 md:p-1 gap-2 text-sm">
			<div className="border border-white rounded-md col-span-3 px-2 flex items-center justify-center">
				<div className="">Game Code:</div>
				<div className="bg-white text-black p-1 px-2 mx-2 rounded-md">ABCD1234</div>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-3">
				<span className="">Game:</span><span className="game-name px-1">Game 1</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-2">
				<span className="">Players:</span>
				<span className="px-1">
					<span className="player-count px-1">8</span>
					/
					<span className="player-max-count px-1">10</span>
				</span>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-span-2">
			<span className="">Host:</span><span className="host-name px-1">Dr F. Tax</span>
			</div>
			<div className="flex relative justify-center items-center border border-white rounded-md col-start-11">
				<SVGIcon className="">
					<BackSquare fill='white'/>
				</SVGIcon>
			</div>
			<div className="flex justify-center items-center border border-white rounded-md col-start-12">
				<SVGIcon className="">
					<ExitDoor fill='white'/>
				</SVGIcon>
			</div>
		</footer>
	</div>
  )
}
