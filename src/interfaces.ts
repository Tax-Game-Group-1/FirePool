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

export interface IPlayerData {
    playerId:number;
    gameId:number;
    playerName:string;
    role?:Role;
    funds?:number;
    incomeFunds?:number;
    declaredFunds?:number;
    isReady?: boolean;
    icon?: string; //iconURL
	worldID?: string; //worldID
}
export interface IHostData  {
	id: number;
	name:string;
	email:string;
	password?:string;
}

export interface IUniverseData  {
    universeId: number;
	gameId: number,
    universeName: string;
    ministerId: number;	//player ID
}

export interface IGameData  {
	gameId:number; //gameID
	gameCode?:string; //gameCode
	adminId: number;	//hostID
	name:string;
	roundNumber?: number;
	taxCoefficient: number;
	auditProbability:number;
	maxPlayers:number;
	finePercent:number;
	kickPlayersOnBankruptcy:boolean;
	gameState?: GameState;
	icon?: string;
}

export interface IUniverseRound {
	roundId: number,
	universeId: string,
	taxRate: number,
	moneyPool: number,
	distributedFTaxReturns: number,
}

export interface IPlayerRound {
	roundId: number,
	universeId: number,
	playerId: number,
	income: number,
	isAudited: boolean,
	isFined: boolean,
	declaredIncome: number,
	totalAssets: number,
}