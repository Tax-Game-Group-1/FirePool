import { Socket } from "socket.io";

export interface UniverseData {
  id: string;
  minister: PlayerData;
  taxRate: number;
  players: PlayerData[];
}

export interface PlayerInWaitingRoom {
  waitingId: string;
  roomCode: string;
  name: string;
  ready: boolean;
  socket: Socket | null;
  timeStamp: number;
}

export enum PlayerRole {
  MINISTER,
  LOCAL_WORKER,
  FOREIGN_WORKER,
}

export interface PlayerData {
  id: number;
  name: string;
  waitingId: string;
  socketId: any;
  funds: number;
  hasBeenKicked: boolean;
  role: PlayerRole;
  hasConsented: boolean;
}

//delcared vs paid 

export interface declarePlayerArray {
  incomeReceived: number;
  declared: number;
  calculatedTax: number;
}

export interface declarePlayer {
  id: number, 
  delcared: declarePlayerArray[]
}

export interface declaredVsPaidUniverse {
  universeId: string, 
  declaredVsPaidPlayers: declarePlayer[]
}