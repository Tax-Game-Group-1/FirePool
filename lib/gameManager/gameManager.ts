import _ from "lodash";
import { Socket } from "socket.io";
import { PlayerInWaitingRoom, PlayerRole, UniverseData, PlayerData, declareVsPaidTax } from "./interfaces";

/*
 GAME:
  | id | penalty | roundNumber | taxCoefficient | maxPlayers | auditProbability | kickPlayersOnBankruptcy |
 */



export class Game {
  //manage the game id
  private _id: string;

  //name that displays on the frontend
  private _name: string;

  //how much gets deducted if the players get caught
  //penalty from 10% to 100%
  private _penalty: number;

  //the current round, up to a fixed number
  private _roundNumber: number;
  //how much the tax is multiplied by before giving back to the minister
  private _taxCoefficient: number;
  //max players in the game
  private _maxPlayers: number;
  //chances of players getting audited for tax fraud
  private _auditProbability: number;
  //should players be kicked from the game if their funds are 0?
  public kickPlayersOnBankruptcy: boolean;
  //array of either citizens or ministers
  private _playersInWaitingRoom: PlayerInWaitingRoom[];
  //universes which players can switch to if they are not a slave
  private _universes: Universe[];

  private _host: PlayerInWaitingRoom;

  public gameCode: string;

  constructor(
    id: string,
    name: string,
    taxCoefficient: number,
    maxPlayers: number,
    penalty: number,
    roundNumber: number,
    auditProbability: number,
    kickPlayersOnBankruptcy: boolean
  ) {
    this.setValues(
      id,
      name,
      taxCoefficient,
      maxPlayers,
      penalty,
      roundNumber,
      auditProbability,
      kickPlayersOnBankruptcy
    );
    this._playersInWaitingRoom = [];
    this._universes = [];
  }

  /*
        copy constructor for when user modifies the settings of the universe in the fronted
    */
  public setValues(
    id: string,
    name: string,
    taxCoefficient: number,
    maxPlayers: number,
    penalty: number,
    roundNumber: number,
    auditProbability: number,
    kickPlayersOnBankruptcy: boolean
  ) {
    this._id = id;
    this.taxCoefficient = taxCoefficient;
    this.maxPlayers = maxPlayers;
    this.auditProbability = auditProbability;
    this.name = name;

    this._roundNumber = roundNumber;
    this.kickPlayersOnBankruptcy = kickPlayersOnBankruptcy;

    this._host = {
      name: "host",
      socket: null,
      waitingId: "",
      ready: true,
      roomCode: "",
    };
  }

  // waiting area for players who have joined a game, but are not assigned to a universe yet
  public addPlayerToWaitingRoom(waitingPlayer: PlayerInWaitingRoom): void {
    if (this._playersInWaitingRoom.length >= this.maxPlayers)
      throw "waiting area full";
    this._playersInWaitingRoom.push(waitingPlayer);
  }

  //assign socket to player in waiting room
  //player joins with a post request, and doesn't have a socket yet
  // getGameInstanceByGameCode(req.body.gameCode).addPlayerToWaitingArea({
  // 		name: null,
  // 		socket: null,
  // 		roomCode: req.body.gameCode,
  // 		waitingId: req.body.waitingId
  // 	})

  public assignSocketToPlayerInWaitingRoom(waitingId: string, socket: Socket) {
    for (const p of this._playersInWaitingRoom) {
      if (p.waitingId == waitingId) {
        p.socket = socket;
        return;
      }
    }

    throw "could not find player";
  }


  public removePlayerWithSocket(socketId: string): boolean {
    for (let i = 0; i < this._playersInWaitingRoom.length; i++) {
      const p = this._playersInWaitingRoom[i];
      if (p.socket.id == socketId) {
        this._playersInWaitingRoom.splice(i, 1);
        console.log("found player to remove by socket")
        return true;
      }
    }
    console.log("could not find player")
    return false;
  }

  public updateReadyState(waitingId: any, ready: any) {
    for (const p of this._playersInWaitingRoom) {
      if (p.waitingId == waitingId) {
        p.ready = ready;
        return;
      }
    }

    throw "could not find player";
  }

  public assignSocketToHost(socket: Socket) {
    this._host.socket = socket;
  }

  public assignHostData(host: PlayerInWaitingRoom) {
    this._host = host;
  }
  public getHostData() {
    return this._host;
  }

