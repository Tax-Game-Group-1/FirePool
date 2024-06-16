import {Player, Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe} from "./gameManager";
import {io} from "socket.io-client";


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

        g.addPlayerToWaitingArea(new LocalWorker("John", "1", io()));
        g.addPlayerToWaitingArea(new LocalWorker("Tracy", "2", io()));
        g.addPlayerToWaitingArea(new LocalWorker("Max", "3", io()));
        g.addPlayerToWaitingArea(new LocalWorker("Lucy", "4", io()));
        g.addPlayerToWaitingArea(new LocalWorker("Justine", "6", io()));

        try {
            expect(g.addPlayerToWaitingArea(new LocalWorker("Err", "2", io()))).toThrow("Can't add another player");
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
            g.addPlayerToWaitingArea(c);

        expect(g.numPlayersNotAssigned()).toBe(6);

        universeIdA = g.addUniverse(new Universe(new Minister("Frank", "7", io()), 0.5, "1"));
        universeIdB = g.addUniverse(new Universe(new Minister("James", "8", io()), 0.5, "2"));
        assignCitizensRandomlyToUniverses(citizens, g);

        console.log(g.getUniverse("1").toString());
    })

    test("divide tax among players", () => {

        const g = new Game("1", 1.3, 5, 0.4, 0, 0.1, false);

        const citizens: Citizen[] = [
            new ForeignWorker("John", "1", io()),
            new LocalWorker("Tracy", "2", io()),
            new LocalWorker("Max", "3", io()),
            new LocalWorker("Lucy", "4", io()),
            new ForeignWorker("Jax", "9", io()),
        ]

        universeIdA = g.addUniverse(new Universe(new Minister("Frank", "7", io()), 0.5, "1"));

        for (let c of citizens) {
            g.addPlayerToWaitingArea(c);
            g.assignPlayerToUniverse(c.id, "1", true);
        }

        g.getUniverse(universeIdA).divideTaxAmongPlayers(500);

        for (let c of citizens) {
            expect(c.funds).toBe(100);
        }


    })


});