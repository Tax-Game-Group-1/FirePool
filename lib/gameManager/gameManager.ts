import _ from "lodash";
import { Socket } from "socket.io";
import { PlayerInWaitingRoom, PlayerRole, UniverseData, PlayerData, DeclarePlayer, DeclaredVsPaidUniverse, DeclarePlayerArray, PlayerChosenForAudit, AuditArray, WGame, WRounds, WPlayer } from "./interfaces";

/*
 GAME:
  | id | penalty | roundNumber | taxCoefficient | maxPlayers | auditProbability | kickPlayersOnBankruptcy |
 */

const MAX_WAIT_TIME = 15000;


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

  public hasBeenAudited: boolean;


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
    this.hasBeenAudited = false;
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
    this.penalty = penalty;

    this._roundNumber = roundNumber;
    this.kickPlayersOnBankruptcy = kickPlayersOnBankruptcy;

    this._host = {
      name: "host",
      socket: null,
      waitingId: "",
      ready: true,
      roomCode: "",
      timeStamp: Date.now(),
    };
  }

  public resetAudit() {
      this.hasBeenAudited = false;
  }
  // waiting area for players who have joined a game, but are not assigned to a universe yet
  public addPlayerToWaitingRoom(waitingPlayer: PlayerInWaitingRoom): void {
    console.log("adding player with waiting room: " + waitingPlayer.waitingId);
    if (this._playersInWaitingRoom.length >= this.maxPlayers)
      throw "waiting area full";

    this._playersInWaitingRoom.push(waitingPlayer);
  }

  public assignSocketToPlayerInWaitingRoom(waitingId: string, socket: Socket) {
    for (const p of this._playersInWaitingRoom) {
      if (p.waitingId == waitingId) {
        p.socket = socket;
        return;
      }
    }

    throw "could not find player";
  }

  public allHavePaid() {
    for (const u of this._universes) {
      if (!u.allCitizensHavePaidInUniverse())
        return false;
    }

    return true;
  }

  public getDeclaredVsPaidTaxForAllUniverses(): DeclaredVsPaidUniverse[] {
    let declareVsPaidGame : DeclaredVsPaidUniverse[]= [];
    for (const u of this._universes) {
        declareVsPaidGame.push(u.getIncomeVsDeclared())
    }
    return declareVsPaidGame;
  }

  resetAllHavePaid() {
    for (const u of this._universes) {
      u.resetHasPaidForAllCitizens()
    }
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
    console.log("could not find player [gameMamager.ts]")
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

  public finishRound() {
    for (const u of this._universes)
      u.finishRound();
  }

  public async assignNameToPlayerInWaitingRoom(waitingId: string, name: string): Promise<boolean> {
    // return await fetch("https://vfa5gkjsbxwhoxfsdiufnesm6a0bonck.lambda-url.us-east-1.on.aws/", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     content: name
    //   })
    // }).then(async result => {
    //   const res = await result.json();
    //   if (res.success) {

        for (const p of this._playersInWaitingRoom) {
          if (p.waitingId == waitingId) {
            // p.name = res.data.cleanName;
            p.name = name;
            return true;
          }
        }


    //   } else {
    //     throw "API call for clean name not successful"
    //   }

      //send a response here to say they could not finde name
    //   throw "could not find player";
    // }).catch(e => {
    //   console.log("error checking name")
    //   console.error(e)
      return false;
    // })

  }
  public async assignIconToPlayerInWaitingRoom(waitingId: string, icon: string): Promise<boolean> {
    for (const p of this._playersInWaitingRoom) {
          if (p.waitingId == waitingId) {
            // p.name = res.data.cleanName;
            p.icon = icon;
            return true;
          }
        }
      return false;

  }

  public emitMessageToPlayers(event, data) {
    console.log(`emitting [${event}] to players`);
    for (const p of this._playersInWaitingRoom) {
      if (p.socket != null) p.socket.emit(event, data);
    }

    for (const u of this._universes) {
      u.emitMessageToAllPlayersInUniverse(event, data); 
    }

    //notify host
    this._host.socket.emit(event, data);
  }

  public getPlayersInWaitingRoomAsJSON() {
    return this._playersInWaitingRoom.map((e) => {
      return {
        roomCode: e.roomCode,
        waitingId: e.waitingId,
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

  public resetReceieveSalary() {
		for(let universe of this._universes){
			let players = universe.getAllPlayers();
			for(let player of players){
				player.hasReceivedSalary = false;
			}
		}
	}

	public hasAllPlayerspaid
	() {
		for(let universe of this._universes){
			let players = universe.getAllPlayers();
			for(let player of players){
				if(!player.hasReceivedSalary){
					return false;
				}
			}
		}
		return true;
	}

  public numPlayersNotAssigned = () => this._playersInWaitingRoom.length;

  public playerConsent(id: number, hasConsented: boolean) {
    for (let u of this._universes) { 
      if (u.playerConsent(id, hasConsented))
        return ;
    }
    throw "Could not find player to consent"
  }

  public getAllUniversesAsJSON(): UniverseData[] {
    let universeData: UniverseData[] = [];

    this._universes.forEach(u => {
      universeData.push(u.getUniverseDataAsJSON());
    });

    return universeData;
  }

  private getRandomPlayerFromWaitingRoom() : PlayerInWaitingRoom | null {
    if (this._playersInWaitingRoom.length == 0)
      return null;

    let randInd = _.random(0, this._playersInWaitingRoom.length - 1);
    const player = this._playersInWaitingRoom[randInd];
    this._playersInWaitingRoom.splice(randInd, 1);
    return player;
  }

  public purgeNullPlayers(checkTimestamp: boolean) {
    for (let i = 0; i < this._playersInWaitingRoom.length; i++)
      if (this._playersInWaitingRoom[i].name == null)
        if (!checkTimestamp)
          this._playersInWaitingRoom.splice(i, 1);
        else {
          let currTime = Date.now();
          let timePassed = currTime - this._playersInWaitingRoom[i].timeStamp; 
          if (timePassed > MAX_WAIT_TIME)
            this._playersInWaitingRoom.splice(i, 1);
        }

  }

  public getDeclaredVsPaid() : DeclaredVsPaidUniverse[] {
    let result : DeclaredVsPaidUniverse[] = [];
    for (const u of this._universes)
      result.push(u.getIncomeVsDeclared())
    return result;
  }

  public addUniversesAndDividePlayers() : number {
    this.purgeNullPlayers(false);
    
    const numPlayers = this._playersInWaitingRoom.length;

    let numUniverses = Math.floor(5 * Math.log10(numPlayers + 4) - 3);
    if (numUniverses < 1)
      numUniverses = 1;

    const playersPerUniverse = Math.floor(this._playersInWaitingRoom.length / numUniverses);
    console.log("creating " + numUniverses + " universes with " + playersPerUniverse + " in each universe");
    let currPlayerId = 0; 

    for (let i = 0; i < numUniverses; i++) {
      const ministerWaiting = this.getRandomPlayerFromWaitingRoom()
      const minister = new Minister(ministerWaiting.name, currPlayerId++, ministerWaiting.socket, ministerWaiting.waitingId, PlayerRole.MINISTER, ministerWaiting.icon);
      this._universes.push(new Universe(minister, 0, i.toString(), this))
    }

    let player = this.getRandomPlayerFromWaitingRoom();
    let count = 0; 

    while (player != null) {
      const universe = this._universes[count++ % numUniverses];
      
      if (_.random(0, 1) == 0) 
         universe.addPlayer(new LocalWorker(player.name, currPlayerId++, player.socket, player.waitingId, PlayerRole.LOCAL_WORKER, player.icon))
      else  
        universe.addPlayer(new ForeignWorker(player.name, currPlayerId++, player.socket, player.waitingId, PlayerRole.FOREIGN_WORKER, player.icon))

      player = this.getRandomPlayerFromWaitingRoom();
    }

    console.log("ADDED " + currPlayerId + " PLAYERS (gameManager.ts)")
    return numUniverses;

  }
  // add univers from the database to the game
  public addUniverse(universe: Universe) {
    for (let u of this._universes)
      if (u.id == universe.id) throw "cannot add universe with duplicate ID";

    this._universes.push(universe);
    return universe.id;
  }

  public getUniverseById(id: string) {
    for (let u of this._universes)
      if (u.id == id) 
        return u;

    throw "cannot find universe with id " + id;

  }

  public citizenPayTax(playerId: number, declared: number, received: number, calculatedTax: number) {
	
	for (const universe of this._universes) {
		for(let player of universe.getAllPlayers()){
			if (player.id == playerId) {
				//citizen pays tax
				universe.citizenPayTax(playerId, declared, received, calculatedTax);
				break;
			}
		}
	}

	for(let universe of this._universes){
		if(!universe.hasPaid){
			return false;
		}
	}
	return true;

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
  public auditAllPlayers() : PlayerChosenForAudit[] {
    let playersChosenForAudit: PlayerChosenForAudit[] = []
    for (const universe of this._universes) {
      let newPlayers = universe.auditPlayers(this._auditProbability, this._penalty);
      playersChosenForAudit.concat(newPlayers);
    }
    return playersChosenForAudit;
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


  public getExcelData(adminId: number, email: string, adminName: string) : WGame {

    let players: WPlayer[] = [];
    let rounds: WRounds[] = [];
    for (const u of this._universes) {

      const [ p, r ] : [WPlayer[] , WRounds[]] = u.getPlayerActionsForWorkbook();

      players = players.concat(p);
      rounds = rounds.concat(r);

    }

    return {
      admin: {
        adminId: adminId, 
        email: email,
        name: adminName
      },
      game: {
        finePercent: this.penalty,
        auditProbability: this.auditProbability,
        kickPlayersOnBankruptcy: this.kickPlayersOnBankruptcy,
        maxPlayers: this.maxPlayers,
        taxCoefficient: this.taxCoefficient,
        rounds: rounds, 
        players: players
      }
    }
  }
}


/*
 UNIVERSE:
 | id | gameID | ministerID | taxRate |
 */

export class Universe {
  getAllPlayers() {
    return this._players;
  }
 
  public readonly minister: Minister;
  public  taxRate: number;
  private _players: Citizen[];
  private _id: string;
  private _cumulativeFundsPerRound: number[];
  private _game: Game;
  private _universeFunds: number = 0;
  public hasPaid:boolean = false;

  constructor(minister: Minister, taxRate: number, id: string, game: Game) {
    this.minister = minister;
    if (taxRate < 0 || taxRate > 1) throw "invalid tax rate";
    this.taxRate = taxRate;
    this._id = id;
    this._players = [];
    this._cumulativeFundsPerRound = [];
    this._game = game;
  }

  public get game() {
    return this._game;
  }

  getRandomPlayer(): Citizen {
    if (this._players.length === 0) {
      throw new Error("No players in the universe.");
    }

    const randomIndex = Math.floor(Math.random() * this._players.length);
    return this._players[randomIndex];
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
  public auditPlayers(auditProbability: number, finePercent: number): PlayerChosenForAudit[] {
    let playersChosenForAudit: PlayerChosenForAudit[] = [];
    for (const c of this._players) {
      const random = Math.random();
      if (random <= auditProbability) {
        c.audit(finePercent, true);  
        playersChosenForAudit.push({
          id: c.id,
          newFunds: c.funds
        })
      } else {
        c.audit(0, false);
      }
    }
    return playersChosenForAudit;
  }


  public finishRound() {

    //total up all the funds of all the players and store in cumulativ funds
    let totalFunds : number = 0; 

    for (const player of this._players) {
      totalFunds += player.funds;
    }

    this._cumulativeFundsPerRound.push(totalFunds);

  }

  public getCumulativeFundsPerRound() {
    return this._cumulativeFundsPerRound;
  }


  public paySalaryByPlayerId(playerId: number, salary: number){
	let roundNumber = this.game.roundNumber;
	let allHavePaid = true;
	for(let player of this._players){
		if(player.id == playerId){
			player.receiveFunds(salary);
		}
		if(!player.hasReceivedSalary){
			allHavePaid = false;
		}	
	}

	return allHavePaid;

  }
  
  //why vs code no spellcheck?????
  public getPlayerActionsForWorkbook() : [WPlayer[], WRounds[]] {

    const myUniverse = this;


    function getPlayerActions() : WPlayer[]{
      const playerActions: WPlayer[] = [];

      
      //loop through all citizens
      for (const p of myUniverse._players) {

        const playerFineAmount = [];
        const playerIsAudited = [];
        const playerIncome = [];
        const playerDeclaredIncome = [];
        const perRoundFunds = [];
        const setTaxRate = [];
        const playerTaxReturns = []; //how much the players got from redistibution per round (0 if minister)
        const redistributedTax = []; //how much ministers redistribute to players per round (0 if citizen)


        console.log("INCOME VS DECLARED")
        console.log(p.getIncomeVsDeclaredArray().length)
        console.log("auditedArray")
        console.log(p.auditedArray.length)

        for (let i = 0; i < p.getIncomeVsDeclaredArray().length; i++) {
          playerIncome.push(p.getIncomeVsDeclaredArray()[i].incomeReceived);
          playerDeclaredIncome.push(p.getIncomeVsDeclaredArray()[i].declared);
          playerFineAmount.push(p.auditedArray[i].fineAmount);
          playerIsAudited.push(p.auditedArray[i].isAudited);
          playerTaxReturns.push(p.getIncomeVsDeclaredArray()[i].incomeReceived);
          perRoundFunds.push(p.getIncomeVsDeclaredArray()[i].funds);

          //for ministers
          setTaxRate.push(0);
          redistributedTax.push(0);
        }

        const workbookPlayer: WPlayer = {
          name: p.name,
          id: p.id,
          funds: perRoundFunds,
          playerFineAmount: playerFineAmount,
          playerDeclaredIncome: playerDeclaredIncome,
          playerIncome: playerIncome,
          playerTaxReturns: playerTaxReturns,
          playerIsAudited: playerIsAudited,
          redistributedTax: redistributedTax,
          setTaxRate: setTaxRate
        };

        playerActions.push(workbookPlayer);
      }

      const playerFineAmount = [];
      const playerIsAudited = [];
      const playerIncome = [];
      const playerDeclaredIncome = [];
      const perRoundFunds = [];
      const setTaxRate = [];
      const playerTaxReturns = []; //how much the players got from redistibution per round (0 if minister)
      const redistributedTax = []; //how much ministers redistribute to players per round (0 if citizen)

      const minister: Minister = myUniverse.minister;

      for (let i = 0; i < minister.redistributedTax.length; i++) {
        playerIncome.push(0);
        perRoundFunds.push(minister.fundsPerRound[i]);
        redistributedTax.push(minister.redistributedTax[i]);
        setTaxRate.push(minister.previouslySetTaxRates[i]);
        playerFineAmount.push(0);
        playerIsAudited.push(0);
        playerDeclaredIncome.push(0);
        playerTaxReturns.push(0);
      }


      return playerActions;
    }

    function getRounds() : WRounds[] {
      const roundsArray : WRounds[] = [];
      const numRounds = myUniverse.getCumulativeFundsPerRound().length;
      let primaryKey: number = 0; 

      for (let i = 0; i < numRounds; i++) {
          roundsArray.push({
              id: primaryKey++,
              universeID: myUniverse.id,
              universeMoneyPool: myUniverse.getCumulativeFundsPerRound()[i]
          }); 
      }

      return roundsArray;
    }

    return [
      getPlayerActions(),
      getRounds()
    ]

  }

  getIncomeVsDeclared(): DeclaredVsPaidUniverse {
    let result: DeclarePlayer[] = [];
    for (const p of this._players)
          result.push({
        delcared: p.getIncomeVsDeclaredArray(),
        id: p.id
      })
    return {
      universeId: this._id,
      declaredVsPaidPlayers: result
    }
  }

  allCitizensHavePaidInUniverse() {
    for (const c of this._players)
      if (c.hasPaid == false)
        return false;

    return true;
  }

  resetHasPaidForAllCitizens() {
    for (const c of this._players)
      c.hasPaid = false;
  }


  emitMessageToAllPlayersInUniverse(event: any, data: any) {
    // console.log("emmitting message to players in universe" + this._id);
    for (const p of this._players) {
      // console.log("emitting to player in universe: " + p.name);
      if (p.client != null) 
        p.client.emit(event, data);
      else 
        console.log("ERROR: PLAYER SOCKET IS NULL");
    }
    // console.log("emitting to minister: " + this.minister.name);
    this.minister.client.emit(event, data);
  }

  public playerConsent(id: number, hasConsented: boolean) : boolean {
    //check minister
    if (this.minister.id == id) {
      this.minister.hasConsented = hasConsented;
      return true;
    }

    for (let p of this._players) {
      if (p.id == id) {
        p.hasConsented = hasConsented;
        return true;
      }
    }

    return false;
  }

  //get the universe id
  public get id() {
    return this._id;
  }

  //give players tax by dividing the total amount given by the minister
  public divideTaxAmongPlayers(percentage: number) {
    if (this._players.length == 0)  {
      throw "minister loses";
      return ;
    }

    if (percentage < 0 || percentage > 1){
		if(percentage >= 0 && percentage <= 100){
			percentage /= 100;
		}else{
			console.log({percentage})
			throw "invalid percentage for redistribution, must be between 0 and 1"
		}

	}

    const toGiveBack = this._universeFunds * percentage;
    const eachPlayerReceives = toGiveBack / this._players.length;
    this.minister.payFunds(toGiveBack);

    console.log("each player receives (GameManager.divideTaxAmongPlayers)")
    console.log(eachPlayerReceives);

    for (let player of this._players) {
        player.recieveTaxReturns(eachPlayerReceives);
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

  public getUniverseDataAsJSON(): UniverseData {
    let playerData: PlayerData[] = [];

    for (const p of this._players) {
      playerData.push(p.toJSON());
    }

    return {
      id: this._id,
      minister: this.minister.toJSON(),
      taxRate: this.taxRate,
      players: playerData,
	  funds: this._universeFunds,
    }

  }

  public citizenPayTax(playerId: number, declared: number, received: number, calculatedTax: number) {
   let hasPaid = false;
	for (const citizen of this._players) {
      if (citizen.id == playerId) {
        //citizen pays tax
        const taxPaid = citizen.payTaxAndReceive(received, declared, calculatedTax);
		console.log("Tax paid:")
		console.log({taxPaid})
        //add funds to the universe money pool
        this._universeFunds += taxPaid; 
       hasPaid = true;
      }
    }
	if(!hasPaid){
		throw "could not find player to pay tax"
	}

	for(let citizen of this._players){
		if(!citizen.hasPaid){
			this.hasPaid = false;
			return;
		}
	}
	this.hasPaid = true;
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
  private _role: PlayerRole;
  private _hasConsented: boolean;
  public hasReceivedSalary: boolean;
  public icon:string;

  constructor(id: number, name: string, client: Socket, waitingId: string, role: PlayerRole, icon:string,) {
    this._id = id;
    this._name = name;
    this.client = client;
    this._funds = 0;
    this._waitingId = waitingId;
    this._role = role;
    this._role = role;
    this._hasConsented = false;
    this._hasBeenKicked = false;
	this.hasReceivedSalary = false;
  }


  public set hasConsented(value: boolean) {
    this._hasConsented = value;
  }

  public get hasConsented() {
    return this._hasBeenKicked;
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
	this.hasReceivedSalary = true;
  }

  public get funds() {
    return this._funds;
  }

  protected setFunds(newFunds: number) {
    this._funds = newFunds;
  }

  public payFunds(toPay: number) {
    this._funds -= toPay;
    if (this._funds < 0)
      this._funds = 0;
  }

  //todo: test
  public kickPlayer() {
    this._hasBeenKicked = true;
  }

  public get hasBeenKicked() {
    return this._hasBeenKicked;
  }

  public abstract toJSON(): PlayerData;

  protected getJSON(role: PlayerRole): PlayerData {
    return {
      role: role,
      id: this._id,
      name: this._name,
      icon: this.icon,
      funds: this._funds,
      hasBeenKicked: this._hasBeenKicked,
      waitingId: this._waitingId,
      socketId: this.client.id,
      hasConsented: this._hasConsented
    };
  }
}

export class Minister extends Player {
  private _setTaxRates: number[];
  private _redistributedTax: number[];
  private _fundsPerRound: number[];

  constructor(name: string, id: number, client: Socket, waitingId: string, role: PlayerRole, icon) {
    super(id, name, client, waitingId, role, icon);
    this._setTaxRates = [];
    this._redistributedTax = [];
    this._fundsPerRound = [];
  }

  public setTaxRates(game: Game, newTaxRate: number, universe: Universe) {
   	universe.taxRate = newTaxRate;
    this._setTaxRates.push(newTaxRate);
  }

  public get previouslySetTaxRates() {
    return this._setTaxRates;
  }

  public get redistributedTax() {
    return this._redistributedTax;
  }

  public get fundsPerRound() {
    return this._fundsPerRound;
  }

  public redistribute(universe: Universe, toRedistribute: number, totalIncome: number) {
    universe.divideTaxAmongPlayers(toRedistribute);
    this._redistributedTax.push(toRedistribute);
    const toAddOrSubtract = totalIncome - toRedistribute;
    this.setFunds(this.funds + toAddOrSubtract);
    this._fundsPerRound.push(this.funds);
  }

  toJSON() {
    return super.getJSON(PlayerRole.MINISTER);
  }
}


export abstract class Citizen extends Player {
  //player
  private declaredArray: DeclarePlayerArray[];
  private _hasPaid : boolean;
  public auditedArray: AuditArray[]
  private _taxReturns: number[];

  constructor(name: string, id: number, client: Socket, waitingId: string, playerRole: PlayerRole, icon) {
    super(id, name, client, waitingId, playerRole, icon);
    this.declaredArray = [];
    this._hasPaid = false;
    this.auditedArray = [];
    this._taxReturns = [];
  }

  public getIncomeVsDeclaredArray(): DeclarePlayerArray[] {
      return this.declaredArray
  }

  public set hasPaid(value: boolean) {
    this._hasPaid = value;
  }

  public get hasPaid() {
    return this._hasPaid;
  }

  public recieveTaxReturns(amount: number) {
    this._taxReturns.push(amount);
    this.receiveFunds(amount)
  }

  public payTaxAndReceive(
    received: number,
    declared: number,
    calculatedTax: number,
  ) {
    this.declaredArray.push({
      incomeReceived: received,
      declared: declared,
      calculatedTax: calculatedTax,
	  funds: this.funds,
    });
    

    this.hasPaid = true;
    this.receiveFunds(received - calculatedTax);
    return calculatedTax;
  }

  public audit(finePercent, isAudited) {

    if (!isAudited) {

      this.auditedArray.push({
        fineAmount: 0, 
        isAudited: false
      })

      return ;
    }


    //loop through the declared array
    //check that declared is the same as received
    //if there is a discrepency, fix it (set declared = recievd) && set a flag to fine player
    //if flag is true: funds -= funds * finepercent
    //get penalty from game ojbect

    console.log("auditing player " + this.id);

    let fineDifference = 0;
    for (let d of this.declaredArray) {
      //player has lied, fine the player
      if (d.declared < d.incomeReceived) {
        //add the difference if they have lied
        fineDifference += d.incomeReceived - d.declared;
        d.declared = d.incomeReceived;
      }

    }

    const auditAmount = fineDifference * finePercent; 

    this.auditedArray.push({
      fineAmount: auditAmount, 
      isAudited: true
    })

    this.payFunds(auditAmount);
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