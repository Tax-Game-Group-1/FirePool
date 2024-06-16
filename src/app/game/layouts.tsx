"use client"

import dynamic from 'next/dynamic'
import { useState, forwardRef, Ref, Suspense, lazy, useEffect } from 'react';
import {WorldHUD, PlayerHUD} from '@/components/Game/GameHUD'
// import GameFooter from '@/components/Game/GameFooter'
import GameContentContainer, { contentSignalBus, createContent, GameContent } from '@/components/Game/GameContentContainer'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer';
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer';

import { useSignals } from '@preact/signals-react/runtime';
import { useTheme } from '@/components/ThemeContext/themecontext';
import Themes from '../../components/ThemeContext/themes.module.scss'
import t from '../../elements.module.scss';

import style from "./layouts.module.scss"

import Btn from '@/components/Button/Btn';
import {createPopUp, PopUp, PopUpContainer} from '@/components/PopUp/PopUp';

const GameFooter = lazy(() => import('@/components/Game/GameFooter'))
const GameHUD = lazy(() => import('@/components/Game/GameHUD'));

import { popUpSignalBus } from '@/components/PopUp/PopUp';
import LoadingStatus from '@/components/Loading/Loading';
import { mergeRefs } from '@/mergeRefs/mergeRefs';

const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {
	let {theme} = useTheme();
	useSignals();

	let pre = (
		<div className={`absolute z-[1000] w-svw h-svh inline-flex justify-center self-center items-center overflow-hidden ${t.background} ${theme} loadingThingy pointer-events-none`}>
			<LoadingStatus/>
		</div>
	)

	useEffect(()=>{
		const onPageLoad = () => {
			console.log('page loaded');
			// do something else
			let gameLayout = document.querySelector(`.${style.gameLayout}`);
			let loadingThingy = document.querySelector(`.loadingThingy`);
			gameLayout?.classList.remove("hidden");

			loadingThingy?.classList.add("hidden");
			try{
				loadingThingy?.remove();
			}catch(err){}
		}
	
		// Check if the page has already loaded
		if (document.readyState === 'complete') {
			onPageLoad();
		} else {
			window.addEventListener('load', onPageLoad, false);
		}
		// Remove the event listener when component unmounts
		return () => window.removeEventListener('load', onPageLoad);
	},[])
	
	let gameContent = (
		<GameContentContainer>
			<AnimationContainer 
				className="opacity-0" 
				enter={{
					animations:{
						opacity: [0,1],
						y: [-100, 0],
					},
					options:{
						duration: 0.5,
						ease: "circInOut",
						delay: 0.0,
					}
				}}
			>
				<GameContent className="absolute m-2" id="0001">
					<div className="flex flex-col justify-center items-center gap-4 p-8">
						<p>Click the button to summon the popup</p>
						<div className={``}>
							<Btn onClick={()=>{
								let main, sure : any;
								main = {
									content: "Forfeit life savings?",
									buttons:{
										"Yes": ()=>{
											contentSignalBus.emit(`close-0001`);
											createContent({
												content: (
													<p className="flex flex-col justify-center items-center gap-4 p-8">
														{"Forfeited life savings"}
													</p>
												),
											})
										},
										"No": ()=>{
											createPopUp(sure);
										}
									}
								}
								sure = {
									content: "Are you sure?",
									buttons:{
										"Yes": ()=>{
											
										},
										"No": ()=>{
											createPopUp(main);
										}
									}
								}
								createPopUp(main)
							}}>Click</Btn>
						</div>
					</div>
				</GameContent>
			</AnimationContainer>
		</GameContentContainer>
	)

	let content = (
		<ContentLayersContainer>
			<ContentLayer z={100}>
				<GameHUD>
					<WorldHUD/>
					<PlayerHUD/>
				</GameHUD>
			</ContentLayer>

			<ContentLayer z={1}>
				{gameContent}
			</ContentLayer>

			<ContentLayer z={200}>
				<PopUpContainer>
				</PopUpContainer>
			</ContentLayer>

		</ContentLayersContainer>
	);
	

	return (
		<>
			{pre}
			<Suspense fallback={<span></span>}>
				<div ref={ref} className={`${style.gameLayout} ${theme} ${t.background} ${t.mainText} hidden`}>
					<main className={``}>
						{content}
					</main>
					<GameFooter/>
				</div>
			</Suspense>
		</>
	);
});

export default Layouts;
