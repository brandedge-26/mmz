import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// ── Product image uploads ─────────────────────────────────────────────────────
const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          "mmz/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        format:          "webp",          // convert every upload to WebP
        transformation: [
            { width: 800, height: 800, crop: "limit" },   // cap dimensions
            { quality: "auto:good" },                      // smart compression
            { fetch_format: "auto" },                      // serve best format per browser
            { flags: "strip_profile" },                    // remove EXIF/metadata
            { effect: "sharpen:60" },                      // slight sharpening after resize
        ],
    },
});

export const uploadProduct = multer({
    storage: productStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed."));
    },
});

// ── Banner image uploads ──────────────────────────────────────────────────────
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          "mmz/banners",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        format:          "webp",
        transformation: [
            { width: 1920, height: 800, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
            { flags: "strip_profile" },
        ],
    },
});

export const uploadBanner = multer({
    storage: bannerStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed."));
    },
});