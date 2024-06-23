import { Server, Socket } from "socket.io";
import { getGameInstanceByGameCode, removeWaitingPlayerFromAllGameInstancesBySocket } from "server";
import { PlayerInWaitingRoom } from "&/gameManager/interfaces";
import { Game } from "&/gameManager/gameManager";

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

  io.on("connection", (socket) => {
    console.log("Player connected to the socket...");

    //add the player to the waiting area, create a waitng player
    socket.on("server-roomData", ({ code, hostID, waitingId }) => {
      console.log("recieved by socket");
      console.log(hostID, " ", waitingId, " ", code);

      if (waitingId != null && hostID == null) console.log("Player joined");
      else if (hostID != null)  {
        // purgePlayersInterval = setInterval(() => doSocketAction(Action.PURGE_NULL_PLAYERS, null, code), 45000);
        console.log("host joined");
      }
      else {
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
      UPDATE_READY,
      DISCONNECT,
      CONSENT,
      PURGE_NULL_PLAYERS
    }

    let mutex = Promise.resolve(); 

    const doSocketAction = async (a: Action, params: any, code) => {

      await mutex;

      let game : Game;
      if (code != null)
        game = getGameInstanceByGameCode(code);

      try {
        switch (a) {
          case Action.ASSIGN_NAME:
            if (params.name == null) throw "name is  null";
            const result = await game.assignNameToPlayerInWaitingRoom(params.waitingId, params.name);
            if (result != true) {
              game.emitMessageToPlayers("client-update-players", {
                success: false,
                message: "could not update name"
              });
              return;
            }
            break;
          case Action.UPDATE_READY:
            if (params.ready == null) throw "ready is  null";
            game.updateReadyState(params.waitingId, params.ready);
            break;
          case Action.CONSENT:
            if (params.playerId == null || params.hasConsented == null)
              throw "Cannot consent, parameters are null";
              game.playerConsent(params.playerId, params.hasConsented);
            break; 
          case Action.DISCONNECT:
            console.log("player disconnected")
          default:
        }

        console.log("emmitting message")
        game.emitMessageToPlayers("client-update-players", {
          success: true,
          data: {
            playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
            universeData: game.getAllUniversesAsJSON()
          },
        });
      } catch (e) {
        socket.emit("client-update-players", {
          success: false,
          message: e.toString(),
        });
      } finally {
        mutex = Promise.resolve();
      }
    };

    socket.on("sign-consent", ({playerId, hasConsented, code }) => {
      // console.log("------------------sign consent socket-----------------");
      // console.log(playerId);
      // console.log(hasConsented);
      // console.log(code);
      // console.log("--------------------------------------------------------")

      doSocketAction(Action.CONSENT, { playerId, hasConsented}, code);
    })

    socket.on("update-name", ({ name, waitingId, code }) => {
      console.log("updating name");
      doSocketAction(Action.ASSIGN_NAME, { waitingId, name }, code);
    });

    socket.on("update-ready", ({ waitingId, ready, code}) => {
      console.log("notifying players of ready state on server");
      doSocketAction(Action.UPDATE_READY, { waitingId, ready }, code);
    });

    socket.on("disconnect", () => {
      console.log("player disconnected")
      try {
        const gameInstance = removeWaitingPlayerFromAllGameInstancesBySocket(socket.id);
        doSocketAction(Action.DISCONNECT, {}, gameInstance.gameCode);
      } catch (e) {
        console.error("error disconnecting player with socket")
        socket.emit("client-update-players", {
          success: false,
          message: e.toString()
        })
      }
    })

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
            universeData: universeData
          }
        })

      } catch (e) {
        console.error(e)
        socket.emit("client-update-players", {
          success: false,
          message: e.toString()
        })
      }
    })

  });
};
