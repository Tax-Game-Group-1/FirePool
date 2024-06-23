"use client"
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer'
import { createContent, GameContent } from '@/components/Game/GameContentContainer'
import React, { use, useEffect, useRef } from 'react'
import { AvatarIcon } from '../_waiting/namingRoom'
import { GameGlobal, playerID } from '@/app/global'
import { getIconURL } from '@/utils/utils'

import t from "../../../elements.module.scss"
import { DiceIcon } from '@/assets/svg/svg'
import { computed, signal } from '@preact/signals-react'
import { useAnimate } from 'framer-motion'

let role = computed(()=>{
	let role = GameGlobal.player.value.type || GameGlobal.player.value.role || "No role";
	return role;
})

let revealed = signal(false);

export function InfoPop({children, direction="left", isAbsolute=false}:{
	children?:React.ReactNode,
	direction?: "left"|"right"|"center",
	isAbsolute?: boolean,
}){

	let classes = `self-start md:self-end lg:self-start`;
	switch(direction){
		case "left":
			classes = `self-start md:self-end lg:self-start`;
			break;
		case "center":
			classes = `self-center md:self-end lg:self-center`;
			break;
		case "right":
			classes = `self-end md:self-end lg:self-end`;
			break;
	}

	return (
		<AnimationContainer enter={{
			animations:{opacity:[0,1], y:[100,0]},
			options: {duration: 0.3, ease: "easeInOut"}
		}}>
			<div className={`${isAbsolute ? "absolute" : "relative"} flex ${t.solidElement} p-2 rounded-md border ${t.solidBorder} ${t.solidText} opacity-0 text-xs ${classes} m-2`}>
				<span>{children}</span>
			</div>
		</AnimationContainer>
	)
}

function revealSideEffects(){
	let pros = [];
	let cons = [];

	switch(role.value?.toLowerCase()){
		case "minister":
			pros = [
				"You can manage your universe",
				"You can distribute credits to others",
				"You can decide the tax rate",
			];
			cons = [
				"You can't leave your universe",
				"You lose when you are bankrupt",
				"You lose when your universe is abandoned or bankrupt",
			]
			break;
		case "localworker":
			pros = [
				"You can maximise your profits",
				"You can get profits from the minister",
			];
			cons = [
				"You can't leave your universe",
				"You lose when you are bankrupt",
				"You get taxed every round",
			]
			break;
		case "foreignworker":
			pros = [
				"You can maximise your profits",
				"You can get profits from the minister",
				"You can migrate to other universes after Year 6",
			];
			cons = [
				"You lose when you are bankrupt",
				"You get taxed every round",
			]
			break;
		default:
			// pros = [
			// 	"You can watch the game",
			// ];
			// cons = [
			// 	"You cant play the game",
			// ]
			pros = [
				"You can maximise your profits",
				"You can get profits from the minister",
				"You can migrate to other universes after Year 6",
			];
			cons = [
				"You lose when you are bankrupt",
				"You get taxed every round",
			]
			break;
	}

	for(let i=0; i<pros.length; i++){
		let pro = pros[i];
		createContent({
			content: (<InfoPop direction='left'>★ {pro}</InfoPop>),
			useWrapper: false,
			time: (i/10),
		})
	}
	for(let i=0; i<cons.length; i++){
		let con = cons[i];
		createContent({
			content: (<InfoPop direction='right'>ⓧ {con}</InfoPop>),
			useWrapper: false,
			time: (i/10),
		})
	}
}

export default function RevealCard() {

	let [scope, animate] = useAnimate();
	
	let revealer = useRef(null);
	let roleCard = useRef(null);

	async function onClickReveal(){
		await animate(revealer.current, {
			opacity: [1,0],
			y: [0,100],
		}, { duration: 0.1, ease: "easeOut" })
		await animate(roleCard.current, {
			scale: [1,1.3],
		}, { duration: 0.25, ease: "backInOut" })


		revealSideEffects();

	}



	return (
		<AnimationContainer
			enter={{
				animations:{
					opacity: [0,1],
					y: [100,0],
				},
				options:{
					duration: 0.5,
				}
			}}
		>
			<GameContent isSub isAbsolute className={`w-5/6 h-3/5 md:w-3/5 lg:w-1/2 md:h-5/6 self-center md:self-start lg:self-center `}>
				<div className={`flex flex-col w-full justify-evenly items-center gap-4`}>
					<div className={`border p-1 md:p-2 ${t.solidBorder} rounded-md aspect-square w-1/4 lg:w-1/4 m-2`}>
						<AvatarIcon url={getIconURL(playerID.value).href}/>
					</div>
					<div  className={`relative flex flex-col items-center justify-center w-full m-2`}>
						<div ref={roleCard} className={`${t.toolBar} rounded-md p-2 absolute flex items-center flex-col w-3/5`}>
							<div>
								{role}
							</div>
						</div>
						<div ref={revealer} onClick={onClickReveal} className={`${t.solidElement} border p-2 rounded-md absolute flex items-center flex-col w-3/5`}>
							<div className={`${t.fillAccent} ${t.solidBG} p-1 rounded-full text-xs w-2/12 md:w-1/12 lg:w-3/12`}>
								<DiceIcon/>
							</div>
							<div>
								Press to reveal your role
							</div>
						</div>
					</div>
				</div>
			</GameContent>
		</AnimationContainer>
	)
}
