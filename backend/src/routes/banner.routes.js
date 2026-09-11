import { Router } from "express";
import { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } from "../controllers/banner.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getBanners);

// Admin
router.get("/all",    authMiddleware, adminMiddleware, getAllBanners);
router.post("/",      authMiddleware, adminMiddleware, createBanner);
router.put("/:id",    authMiddleware, adminMiddleware, updateBanner);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBanner);

export default router;
