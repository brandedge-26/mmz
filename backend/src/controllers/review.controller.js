import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";

// Recalculate and save product rating + review count
const syncProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = result[0] ?? {};
  await Product.findByIdAndUpdate(productId, {
    rating:  Math.round(avg * 10) / 10,
    reviews: count,
  });
};

// ── POST /api/reviews  (auth required) ───────────────────────────────────────
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, body } = req.body;

    if (!productId || !rating || !body?.trim()) {
      return res.status(400).json({ success: false, message: "productId, rating and body are required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Check duplicate
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already reviewed this product." });
    }

    const review = await Review.create({
      product:  productId,
      user:     req.user._id,
      userName: req.user.name,
      rating:   Number(rating),
      body:     body.trim(),
    });

    await syncProductRating(product._id);

    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    // Mongoose duplicate key
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already reviewed this product." });
    }
    next(err);
  }
};

// ── GET /api/reviews?productId=xxx  (public) ─────────────────────────────────
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId, page = 1, limit = 10 } = req.query;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required." });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("user userName rating body createdAt"),
      Review.countDocuments({ product: productId }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page:    Number(page),
      pages:   Math.ceil(total / Number(limit)),
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/reviews/:id  (admin) ─────────────────────────────────────────
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    await syncProductRating(review.product);
    return res.status(200).json({ success: true, message: "Review deleted." });
  } catch (err) {
    next(err);
  }
};
