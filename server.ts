import {createServer} from "node:http";
import next from "next";
import {Server, Socket} from "socket.io";
import {Player, Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe} from "@/app/api/gameManager/gameManager"

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

function randomID(length = 8, prefix = '', suffix = '') {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * characters.length)
        result += characters.charAt(index);
    }
    return `${prefix}${result}${suffix}`;
}

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);

    //--------------------------- socket stuff -------------------------//
    /**
     * Handles players request to join games in real time
     * Most of the game logic and updates will be handled via sockets
     * All player actions will be accumulated in a game object and after
     * each round will be posted to the database
     */
    //handle the connection of players
    io.on("connection", (socket) => {
        console.log("Player joined...");

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

    httpServer.on("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });



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