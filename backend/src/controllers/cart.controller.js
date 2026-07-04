import { Cart } from "../models/cart.model.js";

// ── GET /api/cart ─────────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    return res.json({ success: true, items: cart ? cart.items : [] });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/cart/sync ───────────────────────────────────────────────────────
export const syncCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "items must be an array." });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, items: cart.items });
  } catch (err) {
    next(err);
  }
};
