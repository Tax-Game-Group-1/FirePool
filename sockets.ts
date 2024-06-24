import { Server, Socket } from "socket.io";
import {
  getGameInstanceByGameCode,
  removeWaitingPlayerFromAllGameInstancesBySocket,
} from "server";
import {
  PlayerChosenForAudit,
  PlayerInWaitingRoom,
} from "&/gameManager/interfaces";
import { Game, Universe } from "&/gameManager/gameManager";

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

      let game: Game;
      if (code != null) game = getGameInstanceByGameCode(code);
      let universe: Universe | null;
      if (params.universeId != null) {
        universe = game.getUniverseById(params.universeId);
        if (universe == null) throw "cannot find universe";
      }

      let hasPaidInterval;

      try {
        switch (a) {
          case Action.ASSIGN_NAME:
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

            break;

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

            universe.minister.setTaxRate(game, params.taxRate);
            universe.resetHasPaidForAllCitizens();
            game.resetAudit();
            hasPaidInterval = setInterval(() => {
              if (game.allHavePaid()) {
                //reset paid for all universes
                game.resetAllHavePaid();
                //send socket to client to say that they have paid
                game.emitMessageToPlayers("client-paid-tax", {
                  success: true,
                  data: game.getDeclaredVsPaidTaxForAllUniverses(),
                });
                clearInterval(hasPaidInterval);
              }
            }, 2500);

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

            universe.citizenPayTax(
              params.playerId,
              params.declared,
              params.received,
              params.calculatedTax
            );

            break;

          case Action.AUDIT_ALL_PLAYERS:
            if (params.code == null)
              throw "cannot audit players because game code is null";
            const playersAudited: PlayerChosenForAudit[] =
              game.auditAllPlayers();
            game.emitMessageToPlayers("audit-all-players", {
              success: true,
              data: playersAudited,
            });
            return;

          //doSocketAction(Action.REDISTRIBUTE, { universeId, code, amount }, code)
          case Action.REDISTRIBUTE:
            if (game == null) throw "invalid game code";
            if (universe == null)
              throw "cannot redistribute because universe id returned null";
            if (params.redistributionPercentage == null)
              throw "cannot redistribute, because percentage is null";

            try {
              universe.divideTaxAmongPlayers(params.redistributionPercentage);
            } catch (e) {
              if (e == "minister loses") {
                //todo: implement
                throw "minister loses! unimplemented in sockets.ts";
              } else {
                game.emitMessageToPlayers("audit-all-players", {
                  success: false,
                  message: e.tostring(),
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

    socket.on("set-tax-rate", ({ code, taxRate, universeId }) => {
      doSocketAction(Action.SET_TAX_RATE, { taxRate, universeId }, code);
    });

    socket.on("pay-tax", ({ code, declared, received, universeId }) => {
      doSocketAction(
        Action.CITIZENS_PAY_TAX,
        { declared, received, universeId },
        code
      );
    });

    socket.on("sign-consent", ({ playerId, hasConsented, code }) => {
      doSocketAction(Action.CONSENT, { playerId, hasConsented }, code);
    });

    socket.on("update-name", ({ name, waitingId, code }) => {
      doSocketAction(Action.ASSIGN_NAME, { waitingId, name }, code);
    });

    socket.on("update-ready", ({ waitingId, ready, code }) => {
      doSocketAction(Action.UPDATE_READY, { waitingId, ready }, code);
    });

    socket.on("audit-all-players", ({ code }) => {});

    socket.on("redistribute", ({ universeId, code, amount }) => {
      doSocketAction(Action.REDISTRIBUTE, { universeId, code, amount }, code);
    });

    socket.on("disconnect", () => {
      console.log("player disconnected");
      try {
        const gameInstance = removeWaitingPlayerFromAllGameInstancesBySocket(
          socket.id
        );
        doSocketAction(Action.DISCONNECT, {}, gameInstance.gameCode);
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
          message: e.toString(),
        });
      }
    });
  });
};
