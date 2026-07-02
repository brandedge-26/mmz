import { Router } from "express";
import {
  createProduct, getAllProducts, getProductBySlug,
  getProductById, updateProduct, deleteProduct,
} from "../controllers/product.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { uploadProduct } from "../config/multer.js";

const router = Router();

const productUpload = uploadProduct.fields([
  { name: "image",         maxCount: 1  },
  { name: "variantImages", maxCount: 10 },
]);

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",           getAllProducts);
router.get("/:slug",      getProductBySlug);

// ── Admin only ────────────────────────────────────────────────────────────────
router.use(authMiddleware, adminMiddleware);

router.post("/",          productUpload, createProduct);
router.get("/id/:id",     getProductById);
router.patch("/:id",      productUpload, updateProduct);
router.delete("/:id",     deleteProduct);

export default router;
