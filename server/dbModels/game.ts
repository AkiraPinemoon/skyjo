import mongoose from "mongoose"
import { shema as user } from "./user"

const shema = new mongoose.Schema(
    {
        owner: { type: user },
        players: { type: Array<typeof user>, default: [] },
        state: { type: String, default: "SETUP" },
        data: { type: Object, default: {} },
    },
    {
        timestamps: true,
        strict: true,
        strictQuery: true,
    }
)

export default mongoose.model("Game", shema, "game")
export { shema }
