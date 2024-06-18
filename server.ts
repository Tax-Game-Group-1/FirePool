import next from "next";
import {Server, Socket} from "socket.io";
import {Player, Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe} from "./lib/gameManager/gameManager"
import express, {Express} from "express"
import {setUpServer} from "./api";
import exp from "node:constants";
import * as http from "node:http";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({dev, hostname, port});
const handler = app.getRequestHandler();
let game: Game;

//set the current game instance on the server. This is the function that the API uses. 
//The actual game is posted to the database initially using the API. 
//This instance is just stored here, but will make API requests after each round 
//to update the instance
export function setGameInstance(newGame: Game) {
  game = newGame;
}

function randomID(length = 8, prefix = '', suffix = '') {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * characters.length)
        result += characters.charAt(index);
    }
    return `${prefix}${result}${suffix}`;
}

console.log(`Trying to listen on ${port} (kill port if failing)`);
app.prepare().then(() => {
    const expressServer: Express = express();
    const server = http.createServer(expressServer);
    const io = new Server(server);

    //--------------------------- socket stuff -------------------------//
    /**
     * Handles players request to join games in real time
     * Most of the game logic and updates will be handled via sockets
     * All player actions will be accumulated in a game object and after
     * each round will be posted to the database
     */
    //handle the connection of players
    io.on("connection", (socket) => {
        console.log("Player connected to the socket...");

        //when players try to join the game, it generates a random ID for them
        // we will maybe have to change this later if games need to be resumed
        socket.on("joinGame", ({code}) => {
            console.log(code);



            let id = randomID(8);

            socket.emit("joinedGame", {
                id: id,
            });
        });
    });

    //----------------------------- server stuff ------------------------//

    //set up all the API routes for the server, even though the server still lives here
    setUpServer(expressServer);

}).catch((err) => {
    console.error("Next.js app error:", err);
    process.exit(1);
});


// io.on("connection", (socket) => {
//     console.log("Player joined...");

//     //where they send their name
//     socket.on("submit_name", ({playerName}:{playerName:string}) => {
//         console.log("Player submitting name...");
//         console.log(playerName);
//     })
// });

// app.get('/', (req, res) => {
//   req.send('Server is up and running')
// })

// http.listen(PORT, () => {
//   console.log(`Listening to ${PORT}`);
// })// io.on("connection", (socket) => {
//     console.log("Player joined...");

//     //where they send their name
//     socket.on("submit_name", ({playerName}:{playerName:string}) => {
//         console.log("Player submitting name...");
//         console.log(playerName);
//     })
// });

// app.get('/', (req, res) => {
//   req.send('Server is up and running')
// })

// http.listen(PORT, () => {
//   console.log(`Listening to ${PORT}`);
// })