'use client'
import { MouseEvent, use, useEffect, useRef, useState } from 'react';
import s from './page.module.scss'
import {useTheme} from "@/components/ThemeContext/themecontext";
import t from '../../elements.module.scss'
import {transform} from "sucrase";
import {rotate} from "next/dist/server/lib/squoosh/impl";
import Btn from '@/components/Button/Btn';
import { CaretArrow, MinimalSun, PlayIcon, UserIcon } from '@/assets/svg/svg';
import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { MinimalMountains } from '@/assets/svg/svg';

import "./page.scss"
import { createTimer, getIconURL } from '@/utils/utils';
import { animate, DOMKeyframesDefinition } from 'framer-motion';
import { AvatarIcon, iconURL } from '@/app/game/_waiting/namingRoom';
import SignalEventBus, { useSignalEvent } from '@catsums/signal-event-bus';
import { useSignals } from '@preact/signals-react/runtime';
import NotifContainer, { closeAllNotifs, createNotif } from '@/components/Notification/Notification';
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer';
import { getData, IPlayerData, Role, setData } from '@/app/dummyData';
import { randomID, sanitizeString } from '@catsums/my';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';
import { closeContentAll } from '@/components/Game/GameContentContainer';
import { closeAllPopUps } from '@/components/PopUp/PopUp';
import { GameGlobal, updateGameGlobal } from '@/app/global';
import LoadingStatus from '@/components/Loading/Loading';

import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let router:AppRouterInstance;

function HomeCard({icon, text, onClick}:{
	icon: React.ReactNode,
	text: string,
	onClick?: (e?:MouseEvent) => void,
}){
	return (
		<div className={` ${t.solidElement} ${s.card}`} onClick={onClick}>
			<div className={`${t.fillToolbar} ${t.textBoxBackground} aspect-square rounded-md p-8`}>
				{icon}
			</div>
			<div className={`flex justify-center items-center text-center`}>
				{text}
			</div>
		</div>
	)
}

enum PageSection {
	Splash,
	Login,
	Join,
	Start,
	Joining,
}

export let homePageSectionBus = new SignalEventBus();

function goToSection(section: PageSection){
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

function SplashSection(){
	const { toggleTheme  } = useTheme();

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Splash);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] h-screen w-min absolute top-0 ${t.solidElement} ${t.solidText}`}>
		<nav className={`${s.nav}`}>
		  <ul>
			<li>About Us</li>
			<li>Case Study</li>
		  </ul>
		  <ul>
			<li onClick={() => toggleTheme()}>Change theme</li>
		  </ul>
		</nav>
		<div className={`${s.container} p-10 lg:p-20 h-screen grid-rows-12 lg:grid-rows-none lg:grid-cols-12 gap-0`}>
		  <div className={`row-span-3 md:row-span-4 lg:col-span-4 relative z-20`}>
			<h1 className={s.heading}>Welcome to the Tax Game</h1>
			<p>
				{`
				Tax Game is an app that helps you understand taxes. You'll play through scenarios, learn about
			  deductions and government spending, and see how taxes affect the economy. 
				`}
			</p>
			<p>
				{`
				Customize your game,
			  play with friends, and make profits!
				`}
			</p>
		  </div>
		  <div className={`${t.strokeSolidText} items-center h-full relative z-10 flex flex-col row-span-3 lg:col-start-8 lg:col-end-12`}>
			<div className={`${s.mountain} opacity-20 lg:opacity-100 aspect-square w-96 lg:w-auto lg:self-stretch p-8 lg:p-2 m-0`}>
			  <MinimalSun className={`${s.splashImage} ${s.sun}`}/>
			  <MinimalMountains className={`${s.splashImage}`}/>
			</div>
			<div className={` flex items-center justify-center self-center opacity-100`}>
				<Btn 
					onClick={()=>{
						goToSection(PageSection.Start);
					}}
				>
					<div className={`flex gap-1`}>
						<div>{`Let's Begin`}</div>
						<div className={`aspect-square w-8 ${t.fillSolidText}`}>
							<SVGIcon>
								<PlayIcon/>
							</SVGIcon>
						</div>
					</div>
				</Btn>
			</div>
		  </div>
		</div>
		{active && <FixedContents/>}
	  </section>
	)
}

