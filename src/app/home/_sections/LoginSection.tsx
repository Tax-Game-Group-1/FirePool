"use client"

import Btn from "@/components/Button/Btn";
import { useSignalEvent } from "@catsums/signal-event-bus";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { goToSection, homePageSectionBus, PageSection, tryLogin } from "../page";
import { FixedContents } from "./FixedContents";

import s from '../page.module.scss';
import t from '../../../elements.module.scss'

export function LoginSection(){

	//password state
	let [showPass, setShowPass] = useState(false);
	//checkbox ref
	let checkBoxRef = useRef(null);

	//checks if section active (prevents accidental clicks)
	let [active, setActive] = useState(false);

	//signal checks if section is navigate
	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Login);
	}, homePageSectionBus);

	//adds this class if active or nah
	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	
	function onCheck(e:ChangeEvent){
		let elem = e.currentTarget as HTMLInputElement;
		setShowPass(elem.checked);
	}

	function onLoginBtnClick(){
		let username, password : string;
		let usernameInputBox = document.getElementsByName("username")[0] as HTMLInputElement;
		let passInputBox = document.getElementsByName("password")[0] as HTMLInputElement;

		username = usernameInputBox.value.trim() || "";
		password = passInputBox.value.trim() || "";

		tryLogin(username, password);

	}

	return (
		<section className={`${activeClass} ${t.background} min-h-[100vh] min-w-[100vw] w-max h-screen absolute top-[100svh] left-[-100vw] flex flex-row p-8 justify-evenly items-center`}>
			<div className={` rounded-tl-rounded  w-full h-full grid grid-rows-2 grid-cols-1 md:grid-cols-2 gap-2 p-2 ${t.solidText}`}>
				<div className={`rounded-md rounded-b-none md:rounded-b-md rounded-r-md md:rounded-r-none  ${t.solidElement} row-span-1 md:row-span-2 col-span-2 md:col-span-1 flex flex-col justify-evenly md:gap-20 md:justify-center items-center`}>
					<div className={`flex flex-col gap-2 w-2/3 lg:w-1/2`}>
						<label className={`flex`}>Username</label>
						<input name="username" className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
					</div>
					<div className={`flex flex-col gap-2 w-2/3 lg:w-1/2`}>
						<label className={`flex`}>Password</label>
						<input name="password" type={showPass ? `text` : `password`} className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
						<div className={`flex gap-2 text-xs self-end`}>
							<input ref={checkBoxRef} onChange={onCheck} type="checkbox" className={`flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
							<label className={`flex`}>Show password</label>
						</div>
					</div>
					<div>
						<Btn
							onClick={onLoginBtnClick}
						>Sign in</Btn>
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