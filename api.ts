import express, {Express} from "express";
import { setGameInstance } from "./server";
import { createAdminUser, getAdminIdByUserName, createGame } from "&/queries/queries"
import _ from "lodash"

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
				message: errormessage,
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
				message: e
			});
		}
	})

	//create a new game and post it to the database
	server.post("/createGame", async(req,res) => {
		
		try {
			createGame(req.body.adminId, req.body.taxCoefficient, req.body.maxPlayers, req.body.finePercent, req.body.roundNumber, req.body.auditProbability, req.body.kickPlayersOnBankruptcy);
		} catch (e) {
			res.status(500).json({
				success: false,
				message: e
			})
			return ;
		}

		res.status(200).json({
			success: true,
			message: "successfullly created game"
		})	

	})

	//sets the game instance on the server when the admin starts the game
	server.get("/openGame", async() => {

	})

	//retrieves the list of games from the server
	server.get("/listGames", async () => {

	})
}


/*

export interface IRequestResult<T=any> {
	success: boolean,
	message: string,
	data: T,
}
*/