function StartSection(){

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Start);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] w-max absolute top-[100vh] left-0 flex flex-col justify-evenly items-center ${t.gradient} ${t.solidText}`}>
			<h2 className={s.prompt}>What would you like to do?</h2>
			<div className={`flex flex-row justify-around items-center w-1/2`}>
				<HomeCard icon={<UserIcon/>} text={"Host Game"}
					onClick={()=>{
						goToSection(PageSection.Login);
					}}
				/>
				<HomeCard icon={<UserIcon/>} text={"Join Game"}
					onClick={()=>{
						goToSection(PageSection.Join);
					}}
				/>
			</div>

			<div className={`${s.backToTop} flex justify-center items-center`}>
				<Btn
					onClick={()=>{
						goToSection(PageSection.Splash);
					}}
				>
					<div className={`flex justify-center items-center`}>
						<div>Back to top</div>
						<div className={`aspect-square w-10 ${t.fillSolidText}`}>
							<SVGIcon>
								<CaretArrow/>
							</SVGIcon>
						</div>
					</div>
				</Btn>
			</div>
			{active && <FixedContents/>}
		</section>
	)
}
function LoginSection(){

	let [showPass, setShowPass] = useState(false);
	let checkBoxRef = useRef(null);

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Login);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	useEffect(()=>{
		function onCheck(e:Event){
			let elem = e.currentTarget as HTMLInputElement;
			setShowPass(elem.checked);
		}
		let checkBox = checkBoxRef.current as HTMLInputElement;
		checkBox?.addEventListener("change", onCheck);
		
		return ()=>{
			checkBox?.removeEventListener("change", onCheck);
		}
	},[])

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] w-max h-screen absolute top-[100svh] left-[-100vw] flex flex-row p-8 justify-evenly items-center`}>
			<div className={` rounded-tl-rounded  w-full h-full grid grid-rows-2 grid-cols-1 md:grid-cols-2 gap-2 p-2 ${t.solidText}`}>
				<div className={`rounded-md rounded-b-none md:rounded-b-md rounded-r-md md:rounded-r-none  ${t.solidElement} row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-evenly md:gap-20 md:justify-center items-center`}>
					<div className={`flex flex-col gap-2 w-2/3 lg:w-1/2`}>
						<label className={`flex`}>Username</label>
						<input className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
					</div>
					<div className={`flex flex-col gap-2 w-2/3 lg:w-1/2`}>
						<label className={`flex`}>Password</label>
						<input type={showPass ? `text` : `password`} className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
						<div className={`flex gap-2 text-xs self-end`}>
							<input ref={checkBoxRef} type="checkbox" className={`flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
							<label className={`flex`}>Show password</label>
						</div>
					</div>
					<div>
						<Btn>Sign in</Btn>
					</div>
				</div>
				<div className={`rounded-md row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-evenly items-center`}>
					<div></div>
					<div>Login to create a game</div>
					<div>
						<Btn
							onClick={()=>{
								goToSection(PageSection.Start);
							}}
						>
							Return to Main Menu
						</Btn>
					</div>
				</div>
			</div>
			{active && <FixedContents/>}
		</section>
	)
}

function tryJoin(code:string){
	code = sanitizeString(code.trim().replaceAll(/[^a-zA-Z0-9]/g,"").slice(0,8));

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

function JoinSection(){

	let [active, setActive] = useState(false);

	let textBoxRef = useRef(null);

	function onChange(e:Event){
		let elem = e.currentTarget as HTMLInputElement;
		let text = elem.value.replaceAll(/[^a-zA-Z0-9]/g,"").slice(0,8);

		let newCode = text;
		if(newCode.length > 4){
			let arr = new Array<string>(8);
			(text.split("")).forEach((v,i)=>{
				arr[i] = v;
			})
			arr.splice(4,0,"-")
			newCode = arr.join("");
		}
		
		elem.value = newCode.toLocaleUpperCase();
	}

	useEffect(()=>{
		let textBox = textBoxRef.current as HTMLInputElement;
		textBox?.addEventListener("input", onChange);
		
		return () => {
			textBox?.removeEventListener("input", onChange);
		}

	},[])

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Join);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] w-max h-screen absolute top-[100svh] left-[100vw] flex flex-row p-8 justify-evenly items-center`}>
			<div className={`rounded-tl-rounded  w-full h-full grid grid-rows-2 grid-cols-1 md:grid-cols-2 gap-2 p-2 ${t.solidText}`}>
				<div className={`rounded-md row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-evenly items-center`}>
					<div></div>
					<div>Enter the game code to join</div>
					<div>
						<Btn
							onClick={()=>{
								goToSection(PageSection.Start);
							}}
						>
							Return to Main Menu
						</Btn>
					</div>
				</div>
				<div className={`rounded-md rounded-b-none md:rounded-b-md rounded-l-md md:rounded-l-none  ${t.solidElement} row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-evenly md:gap-20 md:justify-center items-center`}>
					<div className={`flex justify-center items-center border ${t.buttonBorder} w-1/4 md:w-1/2 p-4 rounded-md`}>
						<AvatarIcon url={`${getIconURL()}`}/>
					</div>
					<div className={`flex flex-col gap-2 `}>
						<label className={`flex`}>Room Code</label>
						<input ref={textBoxRef} className={`text-2xl tracking-widest text-center justify-center items-center flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`} maxLength={9}/>
					</div>
					<div>
						<Btn onClick={()=>{
							let textBox = textBoxRef.current as HTMLInputElement;
							let v = textBox.value;
							tryJoin(v);
						}}>
							Join Game
						</Btn>
					</div>
				</div>
			</div>
			{active && <FixedContents/>}
		</section>
	)
}
function JoiningSection(){

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Joining);
	}, homePageSectionBus);

	return (
		<section className={`${t.gradient} ${t.solidText} min-h-[100vh] min-w-[100vw] w-max h-screen absolute top-[100svh] left-[200vw] flex flex-row p-8 justify-evenly items-center`}>
			<div className={`w-full h-full rounded-md flex flex-col justify-center items-center gap-8`}>
				<div></div>
				<div>Joining Room</div>
				<div className={`flex justify-center items-center`}>
					<LoadingStatus/>
				</div>
			</div>
			{active && <FixedContents/>}
		</section>
	)
}

function FixedContents(){
	return (
		<div className={`fixed z-100 pointer-events-none w-screen h-screen m-0 p-0`}>
			<ContentLayer z={10}>
				<NotifContainer></NotifContainer>
			</ContentLayer>
		</div>
	)
}

export default function Home() {
	useSignals();

	const { theme  } = useTheme();

	router = useRouter();

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