  public assignNameToPlayerInWaitingRoom(waitingId: string, name: string) {
    console.log("assigning name to player in game manager...");

    console.log("checking for profanity");

    fetch("https://vfa5gkjsbxwhoxfsdiufnesm6a0bonck.lambda-url.us-east-1.on.aws/", {
      method: "POST", 
      body: JSON.stringify({
        content: name
      })
    }).then(result => {

      for (const p of this._playersInWaitingRoom) {
        if (p.waitingId == waitingId) {
          p.name = name;
          return;
        }
      }

    throw "could not find player";
    })

  }

  public emitMessageToPlayerInRoom(event, data) {
    console.log("emitting message to other players to notify them");
    console.log("player count: ");
    console.log(this._playersInWaitingRoom.length);

    for (const p of this._playersInWaitingRoom) {
      if (p.socket != null) p.socket.emit(event, data);
    }

    console.log("emitting message to host");
    //notify host
    this._host.socket.emit(event, data);
    console.log("done emitting message to host");
  }

  public getPlayersInWaitingRoomAsJSON() {
    return this._playersInWaitingRoom.map((e) => {
      return {
        name: e.name,
        ready: e.ready,
      };
    });
  }

  public set name(newValue: string) {
    if (newValue == "") throw "new value can't be null";
    this._name = newValue;
  }
  public get name() {
    return this._name;
  }

  public numPlayersNotAssigned = () => this._playersInWaitingRoom.length;

  // take a plyer from the waiting are and put it in a universe object, universes are managed by players
  public assignPlayerToUniverse(
    playerId: number,
    waitingId: string,
    playerName: string,
    universeId: string,
    isLocalWorker: boolean,
    socket: Socket
  ) {
    //find universe
    let myUniverse: Universe = null;
    for (let u of this._universes) if (u.id == universeId) myUniverse = u;

    if (myUniverse == null) throw "cannot find universe";

    //find the player and splice it (remove it from the lobby)
    //then add it to the universe

    for (let i = 0; i < this._playersInWaitingRoom.length; i++)
      if (this._playersInWaitingRoom[i].waitingId == waitingId) {
        const tempPlayer = this._playersInWaitingRoom[i];
        this._playersInWaitingRoom.splice(i, 1);

        if (isLocalWorker)
          myUniverse.addPlayer(new LocalWorker(playerName, playerId, socket, waitingId, PlayerRole.LOCAL_WORKER));
        else
          myUniverse.addPlayer(new ForeignWorker(playerName, playerId, socket, waitingId, PlayerRole.FOREIGN_WORKER));

        return;
      }

    throw "unable to find player, player not added";
  }


  public getAllUniverses() : UniverseData[] {
    let universeData: UniverseData[];

    this._universes.forEach(u => {
      universeData.push(u.getUniverseData());
    });

    return universeData;
  }

  private getRandomPlayerFromWaitingRoom() {
        if (this._playersInWaitingRoom.length == 0)
            throw "can't get random player from empty waiting room";

        let randInd = _.random(0, this._playersInWaitingRoom.length);
        const player = this._playersInWaitingRoom[randInd];
        this._playersInWaitingRoom.splice(randInd, 1);
        return player;
  }

  public addUniversesAndDividePlayers() {
    const numPlayers = this._playersInWaitingRoom.length;

    let numUniverses = Math.floor(5  * Math.log(numPlayers + 4) - 3);
        if (numUniverses < 2)
            numUniverses = 2;

    const playersPerUniverse = Math.floor(this._playersInWaitingRoom.length / numUniverses);

    console.log("creating " + numUniverses + " universes with " + playersPerUniverse + " in each universe");
    let currentPlayerCount = 0; 
    let totalPlayerCount = 0; 
	  for (let i = 0; i < numUniverses; i++) {
        //get the minister and assign
        const ministerWaiting = this.getRandomPlayerFromWaitingRoom();
        currentPlayerCount++;
        totalPlayerCount++;

        //create a minister and a universe
        const minister = new Minister(ministerWaiting.name, totalPlayerCount++, ministerWaiting.socket, ministerWaiting.waitingId, PlayerRole.MINISTER); 
        this._universes.push(new Universe(minister, 0.5, i.toString()))


        //assign the players until the correct count is reached
        while (currentPlayerCount < playersPerUniverse) {
            const randomPlayer = this.getRandomPlayerFromWaitingRoom();
            const isLocalWorker = _.random(0, 1) == 0;
            this.assignPlayerToUniverse(totalPlayerCount++, randomPlayer.waitingId, randomPlayer.name, i.toString(), isLocalWorker, randomPlayer.socket);
        }

        currentPlayerCount = 0; 
      }
  }
  // add univers from the database to the game
  public addUniverse(universe: Universe) {
    for (let u of this._universes)
      if (u.id == universe.id) throw "cannot add universe with duplicate ID";

    this._universes.push(universe);
    return universe.id;
  }

