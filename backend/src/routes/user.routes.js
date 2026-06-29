import { Router } from "express";
import { updateProfile, updatePassword } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.patch("/profile",  updateProfile);
router.patch("/password", updatePassword);

export default router;
