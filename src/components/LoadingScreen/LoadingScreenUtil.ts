"use client"

import { updateGameGlobal } from "@/app/global";
import { animate, AnimationPlaybackControls } from 'framer-motion';
import { useEffect } from "react";

import { useSignals } from "@preact/signals-react/runtime";

export function useRemoveLoadingScreen(callback:()=>void, onLoad?:()=>void, time:number = 0.5){
	useSignals();
	useEffect(()=>{
		let anim:AnimationPlaybackControls;
		function onPageLoad(){

			if(onLoad){
				console.log(9)
				onLoad();
			}
			
			let loadingThingy = document.querySelector(`.loadingThingy`);
			if(!loadingThingy) return;
			anim = animate(loadingThingy, { opacity:[1,0] }, {duration: time})
			anim.then(()=>{
		
				// do something else
				callback();
		
				loadingThingy?.classList.add("hidden");
				try{
					loadingThingy?.remove();
				}catch(err){}

			});
		}
	
		// Check if the page has already loaded
		if (document.readyState === 'complete') {
			onPageLoad();
		} else {
			window.addEventListener('load', onPageLoad, false);
		}
		// Remove the event listener when component unmounts
		return () => {
			anim?.cancel();
			window.removeEventListener('load', onPageLoad)
		};
	},[callback, onLoad, time])
}