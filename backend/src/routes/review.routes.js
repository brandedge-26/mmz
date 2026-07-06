import { Router } from "express";
import { createReview, getProductReviews, deleteReview, getAllReviews } from "../controllers/review.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getProductReviews);

// Auth required
router.post("/", authMiddleware, createReview);

// Admin only
router.get("/all",    authMiddleware, adminMiddleware, getAllReviews);
router.delete("/:id", authMiddleware, adminMiddleware, deleteReview);

export default router;
