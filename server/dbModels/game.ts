import mongoose from "mongoose"

const shema = new mongoose.Schema(
    {
        owner: {
            username: String,
            socketId: String,
        },
        players: [{
            username: String,
            socketId: String,
        }],
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
