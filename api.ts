import express, {Express} from "express";
import { destroyGameInstance, createGameInstance, getGameInstanceByGameCode } from "server";
import { createAdminUser, getAdminIdByUserName, createGame, getAdminGames, getGameById, getAdminById} from "&/queries/queries"
import _ from "lodash"
import { Citizen, Game } from "&/gameManager/gameManager";


export function setUpServer(server:Express) {
    server.post("/adminLogin", async (req, res) => {

		let body = req.body;

        if (!body.username) {
            res.status(400).send({
                success: false,
                message: "Username is missing"
            })
            return;
        }
        if (!body.password) {
            res.status(400).json({
                success: false,
                message: "Password is missing"
            })
			return;
        }
		
		//check the username and password for the admin
		try {
			const result = await getAdminIdByUserName(body.username, body.password);
			res.status(200).json({
				success:true,
				data: {
					id: result
				} 
			})
		} catch (errormessage) {
			res.status(201).json({
				success: false,
				message: errormessage.toString(),
			});
		}
		return;

    })
	server.post("/adminSignup", async(req,res)=>{
		let {
			username,
			password,
			email
		} = req.body;

        if (!username) {
            res.status(400).send({
                success: false,
                message: "Username is missing"
            })
            return;
        }
        if (!password) {
            res.status(400).json({
                success: false,
                message: "Password is missing"
            })
			return;
        }
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email is missing"
            })
			return;
        }

		//// Enable this when you install content-checker
		// if(isUsingAIFilter){
		// 	let filterResponse = await AIFilter.isProfaneAI(username);
		// 	if(filterResponse.profane){
		// 		res.status(200).json({
		// 			success: false,
		// 			message: "Your username contains words that are not allowed",
		// 		})
		// 	}
		// }

		//check the username and password for the admin
		try {
			// const result = await getAdminIdByUserName(body.username, body.password);
			let result = await createAdminUser(email, username, password);
			res.status(201).json({
				success:true,
				message: "Created user", 
				data: {
					id: result
				}
			})
		} catch (e) {
			let err = "User already exists, please log in";
			if(_.isString(e)){
				err = e;
			}
			res.status(500).json({
				success: false,
				message: e.toString()
			});
		}
	})

	//create a new game and post it to the database
	server.post("/createGame", async(req,res) => {

		console.log("BODY:")
		console.log(req.body);

		//// Enable this when you install content-checker
		// if(isUsingAIFilter){
		// 	let filterResponse = await AIFilter.isProfaneAI(req.body.name);
		// 	if(filterResponse.profane){
		// 		res.status(200).json({
		// 			success: false,
		// 			message: "Your username contains words that are not allowed",
		// 		})
		// 	}
		// }
		
		await createGame(req.body.adminId, req.body.name, req.body.taxCoefficient, req.body.maxPlayers, req.body.finePercent, req.body.roundNumber, req.body.auditProbability, req.body.kickPlayersOnBankruptcy)
		.then(result => {
			res.status(200).json({
				success: true, 
				data: result[0].gameId
			})

		})
		.catch(error => {
			res.status(200).json({
				success: false,
				message: error.toString()
			})	
		})

	})

	server.post('/joinGame', async (req, res) => {
		console.log("player attempting to join a game... (API.ts)");

		console.log('Game code: ')
		console.log(req.body.gameCode);

		console.log("Creating player with id:");
		console.log(req.body.waitingId);

		try{
			getGameInstanceByGameCode(req.body.gameCode).addPlayerToWaitingRoom({
				name: null, 
				socket: null, 
				roomCode: req.body.gameCode, 
				waitingId: req.body.waitingId,
				ready: false,
				timeStamp: Date.now()
			})

			console.log("SENDING RESPONSE TO CLIENT");
			console.log({
				waitingId: req.body.waitingId
			})

			res.status(200).json({
				success: true, 
				data: {
					waitingId: req.body.waitingId
				}
			})
		}catch(e){
			console.error("SERVER ERROR")
			console.log(e);
			res.status(200).json({
				success: false,
				message: e.toString()
			})
		}

	});

	//sets the game instance on the server when the admin starts the game
	server.post("/startGame", async(req, res) => {

		console.log("open game request received...");
		console.log("set game instance")

		const id = req.body.id; 

		if (id == null) {
			res.status(400).json({
				success: false, 
				message: "No id is set"
			})
			return ;
		}

		let gameFromDatabase;
		//insert into the server hashmap with the id as the key
		try {
			gameFromDatabase = await getGameById(req.body.id);
		} catch (e) {
			res.status(400).json({
				success: false, 
				message: e.tostring()
			})
			return ;
		}

		console.log("FROM DB")
		console.log(gameFromDatabase)

		try {
			const user = await getAdminById(req.body.adminId);
			const gameInstance = new Game(
				gameFromDatabase.gameId.toString(),
				gameFromDatabase.name, 
				gameFromDatabase.taxCoefficient, 
				gameFromDatabase.maxPlayers, 
				gameFromDatabase.finePercent,
				gameFromDatabase.roundNumber, 
				gameFromDatabase.auditProbability, 
				gameFromDatabase.kickPlayersOnBankruptcy
			)

			
			const gameCode = createGameInstance(gameInstance);
			gameInstance.assignHostData({
				name: user.username,
				waitingId: "",
				roomCode: gameCode,
				ready: false,
				socket: null,
				timeStamp: Date.now()
			})

			console.log("setting game instance")

			res.status(200).json({
				success: true, 
				data: {
					gameCode: gameCode
				}
			})

		} catch (e) {
			res.status(400).json({
				success: false, 
				message: e.toString()
			})
		}


	})


    //retrieves the list of games from the server
	server.post("/listGames/:adminId", async (req, res) => {
		console.log("list games")

		try {
		const adminGames = await getAdminGames(Number(req.params.adminId));
		console.log("admin games: ");
		console.log(adminGames);
		res.status(200).json({
			success: true,
			data: {
				games: adminGames,
			}
		});
		} catch (e) {
			console.error(e);
			res.status(400).json({
				success: false,
				message: `${e.toString()}`
			});
			return;
		}
	})

	server.post("editGame/:gameId", async (req, res) => {

		try {
			const game = new Game(req.body.id, req.body.name, req.body.taxCoefficient, req.body.maxPlayers, req.body.penalty, req.body.roundNumber, req.body.auditProbability, req.body.kickPlayersOnBankruptcy);
		} catch (e) {
			console.error(e); 
			res.status(400).json({
				success:false, 
				message: `${e.toString()}`
			})
		}


	})

	server.delete("deleteGame/:gameId", async (req, res) => {

	})
}


/*

export interface IRequestResult<T=any> {
	success: boolean,
	message: string,
	data: T,
}
*/