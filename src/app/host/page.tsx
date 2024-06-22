"use client"

import React, { Suspense, useEffect } from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer, { createNotif } from '@/components/Notification/Notification'
import { createPopUp, PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../elements.module.scss"
import "../page.scss"
import { PlayerCard } from '../game/_waiting/PlayerCard'
import { AvatarIcon } from '../game/_waiting/namingRoom'
import { signal, computed } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { BinIcon, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { GameCardsContainer } from './GameCards'
import { getIconURL } from '@/utils/utils'
import { EditTextIcon } from '../../assets/svg/svg';
import { GameGlobal, loadGameGlobal, saveGameGlobal } from '../global';
import MainSection from './_sections/MainSection'
import CreateSection from './_sections/CreateSection'
import { useSignals } from '@preact/signals-react/runtime'
import { useRouter } from 'next/navigation'
import { deleteData, getData, setData } from '../dummyData'
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'

export let hostID = computed(()=>{
	let id = GameGlobal.user.value?.id || "";
	return id;
});
export let hostName = computed(()=>{
	let name = GameGlobal.user.value?.username || "";
	return name;
});

export let currGame = signal(null);


export let games = signal([]);

export async function getGames(){
	//fetch function here
	
	//server.get("/listGames/:adminId", async (req, res) => {
	console.log("HOST ID: " + hostID);
	console.log("Username:" + hostName);
	console.log(`/listGames/${hostID}`)

	if(!hostID.value) return;

	try{

		let res = await fetch(`/listGames/${hostID}`,{
			method: "POST",
		}).then(r => r.json());

		console.log({res})
	
		if(!res.success){
			//error
			createPopUp({
				content: "Error trying to grab the games",
			});
			return;
		}
		games.value = res.data.games;
	}catch(err){
		console.log(err)
	}
	

}

export enum PageSection {
	Main,
	Create,
}

// let mainRouter = null;

let currSection = signal(PageSection.Main);

export function goToSection(section: PageSection) {
	currSection.value = section;
}

export async function setCurrentGame(data){
	console.log({data})
	if(!data){
		createNotif({
			content: "Room does not exist!",
		})
		return;
	}

	currGame.value = {...data};
	// saveGameGlobal();
}
export async function unsetCurrentGame(data){
	currGame.value = null;
	// saveGameGlobal();
}

export async function tryCreate(data){
	if(!data.name){
		createNotif({
			content: "Game name is missing!",
		});
		return;
	}

	let res = await fetch('/createGame',{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...data})
	}).then(r => r.json());

	if(!res.success){
        createPopUp({
            content: `Error trying to create the game. ${res.message}`,
        });
        return;
    }

	createNotif({
		content: `Successfully created game!`,
	});

	getGames();
	
	goToSection(PageSection.Main);
	
}
export async function tryEdit(data){
	if(!data.gameId){
		createNotif({
			content: "Game name is missing!",
		});
		return;
	}

	let res = await fetch(`/editGame/${data.gameId}`,{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...data})
	}).then(r => r.json());

	if(!res.success){
        createPopUp({
			content: `Error trying to edit the game. ${res.message}`,
        });
        return;
    }

	createNotif({
		content: `Successfully edited game!`,
	});

	getGames();
	
	goToSection(PageSection.Main);
	
}
export async function tryDelete(data){
	if(!data.gameId){
		createNotif({
			content: "Game ID is missing!",
		});
		return;
	}

	let res = await fetch(`/deleteGame/${data.gameId}`,{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...data})
	}).then(r => r.json());

	if(!res.success){
        createPopUp({
			content: `Error trying to edit the game. ${res.message}`,
        });
        return;
    }

	createNotif({
		content: `Successfully edited game!`,
	});

	getGames();
	
	goToSection(PageSection.Main);
	
}
export async function tryStart(data){

	console.log('TRY START DATA')
	console.log(data);

	if(!data.gameId){
		createNotif({
			content: "Game ID is missing!",
		});
		return;
	}

	let res = await fetch(`/startGame`,{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({...data, id: data.gameId})
	}).then(r => r.json());

	if(!res.success){
        createPopUp({
			content: `Error trying to start the game. ${res.message}`,
        });
        return;
    }

	let gameCode = res.data.gameCode;

	GameGlobal.room.value = {...data, gameCode: gameCode};
	saveGameGlobal();

	
	//REDIRECT
	window.location.href = `/game?c=${gameCode}`;

}

export function PageHeader({username}:{
	username: string;
}){
	useSignals();
	// let router = useRouter();

	function onExit(){
		createPopUp({
			content: `Are you sure you want to exit? This will log you out`,
			buttons:{
				"Yes": () => {
					GameGlobal.user.value = {};
					saveGameGlobal();
					window.location.href = "/home";
					// router.push("/home");
				},
				"No":() => {}
			},
		});
	}

	return (
		<>
			<div className={`h-full border col-span-1 aspect-square ${t.fillSolidText} ${t.solidBorder} p-4 rounded-full`}>
				<UserIcon/>
			</div>
			<div className={` text-xs md:text-sm col-start-5 sm:col-start-4 lg:col-start-3 col-span-6 p-4 flex justify-start items-center`}>
				{username}
			</div>
			<div className={`flex flex-row text-xs md:text-sm h-full justify-center items-center col-start-11 col-span-1`} onClick={onExit}>
				<div>Exit</div>
				<div className={`aspect-square h-full m-0 p-2 md:p-1 ${t.fillSolidText}`}>
					<ExitDoor/>
				</div>
			</div>
		</>
	)
}

export default function Page() {
	useSignals();

	const {theme} = useTheme();

	// mainRouter = useRouter();

	useEffect(()=>{
		loadGameGlobal();
	},[])

	useRemoveLoadingScreen(()=>{
	});

	let section = <></>;
	switch(currSection.value) {
		case PageSection.Main:
			section = <MainSection/>
			break;
		case PageSection.Create:
			section = <CreateSection/>
			break;
	}

	return (
		<>
			<LoadingScreen/>

			<main className={`${theme}`}>
				<div className={`${t.background} h-screen w-screen flex flex-row p-8 justify-evenly items-center overflow-hidden`}>
					{section}
					<div className={`h-screen w-screen absolute top-0 left-0 pointer-events-none`}>
						<ContentLayer z={100}>
							<NotifContainer></NotifContainer>
						</ContentLayer>
						<ContentLayer className={`absolute top-0 left-0 h-screen w-screen`} z={100}>
							<PopUpContainer></PopUpContainer>
						</ContentLayer>
					</div>
				</div>
			</main>
		</>
	)
}
