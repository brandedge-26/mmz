import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./passport/auth.passport.js";
import { connectDB } from "./config/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { ENV } from "./config/envs.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes  from "./routes/review.routes.js";
import cartRoutes    from "./routes/cart.routes.js";
import orderRoutes        from "./routes/order.routes.js";
import dashboardRoutes    from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import promoRoutes        from "./routes/promo.routes.js";
import analyticsRoutes    from "./routes/analytics.routes.js";




// DB CONNECTION
try {
    await connectDB();
} catch (err) {
    console.error("DB Connection Failed:", err.message);
}




// EXPRESS APP
export const app = express();




// COOKIE PARSING
app.use(cookieParser());

// PASSPORT
app.use(passport.initialize());



// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// CORS CONFIGURATION
const ALLOWED_ORIGINS = (ENV.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

if (!ALLOWED_ORIGINS.includes("http://localhost:3002")) {
  ALLOWED_ORIGINS.push("http://localhost:3002");
}
if (!ALLOWED_ORIGINS.includes("http://localhost:3001")) {
  ALLOWED_ORIGINS.push("http://localhost:3001");
}

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
app.use("/api/products",     productRoutes);
app.use("/api/reviews",      reviewRoutes);
app.use("/api/cart",         cartRoutes);
app.use("/api/orders",       orderRoutes);
app.use("/api/dashboard",    dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/promos",       promoRoutes);
app.use("/api/analytics",   analyticsRoutes);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);