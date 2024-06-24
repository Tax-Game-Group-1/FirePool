"use client"
import React, { forwardRef, Ref } from "react"

import style from "./GameHUD.module.scss"
import { showPlayerHUD } from './PlayerHUD';
import { showWorldHUD } from "./WorldHUD";

const GameHUD = forwardRef(function GameHUD({children}:{
	children?: React.ReactNode
}, ref:Ref<any>){	
	let flags = [showPlayerHUD.value, showWorldHUD.value];
	let flexDir = "flex-col-reverse";
	if(flags.every(f => f)){
		flexDir = "flex-col"
	}
	return (
		<div ref={ref} className={`${style.gameHUD} ${flexDir}`}>
			{children}
		</div>
	)
});

export { PlayerHUD } from "./PlayerHUD";
export { WorldHUD } from "./WorldHUD";

export default GameHUD;