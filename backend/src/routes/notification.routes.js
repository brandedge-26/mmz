import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { getNotifications, getUnreadCount, markRead, markAllRead, deleteNotification, deleteAllNotifications } from "../controllers/notification.controller.js";

const router = Router();

router.get("/",             authMiddleware, adminMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, adminMiddleware, getUnreadCount);
router.patch("/read-all",   authMiddleware, adminMiddleware, markAllRead);
router.delete("/all",       authMiddleware, adminMiddleware, deleteAllNotifications);
router.patch("/:id/read",   authMiddleware, adminMiddleware, markRead);
router.delete("/:id",       authMiddleware, adminMiddleware, deleteNotification);

export default router;
