import { Server, Socket } from "socket.io";
import { getGameInstanceByGameCode, removeWaitingPlayerFromAllGameInstancesBySocket } from "server";
import { PlayerChosenForAudit, PlayerData, PlayerInWaitingRoom } from "&/gameManager/interfaces";
import { Game, Player, Universe } from "&/gameManager/gameManager";
import { GameState } from "@/interfaces";

export const setUpSocket = (io: Server) => {
  //--------------------------- socket stuff -------------------------//
  /**
   * Handles players request to join games in real time
   * Most of the game logic and updates will be handled via sockets
   * All player actions will be accumulated in a game object and after
   * each round will be posted to the database
   */
  //handle the connection of players

  let purgePlayersInterval;

  let queue = [];

  io.on("connection", (socket) => {
    console.log("Player connected to the socket...");

    //add the player to the waiting area, create a waitng player
    socket.on("server-roomData", ({ code, hostID, waitingId }) => {
      if (waitingId != null && hostID == null) console.log("player joined");
      else if (hostID != null) {
        // purgePlayersInterval = setInterval(() => doSocketAction(Action.PURGE_NULL_PLAYERS, null, code), 45000);
        console.log("host joined");
      } else {
        socket.emit("client-roomData", {
          success: false,
          message: "both host and player are null",
        });
        console.log("error, host and player cannot be null");
        return;
      }

      //host only has hostID
      if (code == null) {
        socket.emit("client-roomData", {
          success: false,
          message: "check code",
        });

        return;
      }

      const game = getGameInstanceByGameCode(code);

      if (game == null) {
        socket.emit("client-roomData", {
          success: false,
          message: "invalid game code",
        });

        return;
      }

      // player
      if (waitingId != null) {
        try {
          game.assignSocketToPlayerInWaitingRoom(waitingId, socket);
        } catch (e) {
          socket.emit("client-roomData", {
            success: false,
            message: e.toString(),
          });
        }

        //player joined the room
        game.emitMessageToPlayers("client-roomData", {
          success: true,
          message: "player added to waiting room",
          data: {
            gameId: game.id,
            name: game.name,
            roundNumber: game.roundNumber,
            taxCoefficient: game.taxCoefficient,
            hostName: game.getHostData().name,
            maxPlayers: game.maxPlayers,
            playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
          },
        });

        return;
      }

      game.assignSocketToHost(socket);

      //host
      game.emitMessageToPlayers("client-roomData", {
        success: true,
        message: "player added to waiting room",
        data: {
          gameId: game.id,
          name: game.name,
          roundNumber: game.roundNumber,
          taxCoefficient: game.taxCoefficient,
          hostName: game.getHostData().name,
          maxPlayers: game.maxPlayers,
          playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
        },
      });
    });

    enum Action {
      ASSIGN_NAME,
      ASSIGN_ICON,
      UPDATE_READY,
      DISCONNECT,
      CONSENT,
      PURGE_NULL_PLAYERS,
      SET_TAX_RATE,
      CITIZENS_PAY_TAX,
      AUDIT_ALL_PLAYERS,
      REDISTRIBUTE,
    }

    let mutex = Promise.resolve();

    const doSocketAction = async (a: Action, params: any, code) => {
      await mutex;

	  console.log({mutex})

      let game: Game;
      if (code != null) game = getGameInstanceByGameCode(code);
      let universe: Universe | null;
      if (params.universeId != null) {
        universe = game.getUniverseById(params.universeId);
        if (universe == null) throw "cannot find universe";
      }

      try {
        switch (a) {
          case Action.ASSIGN_NAME:{
            if (params.name == null) throw "name is  null (socket.ts)";

            const result = await game.assignNameToPlayerInWaitingRoom(
              params.waitingId,
              params.name
            );
            if (result != true) {
              game.emitMessageToPlayers("client-update-players", {
                success: false,
                message: "could not update name",
              });
              return;
            }

		 } break;
          case Action.ASSIGN_ICON:{

            const result = await game.assignIconToPlayerInWaitingRoom(
              params.waitingId,
              params.icon
            );
            if (result != true) {
              game.emitMessageToPlayers("client-update-players", {
                success: false,
                message: "could not update icon",
              });
              return;
            }

		 } break;

          case Action.UPDATE_READY:
            if (params.ready == null) throw "ready is  null (socket.ts)";
            game.updateReadyState(params.waitingId, params.ready);

            break;

          case Action.CONSENT:
            if (params.playerId == null || params.hasConsented == null)
              throw "Cannot consent, parameters are null (socket.ts)";
            game.playerConsent(params.playerId, params.hasConsented);

            break;

          case Action.DISCONNECT:
            console.log("player disconnected");

            break;

          case Action.SET_TAX_RATE:
            if (params.taxRate == null)
              throw "cannot set tax rate if null (socket.ts)";
            if (params.universeId == null)
              throw "cannot set tax rate if universe id is null (socket.ts)";
            if (game.getUniverseById(params.universeId) == null)
              throw "ucannot set tax rate if universe is null (socket.ts)";

            universe.minister.setTaxRates(game, params.taxRate, universe);
			console.log("sending to everyone tax rate");
			universe.emitMessageToAllPlayersInUniverse("client-taxrate-set",{
				success: true,
				data: {
					taxRate: params.taxRate,
				}
			})
            universe.resetHasPaidForAllCitizens();
            game.resetAudit();
            // hasPaidInterval = setInterval(() => {
            //   if (game.allHavePaid()) {
            //     //reset paid for all universes
            //     game.resetAllHavePaid();
            //     //send socket to client to say that they have paid
            //     game.emitMessageToPlayers("client-paid-tax", {
            //       success: true,
            //       data: game.getDeclaredVsPaidTaxForAllUniverses()
            //     })
            //     clearInterval(hasPaidInterval);
            //   }

            // }, 2500);

            break;

          case Action.CITIZENS_PAY_TAX:
            if (params.declared == null)
              throw "cannot pay tax because declared is null (socket.ts)";
            if (params.received == null)
              throw "cannot pay tax because received is null (socket.ts)";
            if (params.playerId == null)
              throw "cannot pay tax because playerId is null (socket.ts)";
            if (params.calculatedTax == null)
              throw "cannot pay tax because calculated tax is null (socket.ts)";

			console.log("paying tax")
            let everyoneHasPaid = game.citizenPayTax(params.playerId, params.declared, params.received, params.calculatedTax);

			if(!everyoneHasPaid) break;
			console.log("everyone has paid")

			game.emitMessageToPlayers("client-paid-tax", {
				success: true,
				data: {
					universeData: game.getAllUniversesAsJSON(),
					declaredVsPaidUniverse: game.getDeclaredVsPaidTaxForAllUniverses()
				}
				
			})




            break;

          case Action.AUDIT_ALL_PLAYERS:
            if (params.code == null)
              throw "cannot audit players because game code is null";
            const playersAudited: PlayerChosenForAudit[] =
              game.auditAllPlayers();
			  console.log("auditing to players")
            game.emitMessageToPlayers("client-audit-all-players", {
              success: true,
              data: playersAudited,
            });
            break;

          //doSocketAction(Action.REDISTRIBUTE, { universeId, code, amount }, code)
          case Action.REDISTRIBUTE:
            if (game == null) throw "invalid game code";
            if (universe == null)
              throw "cannot redistribute because universe id returned null";
            if (params.redistributionPercentage == null)
              throw "cannot redistribute, because percentage is null";

            try {
				console.log("distribut0")
              universe.divideTaxAmongPlayers(params.redistributionPercentage);
			  console.log("distribut1")
			  universe.emitMessageToAllPlayersInUniverse("client-redistribution",{
				success:true,
				data: {
					universeData: universe.getUniverseDataAsJSON(),
				}
			  })
			  console.log("distribut2")
            } catch (e) {
              if (e == "minister loses") {
                //todo: implement
                throw "minister loses! unimplemented in sockets.ts";
              } else {
				console.log(e);
                game.emitMessageToPlayers("client-redistribution", {
                  success: false,
                  message: e.toString(),
                });
              }
            }

            break;

          default:
            throw "undefined action";
        }

        game.emitMessageToPlayers("client-update-players", {
          success: true,
          data: {
            playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
            universeData: game.getAllUniversesAsJSON(),
			gameData: game.getGameJSON(),
          },
        });
      } catch (e) {
        socket.emit("client-update-players", {
          success: false,
          message: e.toString(),
        });
		console.error(e);
		console.trace(e);
      } finally {
        mutex = Promise.resolve();
      }
    };

    socket.on("set-tax-rate", ({ code, taxRate, universeId }) => {
		console.log("setting tax rate");
      doSocketAction(Action.SET_TAX_RATE, { taxRate, universeId }, code);
    });

    socket.on("pay-tax", ({ code, declared, received, playerId, universeId, calculatedTax }) => {
      console.log("paytax")
		doSocketAction(
        Action.CITIZENS_PAY_TAX,
        { declared, received, universeId, playerId, calculatedTax },
        code
      );
    });

    socket.on("sign-consent", ({ playerId, hasConsented, code }) => {
      doSocketAction(Action.CONSENT, { playerId, hasConsented }, code);
    });

    socket.on("update-name", ({ name, waitingId, code }) => {
		console.log({name, code, waitingId})
		doSocketAction(Action.ASSIGN_NAME, { waitingId, name }, code);
    });
    socket.on("update-icon", ({ icon, waitingId, code }) => {
		doSocketAction(Action.ASSIGN_ICON, { waitingId, icon }, code);
    });
	
    socket.on("update-ready", ({ waitingId, ready, code }) => {
		console.log({ready, code, waitingId})
      doSocketAction(Action.UPDATE_READY, { waitingId, ready }, code);
    });

    socket.on("audit-all-players", ({ code }) => {
		console.log("received audit all players request")
		doSocketAction(Action.AUDIT_ALL_PLAYERS, { code }, code);
	});

    socket.on("redistribute", ({ universeId, code, amount, redistributionPercentage }) => {
      doSocketAction(Action.REDISTRIBUTE, { universeId, code, amount, redistributionPercentage }, code);
    });

    socket.on("disconnect", () => {
      console.log("player disconnected");
      try {
		
		// let timer = setTimeout(()=>{
			const gameInstance = removeWaitingPlayerFromAllGameInstancesBySocket(
			  socket.id
			);
			doSocketAction(Action.DISCONNECT, {}, gameInstance.gameCode);
		// }, 100000)

		// queue.push({timer, socket});
      } catch (e) {
        console.error("error disconnecting player with socket");
        socket.emit("client-update-players", {
          success: false,
          message: e.toString(),
        });
      }
    });

    socket.on("start-game", ({ code }) => {
      //assign the roles of the players in the waiting room
      try {
        const gameInstance = getGameInstanceByGameCode(code);
        gameInstance.addUniversesAndDividePlayers();
        const universeData = gameInstance.getAllUniversesAsJSON();
        clearInterval(purgePlayersInterval);

        //start the game for all players
        gameInstance.emitMessageToPlayers("client-start-game", {
          success: true,
          data: {
            universeData: universeData,
          },
        });

		
      } catch (e) {
        console.error(e);
        socket.emit("client-update-players", {
          success: false,
          message: e.toString()
        })
      }
    })

	socket.on("game-over", ({ code })=>{
		try{
			let game = getGameInstanceByGameCode(code);
			removeWaitingPlayerFromAllGameInstancesBySocket(
				socket.id
			  );
			socket.emit("client-game-over",{})

			
		}catch(e){
			console.log(e);
			socket.emit("client-update-players", {
				success: false,
				message: e.toString()
			})
		}
	})
	socket.on("universe-game-over", ({ code, universeId })=>{
		try{
			let game = getGameInstanceByGameCode(code);
			let universe = game.getUniverseById(universeId);

			for(let player of universe.getAllPlayers()){
				removeWaitingPlayerFromAllGameInstancesBySocket(
					socket.id
				  );
			}

			socket.emit("client-game-over",{})

			
		}catch(e){
			console.log(e);
			socket.emit("client-update-players", {
				success: false,
				message: e.toString()
			})
		}
	})
	socket.on("game-end", ({ code })=>{
		try{
			let game = getGameInstanceByGameCode(code);
			game.emitMessageToPlayers("client-end-game",{})

			game.emitMessageToPlayers("client-update-players", {
				success: true,
				data: {
				  playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
				  universeData: game.getAllUniversesAsJSON(),
				  gameData: game.getGameJSON(),
				},
			  });
		}catch(e){
			console.log(e);
			socket.emit("client-update-players", {
				success: false,
				message: e.toString()
			})
		}
		
	})
	socket.on("finish-round", ({ code })=>{
		try{
			let game = getGameInstanceByGameCode(code);
			queue.push(socket);
			let players = game.getAllUniversesAsJSON().reduce((players, universe) => {
				return players.concat(universe.players);
			},[] as PlayerData[])

			if(queue.length >= players.length){
				game.finishRound();
				

				game.emitMessageToPlayers("next-round",{
					success:true,
					data: {
						playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
						universeData: game.getAllUniversesAsJSON(),
						gameData: game.getGameJSON(),
					  },
				})
			}

			game.emitMessageToPlayers("client-update-players", {
				success: true,
				data: {
				  playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
				  universeData: game.getAllUniversesAsJSON(),
				},
			  });

		}catch(e){
			console.log(e);
			socket.emit("client-update-players", {
				success: false,
				message: e.toString()
			})
		}
	})

	socket.on("player-salary", ({universeId, code, salary, playerId})=>{
		try {
			const game = getGameInstanceByGameCode(code);
			let universe = game.getUniverseById(universeId);
			if(!universe){
				throw "Player is not part of any universe"
			}

			let allHavePaid = universe.paySalaryByPlayerId(playerId, salary);

			console.log("Someone paid")
			if(!allHavePaid) return;

			console.log("All paid")

			universe.minister.client.emit("client-salary-paid", {
				success: true,
				// data: gameInstance.getDeclaredVsPaidTaxForAllUniverses()
			})

			game.emitMessageToPlayers("client-update-players", {
				success: true,
				data: {
				  playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
				  universeData: game.getAllUniversesAsJSON(),
				  gameData: game.getGameJSON(),
				},
			  });

		} catch (e) {
			console.log(e);
			socket.emit("client-taxrate-set", {
				success: false,
				message: e.toString()
			  })
		}
	})

	

  });
};