  //get the id of the game
  public get id(): string {
    return this._id;
  }

  //get the penalty of the game (used in fining players)
  public get penalty(): number {
    return this._penalty;
  }
  public set penalty(value: number) {
    if (value < 0 || value > 1)
      throw "invalid penalty, must be from 0% to 100%";
    this._penalty = value;
  }

  //round number is how many rounds have passed, starts at 0
  public set roundNumber(value: number) {
    if (value < 0) throw "Cannot set round number less than 0";
    this._roundNumber = value;
  }

  public get roundNumber(): number {
    return this._roundNumber;
  }

  // go to the next round
  public incrementRoundNumber(): void {
    this._roundNumber++;
  }

  public get taxCoefficient(): number {
    return this._taxCoefficient;
  }

  public set taxCoefficient(value: number) {
    //todo: check this
    if (value < 1 || value > 2) throw "tax coefficient must be between 1 and 2";
    this._taxCoefficient = value;
  }

  public get maxPlayers(): number {
    return this._maxPlayers;
  }

  public set maxPlayers(value: number) {
    if (value < 6) throw "too few max players";
    this._maxPlayers = value;
  }

  public get auditProbability(): number {
    return this._auditProbability;
  }

  //set the probability that a player gets audited
  public set auditProbability(value: number) {
    if (value < 0 || value > 100) throw "invalid audit probablity";
    this._auditProbability = value;
  }

  //todo: add a function to audit players
  //loop through all the players
  //make a random number between 0 and 100
  //if it's lower than audit probability, then audit the player
  //fine the player the fine percent
  //increase the audit count on the player
  public auditAllPlayers() {
    for (const universe of this._universes)
      universe.auditPlayers(this._auditProbability, this._penalty);

    throw "unimplementded";
  }

  public toString() {
    let str = "";
    str += "------------PLAYERS--------------\n";
    for (let player in this._playersInWaitingRoom) {
      str += player.toString();
      str += "\n";
    }
    str += "---------------------------------\n";
    return str;
  }

  //get univers by id
  getUniverse(id: string) {
    for (let u of this._universes) if (u.id == id) return u;
    throw "Cannot find universe";
  }
}


/*
 UNIVERSE:
 | id | gameID | ministerID | taxRate |
 */


export class Universe {
  public readonly minister: Minister;
  public readonly taxRate: number;
  private _players: Citizen[];
  private _id;

  constructor(minister: Minister, taxRate: number, id: string) {
    this.minister = minister;
    if (taxRate < 0 || taxRate > 1) throw "invalid tax rate";
    this.taxRate = taxRate;
    this._id = id;
    this._players = [];
  }

  //add player to a universe, check that you can't add duplicates
  public addPlayer(player: Citizen) {
    for (let p of this._players)
      if (p.id == player.id) throw "cannot add duplicate player";

    this._players.push(player);
  }
  //run through the players
  //roll a dice weigthed by audit probability
  //audit players if they are unluckly
  auditPlayers(auditProbability: number, finePercent: number) {
    for (const c of this._players) {
      const random = Math.random();
      if (random <= auditProbability) c.audit(finePercent);
    }
  }

  //get the universe id
  public get id() {
    return this._id;
  }

  //give players tax by dividing the total amount given by the minister
  public divideTaxAmongPlayers(toDivide: number) {
    if (this._players.length == 0) throw "no players in the game yet";

    let eachPlayerReceives = toDivide / this._players.length;

    console.log(eachPlayerReceives);

    for (let player of this._players) {
      player.receiveFunds(eachPlayerReceives);
    }
  }

  //todo: test
  public removePlayer(player: Player): void;
  public removePlayer(id: string): void;

