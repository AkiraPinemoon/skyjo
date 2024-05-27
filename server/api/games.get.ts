import { game } from "@/server/dbModels/index.ts"

export default defineEventHandler((event) => {
    return game.find()
});
