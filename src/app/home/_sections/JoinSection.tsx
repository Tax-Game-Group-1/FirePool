"use client"

import { AvatarIcon } from "@/app/game/_waiting/namingRoom";
import Btn from "@/components/Button/Btn";
import LoadingStatus from "@/components/Loading/Loading";
import { getIconURL } from "@/utils/utils";
import { useSignalEvent } from "@catsums/signal-event-bus";
import { useState, useRef, useEffect } from "react";
import { PageSection, homePageSectionBus, goToSection, tryJoin } from "../page";
import { FixedContents } from "./FixedContents";

import s from '../page.module.scss';
import t from '../../../elements.module.scss'
import { gameCodeLength } from "@/app/global";

export function JoinSection(){

	let [active, setActive] = useState(false);

	let textBoxRef = useRef(null);

	function onChange(e:Event){
		let elem = e.currentTarget as HTMLInputElement;
		let text = elem.value.replaceAll(/[^a-zA-Z0-9]/g,"").slice(0, gameCodeLength);

		let newCode = text;
		if(newCode.length > (gameCodeLength/2)){
			let arr = new Array<string>(gameCodeLength);
			(text.split("")).forEach((v,i)=>{
				arr[i] = v;
			})
			arr.splice( (gameCodeLength/2), 0, "-")
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
		<section className={`${activeClass} ${t.background} min-h-[100vh] min-w-[100vw] w-max h-screen absolute top-[100svh] left-[100vw] flex flex-row p-8 justify-evenly items-center`}>
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
				<div className={`rounded-md rounded-b-none md:rounded-b-md rounded-l-md md:rounded-l-none  ${t.solidElement} row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-center md:gap-10 md:justify-center items-center`}>
					<div className={`flex justify-center items-center border ${t.buttonBorder} w-1/4 md:w-1/2 p-2 md:p-4 m-1 md:m-2 rounded-md`}>
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

export function JoiningSection(){

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
