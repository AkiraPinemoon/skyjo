import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { game } from "@/server/dbModels/index";
import { getNextPlayerId, maskPlayfield, objectMap, revealPlayfield } from "@/server/util";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  // connection handler
  io.on("connection", (socket) => {
    console.log("SocketIo connection from " + socket.id);

    // handle authentification
    if (typeof socket.handshake.auth.username !== "string") {
      console.log("SocketIo auth error from " + socket.id);
      socket.disconnect();
    }

    socket.data.gameId = null;

    // register logging middleware
    socket.use(([event, ...args], next) => {
      console.log("SocketIo event " + event + " from " + socket.id);

      next();
    });

    // disconnection handler
    socket.on("disconnect", async () => {
      console.log("SocketIo disconnection from " + socket.id);
      // return early if player isn't in a game
      if (!socket.data.gameId) return;

      // find game
      let theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // advance currentPlayerId if it's the players turn
      if (theGame.phase == "INITIALREVEAL") {
        if (theGame.data.currentPlayerId == socket.id) {
          theGame.data.currentPlayerId = getNextPlayerId(theGame);
          theGame.markModified("data");
        }
      }

      // run if the player owns the game
      if (theGame.owner?.socketId == socket.id.toString()) {
        // run if there are other players
        if (theGame.players.length > 0) {
          // make another user owner
          theGame.owner = (await theGame.players.pop()) as {
            username: string;
            socketId: string;
          };
        } else {
          // delete game if there are no other players
          await theGame.deleteOne();
          return;
        }
      } else {
        // if player doesn't own game remove from players
        theGame.players.pull({ socketId: socket.id });
      }

      await theGame.save();
      theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // notify room
      socket.broadcast.in(theGame._id.toString()).emit("patch", {
        players: theGame.players,
        owner: theGame.owner,
        data: {
          currentPlayerId: theGame.data.currentPlayerId,
          playfields: objectMap(theGame.data.playfields, maskPlayfield),
        },
      });
    });

    // host game handler
    socket.on("host_game", async () => {
      // return early if player is already in a game
      if (socket.data.gameId) return;

      // create new game
      let newGame = await game.create({
        owner: {
          username: socket.handshake.auth.username,
          socketId: socket.id,
        },
      });

      // join room
      socket.join(newGame._id.toString());

      // send data to frontend
      socket.emit("game_joined", {
        id: newGame._id,
        owner: newGame.owner,
        players: newGame.players,
        phase: newGame.phase,
      });

      // store gameId in socket
      socket.data.gameId = newGame._id.toString();
    });

    // join game handler
    socket.on("join_game", async (gameId: string) => {
      // return early if player is already in a game
      if (socket.data.gameId) return;

      // return early if game doesn't exist
      let theGame = await game.findById(gameId);
      if (!theGame) return;

      // add player to players
      theGame.players.push({
        username: socket.handshake.auth.username,
        socketId: socket.id,
      });
      await theGame.save();

      // join room
      socket.join(gameId);

      // send data to frontend
      socket.emit("game_joined", {
        id: theGame._id,
        owner: theGame.owner,
        players: theGame.players,
        phase: theGame.phase,
      });

      // inform room of new player
      socket.broadcast.in(gameId).emit("patch", { players: theGame.players });

      // store gameId in socket
      socket.data.gameId = gameId;
    });

    // start game handler
    socket.on("start_game", async () => {
      // return early if player isn"t in a game
      if (!socket.data.gameId) return;

      // return early if the game can't be found or isn't owned by player
      let theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;
      if (theGame.owner?.socketId != socket.id) return;

      // create stack
      let stack: number[] = [];
      stack = stack.concat(Array(5).fill(-2));
      stack = stack.concat(Array(10).fill(-1));
      stack = stack.concat(Array(15).fill(0));
      stack = stack.concat(Array(10).fill(1));
      stack = stack.concat(Array(10).fill(2));
      stack = stack.concat(Array(10).fill(3));
      stack = stack.concat(Array(10).fill(4));
      stack = stack.concat(Array(10).fill(5));
      stack = stack.concat(Array(10).fill(6));
      stack = stack.concat(Array(10).fill(7));
      stack = stack.concat(Array(10).fill(8));
      stack = stack.concat(Array(10).fill(9));
      stack = stack.concat(Array(10).fill(10));
      stack = stack.concat(Array(10).fill(11));
      stack = stack.concat(Array(10).fill(12));

      // shuffle stack
      stack = stack
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      // deal cards
      let playfields: any = {};

      playfields[theGame.owner.socketId] = [
        [
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
        ],
        [
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
        ],
        [
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
        ],
        [
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
          { value: stack.pop(), isVisible: false },
        ],
      ];

      for (const player of theGame.players) {
        playfields[player.socketId] = [
          [
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
          ],
          [
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
          ],
          [
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
          ],
          [
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
            { value: stack.pop(), isVisible: false },
          ],
        ];
      }

      // flip card onto discard pile
      const lastcard = stack.pop();

      // initialize data
      theGame.data = {
        stack,
        playfields,
        lastcard,
        currentPlayerId: theGame.owner.socketId,
      };

      // set phase
      theGame.phase = "INITIALREVEAL";

      // save game
      await theGame.save();

      // construct public data
      const publicData = {
        lastcard: theGame.data.lastcard,
        currentPlayerId: theGame.data.currentPlayerId,
        playfields: objectMap(theGame.data.playfields, maskPlayfield),
      };

      // notify room
      io.in(theGame._id.toString()).emit("patch", {
        phase: theGame.phase,
        data: publicData,
      });
    });

    // card selected handler
    socket.on("card_selected", async (column, row) => {
      // return early if player isn"t in a game
      if (!socket.data.gameId) return;

      // return early if the game can't be found
      let theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // return early is it isn't the player's turn
      if (theGame.data.currentPlayerId != socket.id) return;

      // handle INITIALREVEAL phase
      if (theGame.phase == "INITIALREVEAL") {
        // return early if selected card is already visible
        if (theGame.data.playfields[socket.id][column][row].isVisible) return;

        theGame.data.playfields[socket.id][column][row].isVisible = true;
        theGame.data.currentPlayerId = getNextPlayerId(theGame);
        theGame.markModified("data");
        await theGame.save();

        // check if initial reveal is done
        let isDone = true;

        for (const player of (
          theGame.players as {
            username: string;
            socketId: string;
          }[]
        ).concat(theGame.owner)) {
          const visibleAmount = (
            theGame.data.playfields[player.socketId] as [
              [{ value: number; isVisible: boolean }]
            ]
          )
            .flat()
            .map((slot) => slot.isVisible)
            .filter(Boolean).length;

          if (visibleAmount != 2) {
            isDone = false;
            break;
          }
        }

        // run if INITIALREVEAL is done
        if (isDone) {
          // change phase
          theGame.phase = "DRAW";
          await theGame.save();

          // construct public data
          const publicData = {
            currentPlayerId: theGame.data.currentPlayerId,
            playfields: objectMap(theGame.data.playfields, maskPlayfield),
          };

          // notify room
          io.in(theGame._id.toString()).emit("patch", {
            data: publicData,
            phase: theGame.phase,
          });

          return;
        }

        // construct public data
        const publicData = {
          currentPlayerId: theGame.data.currentPlayerId,
          playfields: objectMap(theGame.data.playfields, maskPlayfield),
        };

        // notify room
        io.in(theGame._id.toString()).emit("patch", {
          data: publicData,
        });
      }
      // handle DECIDE phase and REPLACE phase
      else if (theGame.phase == "DECIDE" || theGame.phase == "REPLACE") {
        // replace card
        theGame.data.lastcard =
          theGame.data.playfields[socket.id][column][row].value;
        theGame.data.playfields[socket.id][column][row].isVisible = true;
        theGame.data.playfields[socket.id][column][row].value =
          theGame.data.currentCard;
        theGame.data.currentCard = null;
        theGame.markModified("data");

        // check if column can be cleared
        theGame.data.playfields[socket.id] = theGame.data.playfields[
          socket.id
        ].filter((column: { value: number; isVisible: boolean }[]) => {
          if (!column[0].isVisible || !column[1].isVisible || !column[2].isVisible) return true;
          const val = column[0].value;
          if (column[1].value != val) return true;
          if (column[2].value != val) return true;
          theGame.data.lastcard = null;
          theGame.markModified("data");
          return false;
        });

        // advance currentPlayerId
        theGame.data.currentPlayerId = getNextPlayerId(theGame);
        theGame.markModified("data");

        // check if game is finished
        const hiddenCount = (
          theGame.data.playfields[theGame.data.currentPlayerId] as [
            [{ value: number; isVisible: boolean }]
          ]
        )
          .flat()
          .map((slot) => !slot.isVisible)
          .filter(Boolean).length;

        if (hiddenCount == 0) {
          // change phase
          theGame.phase = "END";
          theGame.data.playfields = objectMap(theGame.data.playfields, revealPlayfield)
          theGame.markModified("data");

          await theGame.save();

          // construct public data
          const publicData = {
            currentCard: theGame.data.currentCard,
            lastcard: theGame.data.lastcard,
            currentPlayerId: theGame.data.currentPlayerId,
            playfields: objectMap(theGame.data.playfields, maskPlayfield),
          };

          // notify room
          io.in(theGame._id.toString()).emit("patch", {
            data: publicData,
            phase: theGame.phase,
          });

          return;
        }

        // change phase
        theGame.phase = "DRAW";

        await theGame.save();

        // construct public data
        const publicData = {
          currentCard: theGame.data.currentCard,
          lastcard: theGame.data.lastcard,
          currentPlayerId: theGame.data.currentPlayerId,
          playfields: objectMap(theGame.data.playfields, maskPlayfield),
        };

        // notify room
        io.in(theGame._id.toString()).emit("patch", {
          data: publicData,
          phase: theGame.phase,
        });
      }
      // handle REVEAL phase
      else if (theGame.phase == "REVEAL") {
        // return early if selected card is already visible
        if (theGame.data.playfields[socket.id][column][row].isVisible) return;

        // reveal card
        theGame.data.playfields[socket.id][column][row].isVisible = true;
        theGame.markModified("data");

        // TODO: check if column can be cleared
        theGame.data.playfields[socket.id] = theGame.data.playfields[
          socket.id
        ].filter((column: { value: number; isVisible: boolean }[]) => {
          if (!column[0].isVisible || !column[1].isVisible || !column[2].isVisible) return true;
          const val = column[0].value;
          if (column[1].value != val) return true;
          if (column[2].value != val) return true;
          theGame.data.lastcard = null;
          theGame.markModified("data");
          return false;
        });

        // advance currentPlayerId
        theGame.data.currentPlayerId = getNextPlayerId(theGame);
        theGame.markModified("data");

        // check if game is finished
        const hiddenCount = (
          theGame.data.playfields[theGame.data.currentPlayerId] as [
            [{ value: number; isVisible: boolean }]
          ]
        )
          .flat()
          .map((slot) => !slot.isVisible)
          .filter(Boolean).length;

        if (hiddenCount == 0) {
          // change phase
          theGame.phase = "END";
          theGame.data.playfields = objectMap(theGame.data.playfields, revealPlayfield)
          theGame.markModified("data");

          await theGame.save();

          // construct public data
          const publicData = {
            currentCard: theGame.data.currentCard,
            lastcard: theGame.data.lastcard,
            currentPlayerId: theGame.data.currentPlayerId,
            playfields: objectMap(theGame.data.playfields, maskPlayfield),
          };

          // notify room
          io.in(theGame._id.toString()).emit("patch", {
            data: publicData,
            phase: theGame.phase,
          });

          return;
        }

        // change phase
        theGame.phase = "DRAW";

        await theGame.save();

        // construct public data
        const publicData = {
          currentCard: theGame.data.currentCard,
          lastcard: theGame.data.lastcard,
          currentPlayerId: theGame.data.currentPlayerId,
          playfields: objectMap(theGame.data.playfields, maskPlayfield),
        };

        // notify room
        io.in(theGame._id.toString()).emit("patch", {
          data: publicData,
          phase: theGame.phase,
        });
      }
    });

    // draw selected handler
    socket.on("draw_selected", async () => {
      // return early if player isn"t in a game
      if (!socket.data.gameId) return;

      // return early if the game can't be found
      let theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // return early if the phase isn't DRAW
      if (theGame.phase != "DRAW") return;

      // return early is it isn't the player's turn
      if (theGame.data.currentPlayerId != socket.id) return;

      // draw card from stack
      theGame.data.currentCard = theGame.data.stack.pop();
      theGame.markModified("data");

      // change phase
      theGame.phase = "DECIDE";

      await theGame.save();

      // construct public data
      const publicData = {
        currentCard: theGame.data.currentCard,
      };

      // notify room
      io.in(theGame._id.toString()).emit("patch", {
        data: publicData,
        phase: theGame.phase,
      });
    });

    // discard selected handler
    socket.on("discard_selected", async () => {
      // return early if player isn"t in a game
      if (!socket.data.gameId) return;

      // return early if the game can't be found
      let theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // return early if it isn't the player's turn
      if (theGame.data.currentPlayerId != socket.id) return;

      // handle DRAW phase
      if (theGame.phase == "DRAW") {
        // return early if there is no lastcard
        if (theGame.data.lastcard == null) return;

        // draw card from stack
        theGame.data.currentCard = theGame.data.lastcard;
        theGame.data.lastcard = null;
        theGame.markModified("data");

        // change phase
        theGame.phase = "REPLACE";

        await theGame.save();

        // construct public data
        const publicData = {
          currentCard: theGame.data.currentCard,
          lastcard: theGame.data.lastcard,
        };

        // notify room
        io.in(theGame._id.toString()).emit("patch", {
          data: publicData,
          phase: theGame.phase,
        });
      }
      // handle DECIDE phase
      else if (theGame.phase == "DECIDE") {
        // discard card
        theGame.data.lastcard = theGame.data.currentCard;
        theGame.data.currentCard = null;
        theGame.markModified("data");

        // change phase
        theGame.phase = "REVEAL";

        await theGame.save();

        // construct public data
        const publicData = {
          currentCard: theGame.data.currentCard,
          lastcard: theGame.data.lastcard,
        };

        // notify room
        io.in(theGame._id.toString()).emit("patch", {
          data: publicData,
          phase: theGame.phase,
        });
      }
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          const nodeContext = peer.ctx.node;
          const req = nodeContext.req;

          // @ts-expect-error private method
          engine.prepare(req);

          const rawSocket = nodeContext.req.socket;
          const websocket = nodeContext.ws;

          // @ts-expect-error private method
          engine.onWebSocket(req, rawSocket, websocket);
        },
      },
    })
  );
});
