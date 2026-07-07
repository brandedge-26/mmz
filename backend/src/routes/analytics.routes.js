import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getAnalytics);

export default router;
