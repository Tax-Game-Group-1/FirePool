"use client"

import dynamic from 'next/dynamic'
import { useState, forwardRef, Ref, Suspense, lazy, useEffect } from 'react';

import { useSignals } from '@preact/signals-react/runtime';
import { useTheme } from '@/components/ThemeContext/themecontext';
import Themes from '../../components/ThemeContext/themes.module.scss'
import t from '../../elements.module.scss';

import style from "./layouts.module.scss"

const GameFooter = lazy(() => import('@/components/Game/GameFooter'));
import LoadingStatus from '@/components/Loading/Loading';
import InGame from './_content/InGame';
import { createContent } from '@/components/Game/GameContentContainer';
import TestContent1 from './_content/test1';
import { signal } from '@preact/signals-react';
import { WaitingRoom } from './_waiting/waitingRoom';
import { animate } from 'framer-motion';
import { updateGameGlobal } from '@/app/global';

let isLoaded = signal(false);

enum GameScreen {
	WaitingRoom,
	InGame,
	Spectate,
}

const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {
	useSignals();
	let {theme} = useTheme();

	let [gameScreen, setGameScreen] = useState(GameScreen.InGame);

	let pre = (
		<div className={`absolute z-[1000] w-svw h-svh inline-flex justify-center self-center items-center overflow-hidden ${t.background} ${theme} loadingThingy pointer-events-none`}>
			<LoadingStatus/>
		</div>
	)

	useEffect(()=>{
		updateGameGlobal();
		const onPageLoad = () => {
			let gameLayout = document.querySelector(`.${style.gameLayout}`);
			let loadingThingy = document.querySelector(`.loadingThingy`);

			animate(loadingThingy, { opacity:[1,0] }, {duration: 0.5}).then(()=>{

				console.log('page loaded');
				// do something else
				gameLayout?.classList.remove("hidden");
	
				loadingThingy?.classList.add("hidden");
				try{
					loadingThingy?.remove();
				}catch(err){}
	
				isLoaded.value = true;
			});
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

	useEffect(()=>{
		window.scrollTo(0,0);
		if(!isLoaded.value) return;

		// let x = setTimeout(()=>{
		// 	createContent({
		// 		content: (<TestContent1/>),
		// 		id: "0001",
		// 		className: "absolute m-2",
		// 		useWrapper:false,
		// 	})
		// }, 1000)

		return () => {
			// clearTimeout(x);
		}
	},[])
	
	let content = (<></>)

	switch(gameScreen){
		case GameScreen.InGame:
			content = (<InGame/>);
			break;
		case GameScreen.WaitingRoom:
			content = (<WaitingRoom/>);
			break;
	}

	return (
		<>
			{pre}
			<Suspense fallback={<span></span>}>
				{isLoaded && (
					
					<div ref={ref} className={`${style.gameLayout} ${theme} ${t.background} ${t.mainText} hidden`}>
						<main className={``}>
							{content}
						</main>
						<GameFooter/>
					</div>
				)}
			</Suspense>
		</>
	);
});

export default Layouts;
