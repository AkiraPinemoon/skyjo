import { player } from "@/server/dbModels/index";
import { v4 } from "uuid";

// Creates a new player with the given username and assigns an id & secret
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string,
  }>(event);

  const newPlayer = await player.create({
    username: body.username,
    secret: v4(),
    socketId: null,
    gameId: null,
  });

  await newPlayer.save();

  return {
    username: newPlayer.username,
    secret: newPlayer.secret,
    socketId: newPlayer.socketId,
    gameId: newPlayer.gameId,
    playerId: newPlayer._id,
  }
})
