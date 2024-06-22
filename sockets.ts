import { Server, Socket } from "socket.io";
import { getGameInstanceByGameCode, removeWaitingPlayerFromAllGameInstancesBySocket } from "server";
import { PlayerInWaitingRoom } from "&/gameManager/gameManager";

export const setUpSocket = (io: Server) => {
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

    //add the player to the waiting area, create a waitng player
    socket.on("server-roomData", ({ code, hostID, waitingId }) => {
      console.log("recieved by socket");
      console.log(hostID, " ", waitingId, " ", code);

      if (waitingId != null && hostID == null) console.log("Player joined");
      else if (hostID != null) console.log("host joined");
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
        game.emitMessageToPlayerInRoom("client-roomData", {
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

        // socket.emit("client-roomData", {
        //     success: true,
        //     message: "player added to waiting room",
        //     data: {
        //         gameId: game.id,
        //         name: game.name,
        //         roundNumber: game.roundNumber,
        //         taxCoefficient: game.taxCoefficient,
        //         maxPlayers: game.maxPlayers,
        //         playersInRoom: game.getPlayersInWatingRoom()
        //     }
        // });

        return;
      }

      game.assignSocketToHost(socket);

      //host
      game.emitMessageToPlayerInRoom("client-roomData", {
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
    }

    const doSocketAction = (a: Action, params: any, code) => {
        let game; 
        if (code != null)
            game = getGameInstanceByGameCode(code);

      try {
        switch (a) {
          case Action.ASSIGN_NAME:
            if (params.name == null) throw "name is  null";
            game.assignNameToPlayerInWaitingRoom(params.waitingId, params.name);
            break;
          case Action.UPDATE_READY:
            if (params.ready == null) throw "ready is  null";
            game.updateReadyState(params.waitingId, params.ready);
            break;
          case Action.DISCONNECT: 
            console.log("player disconnected")
          default:
        }

        game.emitMessageToPlayerInRoom("client-update-players", {
          success: true,
          data: {
            playersInRoom: game.getPlayersInWaitingRoomAsJSON(),
          },
        });
      } catch (e) {
        socket.emit("client-update-players", {
          success: false,
          message: e.toString(),
        });
      }
    };

    socket.on("update-name", ({ name, waitingId, code }) => {
      console.log("updating name");
      doSocketAction(Action.ASSIGN_NAME, { waitingId, name }, code);
    });

    socket.on("update-ready", ({ waitingId, ready, code }) => {
      console.log("notifying players of ready state on server");
      doSocketAction(Action.UPDATE_READY, { waitingId, ready }, code);
    });

    socket.on("disconnect", () => {
        console.log("player disconnected")
        try {
            const gameInstance = removeWaitingPlayerFromAllGameInstancesBySocket(socket.id);
            doSocketAction(Action.DISCONNECT, {}, gameInstance.gameCode);
        } catch (e) {
            console.error(e);
        }
    })

  });
};
