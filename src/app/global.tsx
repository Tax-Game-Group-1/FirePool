import { computed, signal } from "@preact/signals-react";
import {} from '@/interfaces';
import { getIconURL } from "@/utils/utils";

import Themes from "../components/ThemeContext/themes.module.scss"

export const gameCodeLength = 6;

export const GameGlobal = {
	room: signal<any>({}),
	universe:  signal<any>({}),
	player:  signal<any>({}),
	user:  signal<any>({}),
	playerRound:  signal<any>({}),
	universeRound:  signal<any>({}),
	theme: signal<string>(Themes.darkBlue),
}

export let theme = {
	value: GameGlobal.theme.value,
};

export function saveGameGlobal(key?:string){
	if(GameGlobal[key]){
		let obj = GameGlobal[key].value;
		let jsonStr = JSON.stringify(obj);
	
		localStorage.setItem(key, jsonStr);
		console.log(`${key} saved in storage`)
		console.log(obj);
	}else{
		for(let [k, v] of Object.entries(GameGlobal)){
			let obj = v.value;
			let jsonStr = JSON.stringify(obj);
		
			localStorage.setItem(k, jsonStr);
			console.log(`${k} saved in storage`)
			console.log(obj);
		}
	}
}

export function loadGameGlobal(key?:string){
	if(GameGlobal[key]){
		let str = localStorage.getItem(key);
		if(!str) return;
		
		let obj = JSON.parse(str);
	
		GameGlobal[key].value = obj as any;
		console.log(`${key} loaded from storage`)
		console.log(obj);
	}else{
		for(let [k, v] of Object.entries(GameGlobal)){
			let str = localStorage.getItem(k);
			if(!str) return;
			
			let obj = JSON.parse(str);
			
			v.value = obj as any;
			console.log(`${k} loaded from storage`)
			console.log(obj);
		}
	}
}

export function deleteGameGlobal(key?:string){
	if(GameGlobal[key]){
		GameGlobal[key].value = {};
		let obj = GameGlobal[key].value;
		let jsonStr = JSON.stringify(obj);
	
		localStorage.setItem(key, jsonStr);
		console.log(`${key} deleted in storage`)
		console.log(obj);
	}else{
		for(let [k, v] of Object.entries(GameGlobal)){
			v.value = {};
			let obj = v.value;
			let jsonStr = JSON.stringify(obj);
		
			localStorage.setItem(k, jsonStr);
			console.log(`${k} saved in storage`)
			console.log(obj);
		}
	}
}

//computed

export let gameCode = computed(function(){
	let code:string = GameGlobal.room.value?.gameCode || "";
	let mid = Math.trunc(code.length/2);
	code = [code.slice(0, mid), code.slice(mid)].join("-");
	return code;
})
export let gameID = computed(function(){
	let id = GameGlobal.room.value?.gameId || "";
	return id;
})
export let gameName = computed(()=>{
	let name = GameGlobal.room.value?.name || "";
	return name;
});
export let hostName = computed(()=>{
	let name = GameGlobal.user.value?.name || "";
	return name;
});
export let hostID = computed(()=>{
	let id = GameGlobal.user.value?.id || "";
	return id;
});
export let playerName = computed(()=>{
	let name = GameGlobal.player.value?.name || "";
	return name;
});
export let numOfPlayers = signal(0);
export let maxNumOfPlayers = signal(0);

export let gamePlayers = signal([]);

export let playerID = computed(()=>{
	let id = GameGlobal.player.value?.playerId || -1;
	return id;
})
export let playerIconURL = computed(()=>{
	let url = GameGlobal.player.value?.icon || getIconURL().href;
	return url;
})
export let playerFunds = computed(()=>{
	let funds = GameGlobal.player.value?.funds || 0;
	return funds;
})
export let playerRole = computed(()=>{
	let role = GameGlobal.player.value?.role;
	return role;
})

export let universeName = computed(()=>{
	let name = GameGlobal.universe.value?.name || "";
	return name;
});
export let taxRate = computed(()=>{
	let t = GameGlobal.universe.value?.taxRate || 0;
	return t * 100;
});
export let round = computed(()=>{
	let y = GameGlobal.room.value?.round || 0;
	return y;
});
export let universeTaxFunds = computed(()=>{
	let f = GameGlobal.universe.value?.taxFunds || 0;
	return f;
});
export let universeTaxRate = computed(()=>{
	let f = GameGlobal.universe.value?.taxRate || 0;
	return f;
});
export let universeFunds = signal(0);
