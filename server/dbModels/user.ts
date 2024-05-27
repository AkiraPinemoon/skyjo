import mongoose from "mongoose"

const shema = new mongoose.Schema(
    {
        name: String,
        secret: String
    },
    {
        timestamps: true,
        strict: true,
        strictQuery: true,
    }
)

export default mongoose.model("User", shema, "user")
export { shema }
