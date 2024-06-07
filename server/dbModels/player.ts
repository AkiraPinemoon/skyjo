import mongoose from "mongoose";

const shema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    socketId: { type: String, required: true },
  },
  {
    _id: false,
    strict: true,
    strictQuery: true,
  }
);

export default mongoose.model("Player", shema, "player");
export { shema };
