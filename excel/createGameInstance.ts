import { ForeignWorker, Game, LocalWorker, Minister } from "&/gameManager/gameManager";
import { PlayerInWaitingRoom } from "&/gameManager/interfaces";
import _ from "lodash";
import { Socket } from "socket.io";

// Create a new game instance
const game = new Game(
    "game123",          // Game ID
    "Sample Game",      // Game Name
    1.5,                // Tax Coefficient
    10,                 // Max Players
    0.2,                // Penalty
    0,                  // Round Number (initially 0)
    50,                 // Audit Probability (%)
    true                // Kick Players on Bankruptcy (true/false)
);

// Example players waiting to join
const playersInWaitingRoom: PlayerInWaitingRoom[] = [
    { waitingId: "p1", name: "Player 1", socket: null, ready: true, roomCode: "game123", timeStamp: Date.now() },
    { waitingId: "p2", name: "Player 2", socket: null, ready: true, roomCode: "game123", timeStamp: Date.now() },
    { waitingId: "p3", name: "Player 3", socket: null, ready: true, roomCode: "game123", timeStamp: Date.now() },
    { waitingId: "p4", name: "Player 4", socket: null, ready: true, roomCode: "game123", timeStamp: Date.now() },
    // Add more players as needed
];

// Add players to the game's waiting room
playersInWaitingRoom.forEach(player => game.addPlayerToWaitingRoom(player));

// Assign sockets to players (simulated here, assuming sockets exist externally)
game.assignSocketToPlayerInWaitingRoom("p1", {} as Socket);
game.assignSocketToPlayerInWaitingRoom("p2", {} as Socket);
game.assignSocketToPlayerInWaitingRoom("p3", {} as Socket);
game.assignSocketToPlayerInWaitingRoom("p4", {} as Socket);

// Example of getting all players in waiting room as JSON
const playersWaitingJSON = game.getPlayersInWaitingRoomAsJSON();
console.log("Players in Waiting Room:", playersWaitingJSON);

// After setting up, add universes and assign players randomly
const numUniverses = game.addUniversesAndDividePlayers();

// Example of accessing universes by ID
for (let i = 0; i < numUniverses; i++) {
    const universe = game.getUniverseById(i.toString());
    if (universe) {

        // Simulate actions for each universe (example: player pays tax)

        for (const randomPlayer of universe.getAllPlayers()) {
            const declaredIncome = Math.random() * 1000; // Example declared income const receivedIncome = Math.random() * 800; // Example received income
            const receivedIncome = declaredIncome * 1.1;
            universe.citizenPayTax(randomPlayer.id, declaredIncome, receivedIncome, declaredIncome * game.taxCoefficient);

        }


        const totalTaxPool = 1000; // Example total tax pool to redistribute 
        const toRedistribute = 700;
        universe.minister.redistribute(universe, totalTaxPool, toRedistribute);

        console.log(`Universe ${i}:`, universe);
    }
}

// Example of auditing all players in all universes
const playersChosenForAudit = game.auditAllPlayers();
console.log("Players Chosen for Audit:", playersChosenForAudit);
