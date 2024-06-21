import express, {Express} from "express";
import { setGameInstance, getGameInstance } from "server";
import { createAdminUser, getAdminIdByUserName, createGame, getAdminGames} from "&/queries/queries"
import _ from "lodash"
import { Citizen, Game, PlayerInWaitingRoom } from "&/gameManager/gameManager";

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

// {
// 	name
// 	gameCode
// }

	server.post('/joinGame', async (req, res) => {
		console.log("player attempting to join a game...");

		console.log('Game code: ')
		console.log(req.body.gameCode);

		console.log("Creating player");

		// body: JSON.stringify({
		// 	gameCode: code,
		// 	waitingId: randomID(),
		// }),

		try{
			getGameInstance().addPlayerToWaitingArea({
				roomCode: req.body.gameCode, 
				waitingId: req.body.waitingId
			})
		}catch(e){
			res.status(200).json({
				success: false,
				message: e.toString()
			})
		}

		res.status(200).json({
			success: true,
			message: "",
		})

	});

	//sets the game instance on the server when the admin starts the game
	server.post("/openGame", async() => {

		console.log("open game request recieved...");
		console.log("set game instance")

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