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
import { getData, IPlayerData, Role, setData } from '@/app/dummyData';
import { randomID, sanitizeString } from '@catsums/my';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { GameGlobal, updateGameGlobal } from '@/app/global';
import { JoinSection, JoiningSection } from './_sections/JoinSection';
import { LoginSection } from './_sections/LoginSection';
import { SplashSection } from './_sections/SplashSection';
import { StartSection } from './_sections/StartSection';
import { IRequestResult } from '@/interfaces';

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
	}).then(r => r.json()) as IRequestResult;

	if(!res.success){
		createNotif({
			content: res?.message || "Server error. Check the server admin!",
		})
		return;
	}

	createNotif({
		content: "Successfully logged in!",
	})

	console.log(res.data);

}

export async function tryJoin(code:string){
	code = sanitizeString(code.trim().replaceAll(/[^a-zA-Z0-9]/g,"").slice(0,8));

	if(!code.length){
		createNotif({
			content: "Room code is empty",
		})
		return;
	}
	if(code.length < 8){
		createNotif({
			content: "Room code is too small",
		})
		return;
	}
	
	let roomData = getData("rooms", code);
	if(!roomData){
		createNotif({
			content: "Room does not exist",
		})
		return;
	}

	let newPlayer:IPlayerData = {
		id: randomID(),
		name: "",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: false,
		icon: ``, //iconURL
		worldID: ``,
	}

	let x = setData("players", newPlayer);
	if(!x) {
		createNotif({
			content: "Error joining the game! Player data could not be created."
		})
		return;
	}
	
	roomData.players.push(newPlayer.id);

	x = setData("rooms", {...roomData});
	if(!x) {
		createNotif({
			content: "Error joining the game! Could not join room."
		})
		return;
	}

	GameGlobal.roomData.value = roomData;
	updateGameGlobal();

	goToSection(PageSection.Joining);
	createTimer(2,()=>{
		// router.push(`/game?c=${code}`)
		window.location.href = `/game?c=${code}`;
	});
	
	return;
}


export default function Home() {
	useSignals();

	const { theme  } = useTheme();

	useRemoveLoadingScreen(()=>{

	});

	useEffect(()=>{
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
