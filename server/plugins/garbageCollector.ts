import { user, game } from "@/server/dbModels/index"

export default defineNitroPlugin((nitroApp) => {
    setInterval(async () => {
        console.log("Begin deleting old data")
        const oneHourAgo = new Date(Date.now() - 60 * 1000);

        const deleted_users = await user.deleteMany({ updatedAt: { $lt: oneHourAgo } });
        console.log(`Deleted ${deleted_users.deletedCount} users`);

        const deleted_games = await game.deleteMany({ updatedAt: { $lt: oneHourAgo } });
        console.log(`Deleted ${deleted_games.deletedCount} games`);

        console.log("Done deleting old data")
    }, 10000)
})
