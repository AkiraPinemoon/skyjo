import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { game } from "@/server/dbModels/index";

async function removePlayer(socketId: String) {
  const playingGames = await game.find({ "players.socketId": socketId });

  for (const playingGame of playingGames) {
    console.log(`Deleting game ${playingGame._id}`);
    playingGame.players.pull({ socketId: socketId });
  }

  const ownedGames = await game.find({ "owner.socketId": socketId });

  for (const ownedGame of ownedGames) {
    console.log(`Deleting game ${ownedGame._id}`);
    if (ownedGame.players.length > 0) {
      ownedGame.owner = ownedGame.players.pop();
      await ownedGame.save();
    } else {
      await ownedGame.deleteOne();
    }
  }
}

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
      // remove player from games
      const theGame = await game.findById(socket.data.gameId);
      if (!theGame) return;
      if (theGame.owner?.socketId == socket.id.toString()) {
        if (theGame.players.length > 0) {
          theGame.owner = await theGame.players.pop();
          await theGame.save();
          socket.broadcast
            .in(theGame._id.toString())
            .emit("player_left", theGame.players);
          socket.broadcast
            .in(theGame._id.toString())
            .emit("new_owner", theGame.owner);
        } else {
          await theGame.deleteOne();
        }
      } else {
        theGame.players.pull({ socketId: socket.id });
        await theGame.save();
        const updatedGame = await game.findById(theGame._id);
        if (!updatedGame) return;
        socket.broadcast
          .in(theGame._id.toString())
          .emit("player_left", updatedGame.players);
      }
    });

    // host game handler
    socket.on("host_game", async () => {
      if (socket.data.gameId) return;
      let newGame = await game.create({
        owner: {
          username: socket.handshake.auth.username,
          socketId: socket.id,
        },
      });
      socket.join(newGame._id.toString());
      socket.emit("game_joined", {
        id: newGame._id,
        owner: newGame.owner,
        players: newGame.players,
        state: newGame.state,
      });
      socket.data.gameId = newGame._id.toString();
    });

    // join game handler
    socket.on("join_game", async (gameId: string) => {
      if (socket.data.gameId) return;
      let theGame = await game.findById(gameId);
      if (!theGame) return;
      theGame.players.push({
        username: socket.handshake.auth.username,
        socketId: socket.id,
      });
      await theGame.save();
      socket.join(gameId);
      socket.emit("game_joined", {
        id: theGame._id,
        owner: theGame.owner,
        players: theGame.players,
        state: theGame.state,
      });
      socket.broadcast.in(gameId).emit("player_joined", theGame.players);
      socket.data.gameId = gameId;
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
