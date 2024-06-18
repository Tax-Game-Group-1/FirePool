"use client"

import { updateGameGlobal } from "@/app/global";
import { animate } from "framer-motion";
import { useEffect } from "react";

export function useRemoveLoadingScreen(callback:()=>void, onLoad?:()=>void, time:number = 0.5){
	useEffect(()=>{
		updateGameGlobal();
		function onPageLoad(){

			onLoad?.();
			
			let loadingThingy = document.querySelector(`.loadingThingy`);
			animate(loadingThingy, { opacity:[1,0] }, {duration: time}).then(()=>{
		
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
		return () => window.removeEventListener('load', onPageLoad);
	},[])
}