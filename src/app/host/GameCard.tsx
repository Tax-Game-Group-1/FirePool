"use client"

import { useAnimate } from "framer-motion";
import { forwardRef, Ref, useEffect, useRef,MouseEvent } from "react";

import t from "../../elements.module.scss"
import s from "./GameCard.module.scss"
import { useSignals } from "@preact/signals-react/runtime";
import { mergeRefs } from "@/mergeRefs/mergeRefs";

export const GameCard = forwardRef(function GameCard({
	children, name="", 
	isSelected=false,
	onClick = ()=>{},
}:{
	children?: React.ReactNode;
	name?: string;
	isSelected?: boolean;
	onClick?:(e?:MouseEvent)=>void;
}, ref:Ref<any>){
	useSignals();
	

	// let readyRef = useRef(null);
	let [scope, animate] = useAnimate();

	useEffect(() => {
		let anim = animate(scope?.current, {
			opacity: [0,1]
		}, { duration: 0.4, ease: "backInOut", delay: 0.1, });

		return () => {
			anim.complete();
		}
	},[]);

	return (
		<div onClick={onClick} ref={mergeRefs(ref, scope) as any} className={`${t.solidElement} ${s.gameCard}`}>
			<div className={`${t.textBoxBackground} aspect-square rounded-md w-full`}>
				{children}
			</div>
			<div className={`flex p-2 pb-4 text-sm break-all`}>
				{name}
			</div>
		</div>
	)

})