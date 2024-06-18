import { signal } from "@preact/signals-react";
import { getData, Role, GameState } from "./dummyData";

export let hostData = signal({
	id: "1234abcd",
	key: "1234abcd",
	name: "Dr. Fax Tax",
	games: ["1A2B3C4D"],
})
export let playerData = signal({
	id: "1234abcd",
	name: "Mike Hunt",
	funds: 0,
	role: Role.None,
	incomeFunds: 0,
	declaredFunds: 0,
	isReady: false,
	icon: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=1234abcd-abcdefg`, //iconURL
	worldID: "",
})
export let worldData = signal({
	id: "1234abcd",
	name: "Yiffie",
	ownerID: "7890wxyz",
	citizens: [],
	taxFunds: 0,
	taxRate: 0,
})
export let roomData = signal({
	id: "1A2B3C4D",
	name: "Game 1",
	year: 0,
	host:  "1234abcd",
	players: [],
	worlds: [],
	taxCoeff: 1.5,
	maxNumberOfPlayers: 20,
	penalty: 0.3,
	kickPlayersOnBackruptcy: true,
	auditProbability: 0.1,
	gameState: GameState.Waiting,
})

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

		let newObj = getData(table as any, obj.id) as any;
		if(newObj){
			val.value = {...newObj};
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
		return true;
	}
	
}