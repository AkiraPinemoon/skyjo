import type { NitroApp } from "nitropack";
import mongoose from "mongoose";

const config = useRuntimeConfig()

export default defineNitroPlugin(async (nitroApp: NitroApp) => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("DB connection established.");
    } catch (err) {
        console.error("DB connection failed.", err);
    }
})
