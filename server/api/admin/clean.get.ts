import { game } from "@/server/dbModels/index";

export default defineEventHandler(async () => {
  await game.deleteMany();
});
