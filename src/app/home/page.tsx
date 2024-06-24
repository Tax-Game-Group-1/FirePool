'use client'
import { useEffect } from 'react';
import s from './page.module.scss'
import {useTheme} from "@/components/ThemeContext/themecontext";

import "./page.scss"
import { createTimer } from '@/utils/utils';
import { animate, DOMKeyframesDefinition } from 'framer-motion';
import SignalEventBus from '@catsums/signal-event-bus';
import { useSignals } from '@preact/signals-react/runtime';
import { closeAllNotifs, createNotif } from '@/components/Notification/Notification';
import { getData, setData } from '@/app/dummyData';
import { randomID, sanitizeString } from '@catsums/my';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { deleteGameGlobal, gameCodeLength, GameGlobal, loadGameGlobal, saveGameGlobal } from '@/app/global';
import { JoinSection, JoiningSection } from './_sections/JoinSection';
import { LoginSection } from './_sections/LoginSection';
import { SplashSection } from './_sections/SplashSection';
import { StartSection } from './_sections/StartSection';
import { findData } from '@/app/dummyData';
import { useRouter } from 'next/navigation';

let mainRouter = null;

//possible sections
export enum PageSection {
	Splash,
	Login,
	Join,
	Start,
	Joining,
}

export let homePageSectionBus = new SignalEventBus();

//navigates to section
export function goToSection(section: PageSection){
	let dir:DOMKeyframesDefinition = {}
	switch (section){
		case PageSection.Login:
			dir = { left: "100vw", top: "-100vh" };
			break;
		case PageSection.Join:
			dir = { left: "-100vw", top: "-100vh" };
			break;
		case PageSection.Joining:
			dir = { left: "-200vw", top: "-100vh" };
			break;
		case PageSection.Splash:
			dir = { left: "0vw", top: "0vh" };
			break;
		case PageSection.Start:
			dir = { left: "0vw", top: "-100vh" };
			break;
		
	}
	closeAllNotifs();
	animate(document.body, dir, {duration: 0.3}).then(()=>{
		homePageSectionBus.emit("section", section);
	});
}

/*
    server.post("/adminLogin", (req, res) => {
        
    });
*/


export async function tryLogin(username:string, password:string){
	username = sanitizeString(username.trim());
	password = sanitizeString(password.trim());
	//actual login

	if(!username){
		createNotif({
			content: "Username is empty!",
		})
		return;
	}
	if(!password){
		createNotif({
			content: "Password is empty",
		})
		return;
	}

	///check if username and password are valid
	let res = await fetch("/adminLogin", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username, password,
		}),
	}).then(r => r.json());

	console.log({res})

	if(!res.success){
		createNotif({
			content: `Error: ${res?.message}`,
		})
		return;
	}
	//clear GameGlobal
	deleteGameGlobal();

	GameGlobal.user.value.id = res.data.id;
	GameGlobal.user.value.name = username;
	GameGlobal.user.value.username = username;

	console.log("routing....");


	saveGameGlobal();
	createNotif({
		content: "Successfully logged in!",
	})
	setTimeout(() => {
		window.location.href = "/host";
	}, 3500)

}

export async function tryJoin(code:string){
	code = sanitizeString(code.trim().replaceAll(/[^a-zA-Z0-9]/g,"").slice(0, gameCodeLength));

	if(!code.length){
		createNotif({
			content: "Room code is empty",
		})
		return;
	}
	if(code.length < gameCodeLength){
		createNotif({
			content: "Room code is too small",
		})
		return;
	}

	let res = await fetch("/joinGame",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			gameCode: code,
			waitingId: randomID('',`${Date.now()}`),
		}),
	}).then(r => r.json());

	if(!res.success){
		createNotif({
			content: `Error: ${res.message}`,
		})
		return;
	}
	console.log({res})

	//clear GameGlobal
	deleteGameGlobal();

	GameGlobal.room.value = {
		gameCode: code,
	};

	GameGlobal.player.value = {
		waitingId: res.data.waitingId,
	};

	saveGameGlobal();

	goToSection(PageSection.Joining);
	createTimer(1,()=>{
		// mainRouter.push(`/game?c=${code}`)
		window.location.href = `/game?c=${code}`;
	});
	
	return;
}


export default function Home() {
	useSignals();

	const { theme  } = useTheme();

	mainRouter = useRouter();

	useRemoveLoadingScreen(()=>{
		loadGameGlobal();
	});

	useEffect(()=>{

		let url = new URL(window.location.href);

		let searchParams = url.searchParams;
		let code = searchParams.get("code");
		if(!code){
			code = searchParams.get("c");
		}
		if(code){
			tryJoin(code);
			goToSection(PageSection.Join);
			return;
		}

		goToSection(PageSection.Splash);
		
	},[])

	return (
		<>
			<LoadingScreen/>
			<main className={`${s.splash} ${theme} overflow-auto`} id={"top"}>
				<SplashSection/>
				<StartSection/>
				<LoginSection/>
				<JoinSection/>
				<JoiningSection/>
			</main>
		</>
	);
}

//card columns:
//grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
