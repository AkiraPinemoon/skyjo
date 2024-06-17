import mongoose from "mongoose";

const shema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    secret: { type: String, required: true },
    socketId: { type: String, required: false },
    gameId: { type: String, required: false },
  },
  {
    _id: true,
    strict: true,
    strictQuery: true,
  }
);

export default mongoose.model("Player", shema, "player");
export { shema };
