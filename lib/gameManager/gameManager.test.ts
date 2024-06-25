import {Player, Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe} from "./gameManager";
import {io} from "socket.io-client";

//Helper function for test to stimulate joining players//
function assignCitizensRandomlyToUniverses(citizens: Citizen[], g: Game) {
    for (let c of citizens) {
        let ranNum1 = Math.round(Math.random());
        let ranNum2 = Math.round(Math.random());
        let id = "";
        if (ranNum2 == 0)
            id = "1";
        else
            id = "2";

        if (ranNum1 == 0)
            g.assignPlayerToUniverse(c.id, "1", Math.round(Math.random()) == 0);
        else
            g.assignPlayerToUniverse(c.id, "2", Math.round(Math.random()) == 0);
    }
}

describe('test the game manager', () => {

    test('add players to waiting area', () => {
        const g = new Game("1", 1.3, 5, 0.4, 0, 0.1, false);

        g.addPlayerToWaitingRoom(new LocalWorker("John", "1", io()));
        g.addPlayerToWaitingRoom(new LocalWorker("Tracy", "2", io()));
        g.addPlayerToWaitingRoom(new LocalWorker("Max", "3", io()));
        g.addPlayerToWaitingRoom(new LocalWorker("Lucy", "4", io()));
        g.addPlayerToWaitingRoom(new LocalWorker("Justine", "6", io()));

        try {
            expect(g.addPlayerToWaitingRoom(new LocalWorker("Err", "2", io()))).toThrow("Can't add another player");
        } catch (msg) {
            console.log(msg);
        }
    })

    test('setValue', () => {
        const g = new Game("1", 1.3, 5, 0.4, 0, 0.1, false);
        g.setValues("2", 1.4, 4, 0.2, 3, 0.5, true);

        expect(g.id).toBe("2");
        expect(g.penalty).toBe(0.2);
        expect(g.taxCoefficient).toBe(1.4);
        expect(g.maxPlayers).toBe(4);
        expect(g.roundNumber).toBe(3);
        expect(g.auditProbability).toBe(0.5);
        expect(g.kickPlayersOnBankruptcy).toBe(true);
    })

    let universeIdA: string;
    let universeIdB: string;

    test('Add universe and add players to that universe', () => {
        const g = new Game("1", 1.3, 7, 0.4, 0, 0.1, false);

        const citizens: Citizen[] = [
            new ForeignWorker("John", "1", io()),
            new LocalWorker("Tracy", "2", io()),
            new LocalWorker("Max", "3", io()),
            new LocalWorker("Lucy", "4", io()),
            new LocalWorker("Justine", "6", io()),
            new ForeignWorker("Jax", "9", io()),
        ]

        //add players to lobby
        for (const c of citizens)
            g.addPlayerToWaitingRoom(c);

        expect(g.numPlayersNotAssigned()).toBe(6);

        universeIdA = g.addUniverse(new Universe(new Minister("Frank", "7", io()), 0.5, "1"));
        universeIdB = g.addUniverse(new Universe(new Minister("James", "8", io()), 0.5, "2"));
        assignCitizensRandomlyToUniverses(citizens, g);

        console.log(g.getUniverse("1").toString());
    })

    test("divide tax among players", () => {

        const g = new Game("1", 1.3, 5, 0.4, 0, 0.1, false);

        //generic citizens in the waiting area
        const citizens: Citizen[] = [
            new ForeignWorker("John", "1", io()),
            new LocalWorker("Tracy", "2", io()),
            new LocalWorker("Max", "3", io()),
            new LocalWorker("Lucy", "4", io()),
            new ForeignWorker("Jax", "9", io()),
        ]

        universeIdA = g.addUniverse(new Universe(new Minister("Frank", "7", io()), 0.5, "1"));

        for (let c of citizens) {
            g.addPlayerToWaitingRoom(c);
            g.assignPlayerToUniverse(c.id, "1", true);
        }

        g.getUniverse(universeIdA).divideTaxAmongPlayers(500);

        for (let c of citizens) {
            expect(c.funds).toBe(100);
        }

    })

    test("audi players", () => {
        const AUDIT_PROBABILITY = 0.2;
        const TAX_PERCENT_TO_PAY = 0.4;
        const PENALTY = 0.2;
        //constructor(id: string, taxCoefficient: number, maxPlayers: number, penalty: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) {
        const g = new Game("1", 1.4, 5, PENALTY, 0, AUDIT_PROBABILITY, false);

        g.addUniverse(new Universe(new Minister("Julius", "0", io()), TAX_PERCENT_TO_PAY, "1"))

        //generic citizens in the waiting area
        const citizens: Citizen[] = [
            new ForeignWorker("John", "1", io()),
            new LocalWorker("Tracy", "2", io()),
            new LocalWorker("Max", "3", io()),
        ]

        for (let c of citizens) {
            g.addPlayerToWaitingRoom(c);
            //all players are in universe with ID 1
            g.assignPlayerToUniverse(c.id, "1", true);
        }

        //pay 3 times
        console.log("CITIZEN = FUNCDS")
        citizens[0].payTaxAndReceive(100, 100, 100 * TAX_PERCENT_TO_PAY); // + 60
        console.log(citizens[0].funds);
        citizens[0].payTaxAndReceive(30, 30, 30 * TAX_PERCENT_TO_PAY); // + 18
        console.log(citizens[0].funds);
        citizens[0].payTaxAndReceive(40, 40, 40 * TAX_PERCENT_TO_PAY); // + 24 = 102
        console.log(citizens[0].funds);

        //pay 3 times, but lie
        citizens[1].payTaxAndReceive(100, 50, 50 * TAX_PERCENT_TO_PAY) // pay 60 penalty
 
        citizens[1].payTaxAndReceive(100, 40, 40 * TAX_PERCENT_TO_PAY) // pay 72 penalty

        citizens[1].payTaxAndReceive(100, 30, 30 * TAX_PERCENT_TO_PAY) // pay 84 penalty = 216
      

        expect(citizens[1].funds).toBe(252); 

        //pay 3 times
        citizens[2].payTaxAndReceive(100, 50, 50 * TAX_PERCENT_TO_PAY) //pay 60
        citizens[2].payTaxAndReceive(100, 100, 100 * TAX_PERCENT_TO_PAY)
        citizens[2].payTaxAndReceive(100, 20, 20 * TAX_PERCENT_TO_PAY)  //pay 96 total penalty 156
        expect(citizens[2].funds).toBe(232); 


        for (const c of citizens) {
            c.audit(g.penalty);
        }
        
        
        //check if they have been fined correctly
        //ciziten should be fined 
        expect(citizens[0].funds).toBe(170 -(170 * TAX_PERCENT_TO_PAY));
        //lied
        expect(citizens[1].funds).toBe(36);
        //lied a bit
        expect(citizens[2].funds).toBe(76);

        //citizens who have lied, now are not audited again
        for (const c of citizens) {
            c.audit(g.penalty);
        }

        
        expect(citizens[0].funds).toBe(170 -(170 * TAX_PERCENT_TO_PAY));
        expect(citizens[1].funds).toBe(36);
        expect(citizens[2].funds).toBe(76);

    })


});