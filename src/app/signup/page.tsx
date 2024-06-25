"use client"
import Btn from '@/components/Button/Btn';
import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { goToSection, PageSection } from '../home/page';
import { ContentLayer } from '@/components/Game/ContentLayer';
import NotifContainer, { createNotif } from '@/components/Notification/Notification';

import t from "../../elements.module.scss";

import "./page.scss"
import { PopUpContainer } from '@/components/PopUp/PopUp';
import { useTheme } from '@/components/ThemeContext/themecontext';

import {signal} from "@preact/signals-react"
import { useSignals } from '@preact/signals-react/runtime';
import { useAnimate } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { loadGameGlobal, GameGlobal, saveGameGlobal } from '../global';

import { IHostData } from '@/interfaces';

import { useRouter } from 'next/navigation';

let showPass = signal(false);
let active = signal(false);

export default function Page() {
	useSignals();
	
	let {theme} = useTheme();
	let [scope, animate] = useAnimate();

	let usernameRef = useRef(null);
	let emailRef = useRef(null);
	let passRef = useRef(null);
	let confirmPassRef = useRef(null);

	let router = useRouter();

	async function signUp(){

		let username = usernameRef.current?.value?.trim();
		let email = emailRef.current?.value?.trim();
		let pass = passRef.current?.value?.trim();
		let confirmPass = confirmPassRef.current?.value?.trim();

		if(!username){
			createNotif({content: "Username is missing"});
			return;
		}
		if(!pass){
			createNotif({content: "Password is missing"});
			return;
		}
		if(!confirmPass){
			createNotif({content: "You need to confirm your password"});
			return;
		}
		if(!email){
			createNotif({content: "Email is missing"});
			return;
		}

		if(pass != confirmPass){
			createNotif({content: "Password does not match with Confirm Password"});
			return;
		}

		let res = await fetch("/adminSignup",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({
				username, 
				password: pass, 
				email,
			})
		}).then(r => r.json()).catch((err)=>{
			createNotif({
				content: "Server error. Something wrong happened with the request"
			});
		});

		if(!res?.success){
			createNotif({
				content: `${res?.message}` || "Server error. Something wrong happened with the request"
			});
			console.dir(res.message)
			return;
		}

		//context
		GameGlobal.user.value = {
			name: res.data.username,
			id: res.data.id,
		} as IHostData;
		//localstorage
		saveGameGlobal();

		createNotif({
			content: "Success! Automatically logging you in...",
			time: 1,
		});
		setTimeout(()=>{
			// window.location.href = "/host";
			router.push("/host");
		}, 1000);

		return;

	}
	
	useRemoveLoadingScreen(()=>{
		active.value = true;
		loadGameGlobal();
	})

	useEffect(()=>{
		if(!scope?.current) return;

		let anim = animate(scope?.current, {
			opacity: [0,1],
			scaleX: [0,1],
		}, {duration: 0.5, ease: "backInOut"});
		

		return () => {
			anim?.cancel();
		}
	},[])

	//checkbox ref
	let checkBoxRef = useRef(null);
	function onCheck(e:ChangeEvent){
		let elem = e.currentTarget as HTMLInputElement;
		showPass.value = elem.checked;
	}

	// let activeClass = active.value ? 'pointer-events-auto' : `pointer-events-none`;

	return (
		<>
				<main className={`${theme}`}>
				  <div className={`${t.background} ${t.solidText} min-w-screen min-h-screen flex flex-col p-8 justify-evenly items-center`}>	
					<form ref={scope} className={`opacity-0 rounded-md ${t.solidElement} w-2/3 md:w-1/2 flex flex-col gap-4 p-4 lg:p-8 py-12 justify-center items-center`}>
						<div className={`flex flex-col gap-2 w-full sm:w-4/5 lg:w-2/3`}>
							<label htmlFor="username" className={`flex`}>Username</label>
							<input ref={usernameRef} name="username" className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
						</div>
						<div className={`flex flex-col gap-2 w-full sm:w-4/5 lg:w-2/3`}>
							<label htmlFor="email" className={`flex`}>Email</label>
							<input ref={emailRef} name="email" type="email" className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
						</div>
						<div className={`flex flex-col gap-2`}>
							<div className={`flex flex-col lg:flex-row gap-4 md:gap-2 justify-center items-center`}>
								<div className={`flex flex-col gap-2 `}>
									<label htmlFor="password" className={`flex`}>Password</label>
									<input ref={passRef}  name="password" type={showPass.value ? `text` : `password`} className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
								</div>
								<div className={`flex flex-col gap-2 `}>
									<label htmlFor="confirm-password" className={`flex`}>Confirm Password</label>
									<input ref={confirmPassRef} name="confirm-password" type={showPass.value ? `text` : `password`} className={`text-sm flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
								</div>
							</div>
							<div className={`flex gap-2 text-xs self-start`}>
								<input name="show-password" ref={checkBoxRef} onChange={onCheck} type="checkbox" className={`flex rounded-md p-2 ${t.inputBox} ${t.buttonText}`}/>
								<label htmlFor="show-password" className={`flex`}>Show password</label>
							</div>
						</div>
						<div>
							<Btn onClick={()=>{
								signUp();

							}}>Sign up</Btn>
						</div>
					</form>
					<div className={`fixed z-100 pointer-events-none w-screen h-screen m-0 p-0`}>
						<ContentLayer z={10}>
							<NotifContainer></NotifContainer>
						</ContentLayer>
						<ContentLayer z={10}>
							<PopUpContainer></PopUpContainer>
						</ContentLayer>
					</div>
				  </div>	
				</main>
		</>
	)
}
