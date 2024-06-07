import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { game } from "@/server/dbModels/index";
import { getNextPlayerId, maskPlayfield, objectMap } from "@/server/util";

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
      const theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;

      // run if the player owns the game
      if (theGame.owner?.socketId == socket.id.toString()) {
        // run if there are other players
        if (theGame.players.length > 0) {
          // make another user owner
          theGame.owner = (await theGame.players.pop()) as {
            username: string;
            socketId: string;
          };
          await theGame.save();

          socket.broadcast
            .in(theGame._id.toString())
            .emit("player_left", theGame.players);
          socket.broadcast
            .in(theGame._id.toString())
            .emit("new_owner", theGame.owner);
        } else {
          // delete game if there are no other players
          await theGame.deleteOne();
        }
      } else {
        // if player doesn't own game remove from players
        theGame.players.pull({ socketId: socket.id });
        await theGame.save();
        const updatedGame = await game.findById(theGame._id);
        if (!updatedGame) return;

        // inform room of changes
        socket.broadcast
          .in(theGame._id.toString())
          .emit("player_left", updatedGame.players);
      }
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
      socket.broadcast.in(gameId).emit("player_joined", theGame.players);

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

      // initialize data
      theGame.data = {
        stack,
        playfields,
        lastcard: null,
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
      io.in(theGame._id.toString()).emit("game_started", {
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

      switch (theGame.phase) {
        case "INITIALREVEAL":
          // return early is it isn't the player's turn
          if (theGame.data.currentPlayerId != socket.id) return;

          // return early if selected card is already visible
          if (theGame.data.playfields[socket.id][column][row].isVisible) return;

          theGame.data.playfields[socket.id][column][row].isVisible = true;
          theGame.data.currentPlayerId = getNextPlayerId(theGame);
          theGame.markModified("data");
          await theGame.save();
          
          // construct public data
          const publicData = {
            currentPlayerId: theGame.data.currentPlayerId,
            playfields: objectMap(theGame.data.playfields, maskPlayfield),
          };

          // notify room
          io.in(theGame._id.toString()).emit("card_revealed", {
            data: publicData,
          });
          break;

        default:
          break;
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
