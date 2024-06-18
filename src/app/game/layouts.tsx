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
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';

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

	useRemoveLoadingScreen(()=>{
		isLoaded.value = true;
	}),()=>{
		let gameLayout = document.querySelector(`.${style.gameLayout}`);
		gameLayout?.classList.remove("hidden");
	};

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
			<LoadingScreen/>
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
