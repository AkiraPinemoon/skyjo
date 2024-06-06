import { game } from "@/server/dbModels/index";

export default defineEventHandler(async () => {
  return (await game.find({ state: "SETUP" })).map((g) => {
    return {
      owner: g.owner,
      playercount: g.players.length + 1,
      id: g._id,
    };
  });
});
