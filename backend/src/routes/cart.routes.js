import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCart, syncCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/",     authMiddleware, getCart);
router.post("/sync", authMiddleware, syncCart);

export default router;
