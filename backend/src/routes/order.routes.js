import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder, trackOrder } from "../controllers/order.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Optional auth: if no Authorization header present, skip auth and continue as guest.
// If header is present, run full authMiddleware (validates token, attaches req.user).
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next();
  authMiddleware(req, res, next);
};

router.post("/",                    optionalAuth,                    createOrder);
router.get("/my",                   authMiddleware,                  getUserOrders);
router.get("/",                     authMiddleware, adminMiddleware, getAllOrders);
router.get("/track/:orderNumber",                                    trackOrder);
router.patch("/:id/status",         authMiddleware, adminMiddleware, updateOrderStatus);
router.delete("/:id",               authMiddleware, adminMiddleware, deleteOrder);
router.get("/:id",                                                   getOrderById);

export default router;
