import { game } from "@/server/dbModels/index";

// returns a list of open games in SETUP phase
export default defineEventHandler(async () => {
  return (await game.find({ phase: "SETUP" })).map((g) => {
    return {
      owner: g.owner,
      playercount: g.players.length + 1,
      id: g._id,
    };
  });
});
