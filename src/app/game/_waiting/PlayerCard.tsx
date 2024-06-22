"use client"

import { useAnimate } from "framer-motion";
import { forwardRef, Ref, useEffect, useRef } from "react";

import t from "../../../elements.module.scss"
import { useSignals } from "@preact/signals-react/runtime";

export const PlayerCard = forwardRef(function PlayerCard({
	children, name="", ready=false,
}:{
	children?: React.ReactNode;
	name?: string;
	ready?: boolean;
}, ref:Ref<any>){
	useSignals();
	

	let readyRef = useRef(null);
	let [scope, animate] = useAnimate();

	useEffect(() => {
		if(ready){
			let anim = animate(readyRef.current, {
				scaleX:[0,1], opacity: [0,1]
			}, { duration: 0.4, ease: "backInOut", delay: 0.1, });

			return () => {
				anim.complete();
			}
		}
	},[ready]);

	return (
		<div ref={ref} className={`flex flex-col aspect-[0.75] relative items-center justify-evenly p-2 lg:p-4 gap-2 ${t.solidElement} rounded-md`}>
			<div className={`${t.textBoxBackground} aspect-square rounded-md w-full`}>
				{children}
			</div>
			<div className={`flex p-2 pb-4 text-sm break-all`}>
				{name}
			</div>
			{
				ready &&
				<div ref={readyRef} className={`${t.textBoxBackground} ${t.textBoxFont} ${t.solidBorder} font-semibold absolute text-xs bottom-[-0.25rem] md:bottom-[-1rem] rounded-full flex px-4 py-1 opacity-0`}>
					READY
				</div>
			}
		</div>
	)

})