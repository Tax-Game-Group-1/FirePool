import next from "next";
import {Server} from "socket.io";
import {Game} from "./lib/gameManager/gameManager"
import express, {Express} from "express"
import {setUpServer} from "./api";
import * as http from "node:http";
import bodyParser from "body-parser"

import { setUpSocket } from "sockets";
import path from "node:path";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
let port = Number(process.env.PORT) || 80;

// const app = next({dev, hostname, port});
// const handler = app.getRequestHandler();

//Map<gameId, Game Ojbect>()
const gamesCurrentlyRunning = new Map<string,Game>()

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//set a game instance on the server hsamap and return the key to access that game
//this will be the game code
export function createGameInstance(newGame: Game) {
    let myString = generateRandomString(6);
    while (gamesCurrentlyRunning.get(myString) != null)
        myString = generateRandomString(6);

    gamesCurrentlyRunning.set(myString, newGame);
	newGame.gameCode = myString;
    return myString;
}

export function getGameInstanceByGameCode(gameCode: string) : Game {
    if (gamesCurrentlyRunning.get(gameCode) == null)
        throw "Cannot find game with game code"

    return gamesCurrentlyRunning.get(gameCode);
}

export function destroyGameInstance(gameCode: string) {
   gamesCurrentlyRunning.delete(gameCode);
}

export function removeWaitingPlayerFromAllGameInstancesBySocket(socketId: string) {
	// let values = Array.from(map.values())
	//for(let value of values)

    const values = Array.from(gamesCurrentlyRunning.values());
	console.log(`values: ${values.length}`)
	console.log(gamesCurrentlyRunning)
    for (const gameInstance of values) 
        if (gameInstance.removePlayerWithSocket(socketId))
            return gameInstance; 

    throw "can't find game instance"
}


console.log(`Trying to listen on ${port} (kill port if failing)`);
// app.prepare().then(() => {

    const expressServer: Express = express();
    
	expressServer.use(bodyParser.json())
    expressServer.use(bodyParser.urlencoded({ extended: true }))

	expressServer.use(express.static(path.join(__dirname, 'out')));

	let dir = path.join(__dirname, 'out');
    
	//next will route and serve the frontend pages here
	expressServer
	.get('/', (req, res) => {
		res.sendFile('index.html', {root: dir});
	})
	.get('/home', (req, res) => {
        res.sendFile('home.html', {root: dir});
	})
	.get('/host', (req, res) => {
        res.sendFile('host.html', {root: dir});
	})
	.get('/signup', (req, res) => {
		res.sendFile('signup.html', {root: dir});
	})
	.get('/game', (req, res) => {
		res.sendFile('game.html', {root: dir});
	})
	.get('*', (req, res) => {
		res.sendFile('404.html', {root: dir});
	})
	// expressServer.get('/', (req, res) => {
    //     return handler(req, res)
	// })
    
	//----------------------------- server stuff ------------------------//
    
	///got accidentally removed on one of the changes
	expressServer.on("error", (err) => {
		console.error("Server error:", err);
		process.exit(1);
	});
    
	//set up all the API routes for the server, even though the server still lives here
	setUpServer(expressServer);
    
    const server = http.createServer(expressServer);
    const io = new Server(server);
    
	server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
	});
  
    setUpSocket(io);

// }).catch((err) => {
//     console.error("Next.js app error:", err);
//     process.exit(1);
// });
