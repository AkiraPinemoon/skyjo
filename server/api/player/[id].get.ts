import { player } from "@/server/dbModels/index";

// Creates a new player with the given username and assigns an id & secret
export default defineEventHandler(async (event) => {
  const id = await getRouterParam(event, "id")

  const thePlayer = await player.findById(id);
  if (!thePlayer) return {};

  if (thePlayer.gameId) {
    return {
      state: "INGAME",
      gameId: thePlayer.gameId,
    }
  } else {
    return {
      state: "IDLE",
    }
  }
})
