
import { IData, IHostData, imageAPI, IObject, IPlayerData, IRoomData, IWorldData, Role } from "@/interfaces";

const hosts:IObject<IHostData> = {
	"1234abcd": {
		id: "1234abcd",
		key: "1234abcd",
		name: "Dr. Fax Tax",
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
		ready: false,
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
		ready: true,
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
		ready: false,
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
		ready: true,
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
		ready: false,
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
		penalty: 0.3,
		kickPlayersOnBackruptcy: true,
		auditProbability: 0.1,
	},
	"1234ABCD" : {
		id: "1234ABCD",
		name: "Game 2",
		year: 1,
		host:  "1234abcd",
		players: [
			// "1234abcd",
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
		penalty: 0.3,
		kickPlayersOnBackruptcy: true,
		auditProbability: 0.2,
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
			if(val[key] !== query[key]){
				return false;
			}
		}
		return true;
	});

	return found as T[];
}