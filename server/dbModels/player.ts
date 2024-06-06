import mongoose from "mongoose";

const shema = new mongoose.Schema(
  {
    username: String,
    socketId: String,
  },
  {
    _id: false,
    strict: true,
    strictQuery: true,
  }
);

export default mongoose.model("Player", shema, "player");
export { shema };
