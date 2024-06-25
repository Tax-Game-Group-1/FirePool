"use client"

import { randomItemFrom, rndInt, randomID } from '@catsums/my';
import {Handler, SignalEventBus} from "@catsums/signal-event-bus";
import _ from "lodash";

export function shareURL(url:URL, gameName?:string){
	return window.navigator.share({
		url: url.href,
		title: "Join the Fire Pool Tax Game",
		text: `Click the link to join the game ${gameName || ""}`,
	})
}
export function copyToClipboard(text:string){
	return window.navigator.clipboard.writeText(text);
}

export interface ITimerInstance {
	startTime: number,
	prevTime: number,
	elapsed: number,
	time: number,
	bus: SignalEventBus,
	progress: number,
	isPaused: boolean,
	isDone: boolean,
	onStart?: (x:Handler) => ITimerInstance,
	onComplete?: (x:Handler) => ITimerInstance,
	onProgress?: (x:Handler) => ITimerInstance,
	end?: () => void,
	pause?: () => void,
	resume?: () => void,
}

export class TimerInstance implements ITimerInstance {
	startTime = 0;
	prevTime = 0;
	elapsed = 0;
	time = 0;
	progress = 0;
	isPaused = false;
	isDone = false;
	bus = new SignalEventBus();
	
	constructor(time:number){
		this.time = time * 1000;
		this.bus.on("end",()=>{
			this.isDone = true;
			this.isPaused = true;
		})
	}
	onStart(x: Handler){
		this.bus.on("start", x);
		return this;
	}
	onProgress(x:Handler){
		this.bus.on("progress", x);
		return this;
	}
	onComplete(x:Handler){
		this.bus.on("complete", x);
		return this;
	}
	end(){
		this.bus.emit("end");
	}
	pause(){
		this.isPaused = true;
	}
	resume(){
		this.isPaused = false;
	}
}

export function createTimer(time:number, onComplete?:(timer?:TimerInstance)=>void){
	let timer = new TimerInstance(time);
	if(onComplete){
		timer.onComplete(onComplete);
	}

	function wait(currTime){
		if(!timer.startTime){
			timer.startTime = currTime;
			timer.prevTime = currTime;
			timer.bus.emit("start", timer);
		}
		let delta = currTime - timer.prevTime;
		if(!timer.isPaused){
			timer.elapsed += delta;
			timer.progress = _.clamp(timer.elapsed / timer.time, 0, 1);

			//changes
			timer.bus.emit("progress", timer);
			
		}
		timer.prevTime = currTime;
		if(timer.progress >= 1){
			timer.progress = 1;
			timer.bus.emit("complete", timer);
			timer.isDone = true;
		}else if(!timer.isDone){
			requestAnimationFrame(wait);
		}
	}
	requestAnimationFrame(wait);

	return timer;
}

export const DiceBearURL = `https://api.dicebear.com/9.x/`;

export const DiceBearPacks = [
	"bottts-neutral", "fun-emoji",
];

export function getIconURL(seed:string = randomID()){
	let pack = randomItemFrom(DiceBearPacks) //get from pack based on if its even or odd
	let url = `${DiceBearURL}${pack}/svg?seed=${seed}`;

	return new URL(url);
}