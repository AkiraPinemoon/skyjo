import mongoose from "mongoose";
import { shema as playerShema } from "./player";

const shema = new mongoose.Schema(
  {
    owner: { type: playerShema, required: true },
    players: { type: [playerShema], required: true },
    phase: { type: String, default: "SETUP", required: true },
    data: { type: Object, default: {} },
  },
  {
    strict: true,
    strictQuery: true,
  }
);

export default mongoose.model("Game", shema, "game");
export { shema };
