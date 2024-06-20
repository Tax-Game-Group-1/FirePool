import { signal } from "@preact/signals-react";
import { Role, GameState, IRoomData, IWorldData, IPlayerData, IHostData, IData, IObject } from '@/interfaces';
import { getData } from "./dummyData";

// export const hostData = signal<IHostData>({
// 	id: "1234abcd",
// 	key: "1234abcd",
// 	name: "Dr. Fax Tax",
// 	games: ["1A2B3C4D"],
// })
export const hostData = signal<IHostData>({} as any)
// export const playerData = signal<IPlayerData>({
// 	id: "1234abcd",
// 	name: "Mike Hunt",
// 	funds: 0,
// 	role: Role.None,
// 	incomeFunds: 0,
// 	declaredFunds: 0,
// 	isReady: false,
// 	icon: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=1234abcd-abcdefg`, //iconURL
// 	worldID: "",
// })
export const playerData = signal<IPlayerData>({} as any)
// export const worldData = signal<IWorldData>({
// 	id: "1234abcd",
// 	name: "Yiffie",
// 	ownerID: "7890wxyz",
// 	citizens: [],
// 	taxFunds: 0,
// 	taxRate: 0,
// })
export const worldData = signal<IWorldData>({} as any)
// export const roomData = signal<IRoomData>({
// 	id: "1A2B3C4D",
// 	name: "Game 1",
// 	year: 0,
// 	host:  "1234abcd",
// 	players: [],
// 	worlds: [],
// 	taxCoeff: 1.5,
// 	maxNumberOfPlayers: 20,
// 	penalty: 0.3,
// 	kickPlayersOnBankruptcy: true,
// 	auditProbability: 0.1,
// 	gameState: GameState.Waiting,
// })
export const roomData = signal<IRoomData>({} as any)

export const GameGlobal = {
	roomData, worldData, playerData, hostData
}

export function updateGameGlobal(table?:string){
	let {
		roomData, worldData, playerData, hostData,
	} = GameGlobal;

	let datas = {
		rooms: roomData,
		players: playerData,
		hosts: hostData,
		worlds: worldData,
	}

	if(table){
		let val = datas[table];
		let obj = val.value;

		let newObj = getData(table as any, obj.id);
		if(newObj){
			val.value = {...newObj};
			saveGameGlobal();
			return true;
		}

		return false;
	}else{
		for(let key of Object.keys(datas)){
			let val = datas[key];
			let obj = val.value;
			
			let newObj = getData(key as any, obj.id) as any;
			if(newObj){
				val.value = {...newObj};
			}
		}
		saveGameGlobal();
		return true;
	}
	
}

export function saveGameGlobal(){
	for(let [k, v] of Object.entries(GameGlobal)){
		let obj = v.value as IData;
		let jsonStr = JSON.stringify(obj);
	
		localStorage.setItem(k, jsonStr);
		console.log(`${k} saved in storage`)
		console.log(obj);
	}
}
export function loadGameGlobal(){
	for(let [k, v] of Object.entries(GameGlobal)){
		let str = localStorage.getItem(k);
		if(!str) return;
		
		let obj = JSON.parse(str) as IData;
		
		v.value = {...obj} as any;
		console.log(`${k} loaded from storage`)
		console.log(obj);
	}
}