import {Socket} from "socket.io-client";

export class Game {
    //manage the game id
    private _id: string;
    //how much gets deducted if the players get caught
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
    private _playersNotAssignedToUniverse: Player[];
    //universes which players can switch to if they are not a slave
    private _universes: Universe[];

    constructor(id: string, taxCoefficient: number, maxPlayers: number, penalty: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) {
        this.setValues(id, taxCoefficient, maxPlayers, penalty, roundNumber, auditProbability, kickPlayersOnBankruptcy);
        this._playersNotAssignedToUniverse = [];
        this._universes = [];
    }

    public setValues(id: string, taxCoefficient: number, maxPlayers: number, penalty: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) {
        this._id = id;
        this._penalty = penalty;

        this.taxCoefficient = taxCoefficient;
        this.maxPlayers = maxPlayers;
        this.auditProbability = auditProbability;

        this._roundNumber = roundNumber;
        this.kickPlayersOnBankruptcy = kickPlayersOnBankruptcy;
    }

    public addPlayerToWaitingArea(player: Player): void {
        if (this._playersNotAssignedToUniverse.length >= this.maxPlayers)
            throw "waiting area full"
        this._playersNotAssignedToUniverse.push(player);
    }

    public numPlayersNotAssigned = () => this._playersNotAssignedToUniverse.length;

    public assignPlayerToUniverse(playerId: string, universeId: string, isLocalWorker: boolean) {

        //find universe
        let myUniverse:Universe = null;
        for (let u of this._universes)
            if (u.id == universeId)
               myUniverse = u;

        if (myUniverse == null)
            throw "cannot find universe"

        //find the player and splice it (remove it from the lobby)
        //then add it to the universe

        for (let i = 0; i < this._playersNotAssignedToUniverse.length; i++)
            if (this._playersNotAssignedToUniverse[i].id == playerId) {
                const p = this._playersNotAssignedToUniverse[i];
                this._playersNotAssignedToUniverse.splice(i, 1);

                if (isLocalWorker)
                    myUniverse.addPlayer(p as LocalWorker);
                else
                    myUniverse.addPlayer(p as ForeignWorker);

                return ;
            }

        throw "unable to find player, player not added"
    }

    public addUniverse(universe: Universe) {
        for (let u of this._universes)
            if (u.id == universe.id)
                throw "cannot add universe with duplicate ID"

        this._universes.push(universe);
        return universe.id;
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

    public set roundNumber(value: number) {
        if (value < 0)
            throw "Cannot set round number less than 0"
        this._roundNumber = value;
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
            throw "too few max players"
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
        for (let player in this._playersNotAssignedToUniverse) {
            str += player.toString();
            str += "\n"
        }
        str += "---------------------------------\n";
        return str;
    }

    getUniverse(id: string) {
        for (let u of this._universes)
            if (u.id == id)
                return u;
       throw "Cannot find universe"
    }
}

export class Universe {
    public readonly minister: Minister;
    public readonly taxRate: number;
    private _players: Citizen[];
    private _id;

    constructor(minister: Minister, taxRate: number, id: string) {
        this.minister = minister;
        if (taxRate < 0 || taxRate > 1)
            throw "invalid tax rate";
        this.taxRate = taxRate;
        this._id = id;
        this._players = [];
    }

    public addPlayer(player: Citizen) {
        for (let p of this._players)
            if (p.id == player.id)
                throw "cannot add duplicate player"

        this._players.push(player);
    }

    public get id() {
        return this._id;
    }

    public divideTaxAmongPlayers(toDivide: number) {
        let eachPlayerReceives = toDivide / this._players.length;

        for (let player of this._players) {
            player.receiveFunds(eachPlayerReceives);
        }
    }

    public removePlayer(player: Player): void;
    public removePlayer(id: string): void;

    public removePlayer(a: any) {
        let index = 0;
        for (let cit of this._players) {

            if (typeof a == "string")
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

    toJson(): void {
        let players = [];
        for (const p of this._players)
            players.push(p.toJSON);

        let json = {
           id: this._id,
            minister: this.minister.toJSON(),
            taxRate: this.taxRate,
            players: players
        }
    }

}

export abstract class Player {
    private _name: string;
    private _id: string;
    client: Socket;
    private _funds;
    private _hasBeenKicked;

    constructor(id: string, name: string, client: Socket){
        this._id = id;
        this._name = name;
        this.client = client;
    }

    public get name(){
        return this._name;
    }

    public get id() {
        return this._id;
    }

    public receiveFunds(toReceive: number) {
        this._funds += toReceive;
    }

    public payFunds(toPlay: number) {

    }

    public kickPlayer() {
        this._hasBeenKicked = true;
    }

    public get hasBeenKicked() {
        return this._hasBeenKicked;
    }

    public abstract toJSON();

    protected getJSON(type: string) {
        return {
            type: type,
            id: this._id,
            name: this._name,
            funds: this._funds,
            hasBeenKicked: this._hasBeenKicked
        }
    }
}

export class Minister extends Player {
    constructor(name: string, id: string, client: Socket){
        super(id, name, client);
    }

    public setTaxRate(game: Game, newTaxRate: number) {
        game.taxCoefficient = newTaxRate;
    }

    public redistribute(universe: Universe, toDivide: number) {
        universe.divideTaxAmongPlayers(toDivide);
    }

    toJSON() {
        return super.getJSON("Minister");
    }


}

export abstract class Citizen extends Player {
    private _taxPaid;

    constructor(name: string, id: string, client: Socket) {
        super(id, name, client);
        this._taxPaid = 0;
    }

    public payTax(amount: number) {
        this._taxPaid += amount;
    }
}

export class LocalWorker extends Citizen {
    toJSON() {
        return super.getJSON("LocalWorker")
    }
}

export class ForeignWorker extends Citizen {
    public switchUniverse(oldUniverse: Universe, newUniverse: Universe) {
        oldUniverse.removePlayer(this);
        newUniverse.addPlayer(this);
    }

    toJSON() {
        return super.getJSON("ForeignWorker")
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

