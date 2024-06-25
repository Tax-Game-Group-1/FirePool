
import express from "express";
import * as socketIO from "socket.io"
import http from 'http';

import * as MY from "@catsums/my";
import { IObject, ISync, IHostData,IPlayerData,IData,IRoomData,IWorldData,IRequestResult } from '../src/interfaces';

const app = express();
const PORT = 8802;
const server = http.createServer(app);

function changePort(newPort:number, callback:()=>void){
	server.close();
	server.listen(newPort, callback);
}

server.listen(PORT, ()=>{
	console.log(`Server started on http://localhost:${PORT}`);
})

const ioServer = new socketIO.Server(server);

const clients:IObject<socketIO.Socket> = {};

export function createSync() : ISync {
	return {
		time: Date.now(),
		id: MY.randomID(),
	}
}
export function response(success:boolean, message:string, data?:any, sync?:ISync) : IRequestResult {
	return {
		success,
		message,
		data,
		sync,
	}
}

///EXPRESS

app
.post('/api/:func', async (req,res)=>{
	let body = req.body;
	if(!MY.isString(body) || !MY.isJSON(body)){
		res.status(400).send(response(
			false, "Body is not valid JSON data"
		))
		return;
	}

	let data = JSON.parse(body);

	let tag = req.params.func;
	if(!tag){
		res.status(400).send(response(
			false, "Invalid request on API"
		))
		return;
	}

	res.send(response(
		true, "Nice", {
			a: "b",
		}
	))

})
.get('/api/:func', async (req,res)=>{
	// let body = req.body;
	// if(!MY.isString(body) || !MY.isJSON(body)){
	// 	res.status(400).send(response(
	// 		false, "Body is not valid JSON data"
	// 	))
	// 	return;
	// }

	// let data = JSON.parse(body);

	let tag = req.params.func;
	// if(!tag){
	// 	res.status(400).send(response(
	// 		false, "Invalid request on API"
	// 	))
	// 	return;
	// }

	res.send(response(
		true, "Nice", {
			a: "b",
			tag,
		}
	))

})

///IOSERVER

ioServer.on("connection",(socket)=>{
	let clientID = socket.id;
	clients[clientID] = socket;

	socket.on("sync", async({sync})=>{
		socket.emit("sync", response(
			true, "Synced", {}, sync,
		))
	});

});