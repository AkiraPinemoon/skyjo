import type { NitroApp } from "nitropack";
import mongoose from "mongoose";

export default defineNitroPlugin(async (nitroApp: NitroApp) => {
  const mongoUrl = process.env.MONGO_URL || "mongodb://admin:admin@db:27017";

  console.log("connecting to", mongoUrl);
  try {
    await mongoose.connect(mongoUrl);
    console.log("DB connection established.");
  } catch (err) {
    console.error("DB connection failed.", err);
  }
});
