import { Socket } from "socket.io-client";

class Game {
    private _id: string;
    private _penalty: number;
    private _roundNumber: number;
    private _taxCoefficient: number; 
    private _maxPlayers: number; 
    private _auditProbability: number; 
    public kickPlayersOnBankruptcy: boolean;
    private _players: Player[];
    private _universes: Universe[];

    constructor(id: string, taxCoeficient: number, maxPlayers: number, penalty: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) {
        this._id = id;
        this.setValues(id, taxCoeficient, maxPlayers, penalty, roundNumber, auditProbability, kickPlayersOnBankruptcy);
    }

    public setValues(id: string, taxCoeficient: number, maxPlayers: number, penalty: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) {
        this._id = id;
        this._penalty = penalty;
        this._taxCoefficient = taxCoeficient;
        this._roundNumber = roundNumber;
        this._auditProbability = auditProbability;
        this.kickPlayersOnBankruptcy = kickPlayersOnBankruptcy;
    }

    public addPlayer(player: Player) : void {
        if (this._players.length >= this.maxPlayers) 
            throw "Can't add another player, too many"
        this._players.push(player);
    }


    public get id(): string {
        return this._id;
    }
    public get penalty(): number {
        return this._penalty;
    }
    public set penalty(value: number) {
        if (value < 0 || value > 100) 
           throw "invalid penalty, must be from 0 to 100";
        this._penalty = value;
    }
    
    public get roundNumber(): number {
        return this._roundNumber;
    }

    public incrementRoundNumber(): void {
        this._roundNumber++;
    }

    public get taxCoefficient(): number {
        return this._taxCoefficient;
    }
    public set taxCoefficient(value: number) {
        //todo: check this
        if (value < 1 || value > 2) 
            throw "tax coefficient must be between 1 and 2"
        this._taxCoefficient = value;
    }

    public get maxPlayers(): number {
        return this._maxPlayers;
    }
    public set maxPlayers(value: number) {
        if (value < 2) 
            throw "too view max players"
        this._maxPlayers = value;
    }
    public get auditProbability(): number { 
        return this._auditProbability;
    }
    public set auditProbability(value: number) {
        if (value < 0 || value > 100) 
            throw "invalid audit probablity";
        this._auditProbability = value;
    }
    public toString() {
        let str = "";
        str += "------------PLAYERS--------------\n";
        for (let player in this._players) {
            str += player.toString();
            str += "\n"
        }
        str += "---------------------------------\n";
        return str;
    }
}

class Universe {
    private _minister: Minister;
    private _taxRate: number;
    private _players: Citizen[];

    constructor (minister: Minister, taxRate: number) {
        this._minister = minister;
        this._taxRate = taxRate;
    }
    public addPlayer(player: Citizen) {
        this._players.push(player);
    }

    public divideTaxAmongPlayers(toDivide: number) {
        let eachPlayerReceives = toDivide / this._players.length;
            
        for (let player of this._players) {
            player.recieveFunds(eachPlayerReceives);
        }
    }
    public removePlayer(player: Player) {
        let index = 0; 
        for (let cit of this._players) {
            if (cit.id == player.id) {
                this._players.splice(index, 1);
                return ;
            }

            index++;
        }
    }

    public get minister() : Minister { return this._minister }
    public get taxRate() : number { return this._taxRate }
}

abstract class Player {
    private _name: string; 
    private _id:string;
	client:Socket;
    private _funds;
	private _gameID:string;

    constructor(id:string, name:string, client:Socket, gameID: string){
		this._id = id;
		this._name = name;
		this.client = client;
        this._gameID = gameID;
    }
    
    public get id() { return this._id; }

    public recieveFunds(toRecieve: number) {
        this._funds += toRecieve;
    }

    public toString() {
        let str = "";
        str += `name: ${this._name}\n`
        str += `id: ${this._id}\n`
        str += `funds: ${this._funds}\n`
        str += `gameID: ${this._gameID}\n`
        str += `name: ${this._name}\n`
        return str;
    }
}

class Minister extends Player {
    constructor(name: string, id: string, client: Socket, gameID: string) {
        super(id, name, client, gameID);
    }
    public setTaxRate (game: Game, newTaxRate: number) {
        game.taxCoefficient = newTaxRate;
    }
    public redistribute(universe: Universe, toDivide: number) {
        universe.divideTaxAmongPlayers(toDivide);
    }
}

abstract class Citizen extends Player {
    private _taxPaid; 

    constructor(name: string, id: string, client: Socket, gameID: string) {
        super(id, name, client, gameID);
        this._taxPaid = 0; 
    }

    public payTax(amount: number) {
        this._taxPaid += amount;
    }
}

class LocalWorker extends Citizen {

}

class ForeignWorker extends Citizen {
    public switchUniverse(oldUniverse: Universe, newUniverse: Universe) {
        oldUniverse.removePlayer(this);
    }
}

/*
    socket.on("joinGame", ({gameCode})=>{
        if(!games.get(gameCode)){
            socket.emit("joinedGame", {
                err: "Game with code does not exist"
            })
        }
        let id = createID();

        let game = games.get(gameCode);
        let player = {
            socket: socket,
            id:id,
        }

        game.addPlayer(player)
        players.set(id, player);

        socket.emit("joinedGame",{
            id: id
        })
    }).on("enterName", ({username, id})=>{
        let player = players.get(id);
        player.name = username;


    })
*/   