  public removePlayer(a: any) {
    let index = 0;
    for (let cit of this._players) {
      if (typeof a == "number")
        if (cit.id == a) {
          this._players.splice(index, 1);
          return;
        }

      if (typeof a == typeof Player)
        if (cit.id == a.id) {
          this._players.splice(index, 1);
          return;
        }
      index++;
    }
  }

  public getUniverseData() : UniverseData {
    let playerData: PlayerData[] = [];

    for (const p of this._players) {
      playerData.push(p.toJSON());
    }

    return {
      id: this._id,
      minister: this.minister.toJSON(),
      taxRate: this.taxRate, 
      players: playerData
    }

  }

}

/*
 PLAYER
 | id | universeID (null if not defined) | name | type (minster | localWorker | foreignWorker) | currentFunds | hasBeenKicked |
 */





export abstract class Player {
  private _name: string;
  private _id: number;
  private _waitingId: string; 
  client: Socket;
  private _funds;
  private _hasBeenKicked;
  private _role;

  constructor(id: number, name: string, client: Socket, waitingId: string, role: PlayerRole) {
    this._id = id;
    this._name = name;
    this.client = client;
    this._funds = 0;
    this._waitingId = waitingId;
    this._role = role;
  }

  public get name() {
    return this._name;
  }

  public get id() {
    return this._id;
  }

  public get waitingId() {
    return this._waitingId;
  }

  public receiveFunds(toReceive: number) {
    this._funds += toReceive;
  }

  public get funds() {
    return this._funds;
  }

  public payFunds(toPay: number) {
    this._funds -= toPay;
    if (this._funds < 0) throw "Player is bankrupt";
  }

  //todo: test
  public kickPlayer() {
    this._hasBeenKicked = true;
  }

  public get hasBeenKicked() {
    return this._hasBeenKicked;
  }

  public abstract toJSON() : PlayerData;

  protected getJSON(role: PlayerRole) : PlayerData {
    return {
      role: role,
      id: this._id,
      name: this._name,
      funds: this._funds,
      hasBeenKicked: this._hasBeenKicked,
      waitingId: this._waitingId,
      socketId: this.client.id
    };
  }
}

export class Minister extends Player {
  constructor(name: string, id: number, client: Socket, waitingId: string, role: PlayerRole) {
    super(id, name, client, waitingId, role);
  }

  public setTaxRate(game: Game, newTaxRate: number) {
    game.taxCoefficient = newTaxRate;
  }

  public redistribute(universe: Universe, toDivide: number) {
    universe.divideTaxAmongPlayers(toDivide);
  }

  toJSON() {
    return super.getJSON(PlayerRole.MINISTER);
  }
}



export abstract class Citizen extends Player {
  //player
  private declaredArray: declareVsPaidTax[];

  constructor(name: string, id: number, client: Socket, waitingId: string, playerRole: PlayerRole) {
    super(id, name, client, waitingId, playerRole);
    this.declaredArray = Array();
  }

  //todo: continue with this
  //subtract from funds to pay the tax
  public payTaxAndRevieve(
    received: number,
    declared: number,
    calculatedTax: number
  ) {
    this.declaredArray.push({
      incomeReceived: received,
      declared: declared,
      calculatedTax: calculatedTax,
    });

    this.receiveFunds(received - calculatedTax);
  }

  public audit(finePercent) {
    //loop through the declared array
    //check that declared is the same as recieved
    //if there is a discrepency, fix it (set declared = recievd) && set a flag to fine player
    //if flag is true: funds -= funds * finepercent
    //get penalty from game ojbect

    let fineDifference = 0;
    for (let d of this.declaredArray) {
      //player has lied, fine the player
      if (d.declared < d.incomeReceived) {
        //add the difference if they have lied
        fineDifference += d.incomeReceived - d.declared;
        d.declared = d.incomeReceived;
      }
    }
    this.payFunds(fineDifference + fineDifference * finePercent);
  }
}

export class LocalWorker extends Citizen {
  toJSON() {
    return super.getJSON(PlayerRole.LOCAL_WORKER);
  }
}

export class ForeignWorker extends Citizen {
  public switchUniverse(oldUniverse: Universe, newUniverse: Universe) {
    oldUniverse.removePlayer(this);
    newUniverse.addPlayer(this);
  }

  toJSON() {
    return super.getJSON(PlayerRole.FOREIGN_WORKER);
  }
}