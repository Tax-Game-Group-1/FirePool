import express, {Express} from "express";

export function setUpServer(server:Express) {
    server.post("/createGame", (req, res) => {
        console.log("Recieved create game request");
        res.send("hello!")
    })
}