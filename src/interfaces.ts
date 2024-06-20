export const imageAPI = "https://api.dicebear.com/9.x/";

export interface IObject<T=any> {
	[key:string] : T,
}

export interface ISync {
	id: string,
	time: number,
}

export enum Role {
	None = "No Role",
	A = "Minister",
	B = "LocalCitizen",
	C = "ForeignCitizen"
}

export interface IRequestResult<T=any> {
	success: boolean,
	message: string,
	data: T,
	sync?: ISync,
}

export enum GameState {
	Waiting,
	Starting,
	RolePicking,
	UniverseSetup,
	YearStart,
	TaxRateSet, SalarySet,
	TaxDeclare,
	Audit,
	Redistribution,
	YearEnd,
	Migration,
	Processing,
}

export interface IData {
	id: string;
	name:string;
}
export interface IPlayerData extends IData {
    id:string;
    name:string;
    role:Role;
    funds:number;
    incomeFunds:number;
    declaredFunds:number;
    isReady: boolean;
    icon: string; //iconURL
	worldID: string; //worldID
}
export interface IHostData extends IData  {
	id:string;
	key:string;
	name:string;
	password?:string;
	games: string[]; //gameIDs
}

export interface IWorldData extends IData  {
    id: string;
    name: string;
    ownerID: string;	//player ID
    citizens: string[] //player ID
    taxRate:number;
    taxFunds:number;
}

export interface IRoomData extends IData  {
	id:string; //gameID
	name:string;
	year: number;
	host: string;	//hostID
	players: string[]; //playerID
	worlds: string[]; //worldID
	taxCoeff: number;
	maxNumberOfPlayers:number;
	penalty:number;
	kickPlayersOnBankruptcy:boolean;
	auditProbability:number;
	gameState?: GameState;
	icon?: string;
}

export interface IWorldRound {
	id: string,
	worldID: string,
	funds: number,
	distributedFunds: number,
	taxRate: number,
	year: number,
}

export interface IPlayerRound {
	id: string,
	playerID: string,
	income: number,
	isFined: boolean,
	isAudited: boolean,
	funds: number,
	declaredTax: number,
	actualTax: number,
}