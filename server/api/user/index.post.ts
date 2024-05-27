import { user } from "@/server/dbModels/index"
import { v4 } from "uuid"

interface IRequestBody {
    name: string,
}

export default defineEventHandler(async (event) => {
    try {
        const { name } = await readBody<IRequestBody>(event)

        const newUser = await user.create({
            name,
            secret: v4(),
        })

        return {
            name: newUser.name,
            id: newUser._id,
            secret: newUser.secret,
        }
    } catch (err) {
        console.dir(err);
        event.node.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
})
