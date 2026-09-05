import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import { ENV } from "../config/envs.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/cloudinary/sign?folder=mmz/products
router.get("/sign", authMiddleware, adminMiddleware, (req, res) => {
    const folder    = req.query.folder || "mmz/products";
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        ENV.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        signature,
        cloudName: ENV.CLOUDINARY_CLOUD_NAME,
        apiKey:    ENV.CLOUDINARY_API_KEY,
        folder,
    });
});

export default router;
