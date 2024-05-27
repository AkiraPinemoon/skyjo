import { user } from "@/server/dbModels/index"

export default defineEventHandler(async (event) => {
    try {
        const { id } = getRouterParams(event)

        const theUser = await user.findById(id)

        return theUser ? {
            name: theUser.name,
            id: theUser._id,
        } : null
    } catch (err) {
        console.dir(err);
        event.node.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
})
