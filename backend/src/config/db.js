import mongoose from "mongoose";
import { ENV } from "./envs.js";



const connectionOptions = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

// Cached connection for serverless environments (Vercel)
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}



export const connectDB = async () => {

    const DB_URL = ENV.DB_URL;

    if (!DB_URL) {
        throw new Error("DB_URL environment variable is missing!");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(DB_URL, connectionOptions).then((mongooseInstance) => {
            console.log(`MongoDB Connected`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};