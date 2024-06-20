import { IHostData, IPlayerData, Role, IRoomData, IWorldData, IData, IObject } from "@/interfaces";

export const imageAPI = "https://api.dicebear.com/9.x/";

const hosts:IObject<IHostData> = {
	"1234abcd": {
		id: "1234abcd",
		key: "1234abcd",
		name: "drfaxtax",
		password: "drfaxtax",
		games: [
			"1A2B3C4D"
		],
	}
};
const players:IObject<IPlayerData> = {
	"1234abcd" : {
		id: "1234abcd",
		name: "Mike Hunt",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: false,
		icon: `${imageAPI}fun-emoji/svg?seed=1234abcd`, //iconURL
		worldID: "",
	},
	"1234abce" : {
		id: "1234abce",
		name: "Yiffie",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: true,
		icon: `${imageAPI}fun-emoji/svg?seed=d9sjeufb`, //iconURL
		worldID: "",
	},
	"abcd3456" : {
		id: "abcd3456",
		name: "Yan Long",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: false,
		icon: `${imageAPI}fun-emoji/svg?seed=25dj7vbc`, //iconURL
		worldID: "",
	},
	"12443ghy" : {
		id: "12443ghy",
		name: "Unique Smith",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: true,
		icon: `${imageAPI}fun-emoji/svg?seed=89ag9a`, //iconURL
		worldID: "",
	},
	"01235you" : {
		id: "01235you",
		name: "Tom Icebeak",
		funds: 0,
		role: Role.None,
		incomeFunds: 0,
		declaredFunds: 0,
		isReady: false,
		icon: `${imageAPI}fun-emoji/svg?seed=45554334443`, //iconURL
		worldID: "",
	},
};
const rooms:IObject<IRoomData> = {
	"1A2B3C4D" : {
		id: "1A2B3C4D",
		name: "Game 1",
		year: 1,
		host:  "1234abcd",
		players: [
			"1234abcd",
			"01235you",
			"12443ghy",
			"abcd3456",
			"1234abce",
		],
		worlds: [
			"1234abcd"
		],
		taxCoeff: 1.5,
		maxNumberOfPlayers: 20,
		penalty: 30,
		kickPlayersOnBankruptcy: true,
		auditProbability: 10,
		icon: `${imageAPI}fun-emoji/svg?seed=7fg8f73gf`, //iconURL
	},
	"1234ABCD" : {
		id: "1234ABCD",
		name: "Game 2",
		year: 1,
		host:  "1234abcd",
		players: [
			"1234abcd",
			"01235you",
			"12443ghy",
			"abcd3456",
			"1234abce",
		],
		worlds: [
			"1234abce"
		],
		taxCoeff: 1.5,
		maxNumberOfPlayers: 15,
		penalty: 30,
		kickPlayersOnBankruptcy: true,
		auditProbability: 20,
		icon: `${imageAPI}fun-emoji/svg?seed=eu8dhb3u8e`, //iconURL
	},
	"1234580D" : {
		id: "1234ABCD",
		name: "Game 3",
		year: 1,
		host:  "1234abce",
		players: [
			// "1234abcd",
			"01235you",
			"12443ghy",
			"abcd3456",
			"1234abce",
		],
		worlds: [
			"1234abc2"
		],
		taxCoeff: 1.7,
		maxNumberOfPlayers: 15,
		penalty: 30,
		kickPlayersOnBankruptcy: true,
		auditProbability: 20,
		icon: `${imageAPI}fun-emoji/svg?seed=1234tyou`, //iconURL
	},
};
const worlds:IObject<IWorldData> = {
	"1234abcd" : {
		id: "1234abcd",
		name: "Yiffie",
		ownerID: "7890wxyz",
		citizens: [
			"1234abcd",
			"01235you",
			"12443ghy",
		],
		taxFunds: 20,
		taxRate: 0.4,
	},
};

export function setData(table:"players", data:IPlayerData) : boolean;
export function setData(table:"rooms", data:IRoomData) : boolean;
export function setData(table:"hosts", data:IHostData) : boolean;
export function setData(table:"worlds", data:IWorldData) : boolean;

export function setData(table:"worlds", data:IData) : boolean;

export function setData(table:string, data:IData){
	let obj:IObject<IData>;
	switch(table){
		case "players":
			obj = players; break;
		case "rooms":
			obj = rooms; break;
		case "hosts":
			obj = hosts; break;
		case "worlds":
			obj = worlds; break;
		default:
			return false;
	}
	obj[data.id] = {...data};

	return true;
}

export function deleteData(table:"players", id:string) : boolean;
export function deleteData(table:"rooms", id:string) : boolean;
export function deleteData(table:"hosts", id:string) : boolean;
export function deleteData(table:"worlds", id:string) : boolean;

export function deleteData(table:"worlds", id:string) : boolean;

export function deleteData(table:string, id:string){
	let obj:IObject<IData>;
	switch(table){
		case "players":
			obj = players; break;
		case "rooms":
			obj = rooms; break;
		case "hosts":
			obj = hosts; break;
		case "worlds":
			obj = worlds; break;
		default:
			return false;
	}
	if(!obj[id]){
		return false;
	}
	delete obj[id];
	return true;
}

export function getData(table:"players", id:string) : IPlayerData | null;
export function getData(table:"rooms", id:string) : IRoomData | null;
export function getData(table:"hosts", id:string) : IHostData | null;
export function getData(table:"worlds", id:string) : IWorldData | null;

export function getData(table:string, id:string) : IData | null;

export function getData(table:string, id:string){
	let obj:IObject<IData>;
	switch(table){
		case "players":
			obj = players; break;
		case "rooms":
			obj = rooms; break;
		case "hosts":
			obj = hosts; break;
		case "worlds":
			obj = worlds; break;
		default:
			return null;
	}
	return obj[id];
}

export function findData(table:"players", q:any) : IPlayerData[];
export function findData(table:"rooms", q:any) : IRoomData[];
export function findData(table:"hosts", q:any) : IHostData[];
export function findData(table:"worlds", q:any) : IWorldData[];

export function findData<T=IData>(table:string, query:any) : T[];

export function findData<T=IData>(table:string, query:any){
	let obj:IObject<IData>;
	switch(table){
		case "players":
			obj = players; break;
		case "rooms":
			obj = rooms; break;
		case "hosts":
			obj = hosts; break;
		case "worlds":
			obj = worlds; break;
		default:
			return [];
	}

	let found = Object.values(obj).filter((val)=>{
		for(let key of Object.keys(query)){
			// console.log({key, val,qV: query[key], vV: val[key] })
			if(val[key] !== query[key]){
				return false;
			}
		}
		return true;
	});
	// console.log({found})

	return found as T[];
}