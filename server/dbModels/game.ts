import mongoose from "mongoose";
import { shema as playerShema } from "./player";

const shema = new mongoose.Schema(
  {
    owner: playerShema,
    players: [playerShema],
    state: { type: String, default: "SETUP" },
    data: { type: Object, default: {} },
  },
  {
    strict: true,
    strictQuery: true,
  }
);

export default mongoose.model("Game", shema, "game");
export { shema };
