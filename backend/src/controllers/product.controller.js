import { Product } from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

// Slug generator
const toSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Ensure unique slug (appends -2, -3 … if needed)
const uniqueSlug = async (base, excludeId = null) => {
  let slug = base;
  let count = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Product.findOne(query);
    if (!exists) return slug;
    count++;
    slug = `${base}-${count}`;
  }
};

// Delete a Cloudinary image by URL
const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts    = url.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder   = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${filename}`);
  } catch { /* ignore */ }
};

// ── POST /api/products  (admin) ───────────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, brand, category, price, originalPrice,
      badge, inStock, trending, newArrival,
      description, colors, features, specifications, status,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "name, price and category are required." });
    }

    const slug = await uniqueSlug(toSlug(name));

    const image         = req.files?.image?.[0]?.path         ?? "";
    const variantImages = (req.files?.variantImages ?? []).map((f) => f.path);

    const product = await Product.create({
      name:           name.trim(),
      slug,
      brand:          brand?.trim() ?? "",
      category,
      price:          Number(price),
      originalPrice:  originalPrice ? Number(originalPrice) : null,
      image,
      variantImages,
      badge:          badge && badge !== "None" ? badge : "",
      inStock:        inStock === "true" || inStock === true,
      trending:       trending === "true" || trending === true,
      newArrival:     newArrival === "true" || newArrival === true,
      description:    description?.trim() ?? "",
      colors:         typeof colors === "string" ? JSON.parse(colors) : (colors ?? []),
      features:       typeof features === "string" ? JSON.parse(features) : (features ?? []),
      specifications: typeof specifications === "string" ? JSON.parse(specifications) : (specifications ?? []),
      status:         status ?? "Active",
    });

    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products  (public) ───────────────────────────────────────────────
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20,
      category, brand, badge,
      trending, newArrival, inStock,
      status,
      q, sort = "newest",
    } = req.query;

    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (category)    filter.category  = category;
    if (brand)       filter.brand     = new RegExp(brand, "i");
    if (badge)       filter.badge     = badge;
    if (trending === "true")   filter.trending   = true;
    if (newArrival === "true") filter.newArrival = true;
    if (inStock === "true")    filter.inStock    = true;
    if (q)           filter.name      = new RegExp(q, "i");

    const sortMap = {
      newest:         { createdAt: -1 },
      oldest:         { createdAt: 1  },
      "price-asc":    { price: 1      },
      "price-desc":   { price: -1     },
      "rating-desc":  { rating: -1    },
    };
    const sortObj = sortMap[sort] ?? { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/:slug  (public) ─────────────────────────────────────────
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: "Active" });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/id/:id  (admin) ─────────────────────────────────────────
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/products/:id  (admin) ─────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const {
      name, brand, category, price, originalPrice,
      badge, inStock, trending, newArrival,
      description, colors, features, specifications, status,
    } = req.body;

    if (name && name !== product.name) {
      product.slug = await uniqueSlug(toSlug(name), product._id);
      product.name = name.trim();
    }
    if (brand       !== undefined) product.brand         = brand.trim();
    if (category    !== undefined) product.category      = category;
    if (price       !== undefined) product.price         = Number(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (badge       !== undefined) product.badge         = badge === "None" ? "" : badge;
    if (inStock     !== undefined) product.inStock       = inStock === "true" || inStock === true;
    if (trending    !== undefined) product.trending      = trending === "true" || trending === true;
    if (newArrival  !== undefined) product.newArrival    = newArrival === "true" || newArrival === true;
    if (description !== undefined) product.description   = description.trim();
    if (status      !== undefined) product.status        = status;
    if (colors      !== undefined) product.colors        = typeof colors === "string" ? JSON.parse(colors) : colors;
    if (features    !== undefined) product.features      = typeof features === "string" ? JSON.parse(features) : features;
    if (specifications !== undefined) product.specifications = typeof specifications === "string" ? JSON.parse(specifications) : specifications;

    // New main image
    if (req.files?.image?.[0]) {
      await deleteFromCloudinary(product.image);
      product.image = req.files.image[0].path;
    }

    // Append new variant images
    if (req.files?.variantImages?.length) {
      product.variantImages = [
        ...product.variantImages,
        ...req.files.variantImages.map((f) => f.path),
      ];
    }

    // Remove specific variant images (pass array of URLs in body as removeVariants)
    if (req.body.removeVariants) {
      const toRemove = typeof req.body.removeVariants === "string"
        ? JSON.parse(req.body.removeVariants)
        : req.body.removeVariants;
      for (const url of toRemove) await deleteFromCloudinary(url);
      product.variantImages = product.variantImages.filter((v) => !toRemove.includes(v));
    }

    await product.save();
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/products/:id  (admin) ─────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    // Clean up Cloudinary images
    await deleteFromCloudinary(product.image);
    for (const url of product.variantImages) await deleteFromCloudinary(url);

    return res.status(200).json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
};
