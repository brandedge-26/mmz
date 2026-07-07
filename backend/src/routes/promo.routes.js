import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { validatePromo, getPromos, createPromo, togglePromo, deletePromo } from "../controllers/promo.controller.js";

const router = Router();

// Shop — authenticated user
router.post("/validate", authMiddleware, validatePromo);

// Admin only
router.get("/",              authMiddleware, adminMiddleware, getPromos);
router.post("/",             authMiddleware, adminMiddleware, createPromo);
router.patch("/:id/toggle",  authMiddleware, adminMiddleware, togglePromo);
router.delete("/:id",        authMiddleware, adminMiddleware, deletePromo);

export default router;
