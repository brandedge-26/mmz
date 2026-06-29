import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { ENV } from "./config/envs.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";




// DB CONNECTION
await connectDB();




// EXPRESS APP
export const app = express();




// COOKIE PARSING
app.use(cookieParser());



// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// CORS CONFIGURATION
const ALLOWED_ORIGINS = (ENV.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));




// API HEALTH
app.get("/", (req, res) => {
    res.end("API running...");
});

// ROUTES
app.use("/api/auth",         authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact",      contactRoutes);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);