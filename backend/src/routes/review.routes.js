import { Router } from "express";
import { createReview, getProductReviews, deleteReview } from "../controllers/review.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getProductReviews);

// Auth required
router.post("/", authMiddleware, createReview);

// Admin only
router.delete("/:id", authMiddleware, adminMiddleware, deleteReview);

export default router;
