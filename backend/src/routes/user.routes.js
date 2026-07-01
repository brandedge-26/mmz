import { Router } from "express";
import { updateProfile, updatePassword, getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.patch("/profile",  updateProfile);
router.patch("/password", updatePassword);

// Admin only
router.get("/",       adminMiddleware, getAllUsers);
router.delete("/:id", adminMiddleware, deleteUser);

export default router;
