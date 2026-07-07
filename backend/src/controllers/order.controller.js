import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { notify } from "../utils/notify.js";
import { Promo } from "../models/promo.model.js";
import { findValidPromo, calcDiscount } from "./promo.controller.js";

// ── Stock helpers ─────────────────────────────────────────────────────────────

async function decrementStock(items) {
  const validItems = items.filter((i) => i.productId && mongoose.isValidObjectId(i.productId));
  if (!validItems.length) return;

  const bulkOps = validItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId, quantity: { $gt: 0 } },
      update: { $inc: { quantity: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);

  // Auto mark out of stock
  await Product.updateMany({ quantity: { $lte: 0 } }, { $set: { quantity: 0, inStock: false } });

  // Notify low stock (quantity 1–9 after decrement)
  const lowStockProducts = await Product.find({
    _id: { $in: validItems.map((i) => i.productId) },
    quantity: { $gt: 0, $lt: 10 },
  }).select("name quantity").lean();

  for (const p of lowStockProducts) {
    await notify({
      type: "order",
      title: "Low Stock Alert",
      message: `"${p.name}" has only ${p.quantity} unit${p.quantity === 1 ? "" : "s"} left.`,
      refId: p._id.toString(),
    });
  }
}

async function restoreStock(items) {
  const validItems = items.filter((i) => i.productId && mongoose.isValidObjectId(i.productId));
  if (!validItems.length) return;

  const bulkOps = validItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);

  // Re-enable inStock for products that now have stock
  await Product.updateMany(
    { _id: { $in: validItems.map((i) => i.productId) }, quantity: { $gt: 0 }, inStock: false },
    { $set: { inStock: true } }
  );
}

// ── POST /api/orders ──────────────────────────────────────────────────────────
// No auth required — supports guest checkout.
// If req.user exists (optionalAuth ran), attach userId.
export const createOrder = async (req, res, next) => {
  try {
    const { items, shipping, subtotal, shippingFee = 0, total, paymentMethod = "cod", promoCode } = req.body;

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item." });
    }

    // Validate required shipping fields
    const requiredShipping = ["fullName", "email", "phone", "address", "city"];
    for (const field of requiredShipping) {
      if (!shipping?.[field]?.toString().trim()) {
        return res.status(400).json({ success: false, message: `Shipping field "${field}" is required.` });
      }
    }

    // Apply promo code if provided
    let discount = 0;
    let appliedPromoCode = "";
    let promoDoc = null;
    if (promoCode) {
      try {
        promoDoc = await findValidPromo(promoCode, subtotal);
        discount = parseFloat(calcDiscount(promoDoc, subtotal).toFixed(2));
        appliedPromoCode = promoDoc.code;
      } catch {
        // Invalid promo — silently ignore, place order without discount
      }
    }

    const finalTotal = Math.max(0, subtotal + shippingFee - discount);

    const orderData = {
      items,
      shipping,
      subtotal,
      shippingFee,
      discount,
      promoCode: appliedPromoCode,
      total: finalTotal,
      paymentMethod,
    };

    // Attach user if authenticated
    if (req.user?._id) {
      orderData.user = req.user._id;
    }

    const order = await Order.create(orderData);

    // Increment promo usage count
    if (promoDoc) {
      Promo.findByIdAndUpdate(promoDoc._id, { $inc: { usedCount: 1 } }).catch(() => {});
    }

    // Decrease product stock (fire & forget — never fail the order)
    decrementStock(items).catch(() => {});

    await notify({
      type: "order",
      title: "New Order",
      message: `${orderData.shipping.fullName} placed order ${order.orderNumber} — PKR ${total.toLocaleString()}`,
      refId: order._id.toString(),
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/my ────────────────────────────────────────────────────────
// Requires auth — returns orders for logged-in user (excluding hidden ones).
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id, hiddenByUser: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders  (admin) ──────────────────────────────────────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, q, page = 1, limit = 15, userId } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (userId) filter.user = userId;
    if (q) {
      filter.$or = [
        { orderNumber: new RegExp(q, "i") },
        { "shipping.fullName": new RegExp(q, "i") },
        { "shipping.email": new RegExp(q, "i") },
        { "shipping.phone": new RegExp(q, "i") },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.json({ success: true, orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/orders/:id  (admin) ──────────────────────────────────────────
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    return res.json({ success: true, message: "Order deleted." });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/track/:orderNumber  (public) ─────────────────────────────
export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber.toUpperCase(),
    }).lean();
    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please check your order number." });
    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/orders/:id/hide  (user) ───────────────────────────────────────
export const hideOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    order.hiddenByUser = true;
    await order.save();
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/orders/:id/cancel  (user) ─────────────────────────────────────
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    // If authenticated, ensure the order belongs to this user
    if (req.user && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order." });
    }

    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}.`,
      });
    }

    order.status = "cancelled";
    await order.save();

    // Restore product stock
    restoreStock(order.items).catch(() => {});

    await notify({
      type: "cancel",
      title: "Order Cancelled",
      message: `Order ${order.orderNumber} was cancelled by the customer.`,
      refId: order._id.toString(),
    });

    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/stats  (admin) ───────────────────────────────────────────
export const getOrderStats = async (req, res, next) => {
  try {
    const counts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const stats = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    for (const { _id, count } of counts) {
      if (_id in stats) stats[_id] = count;
      stats.total += count;
    }
    return res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/orders/:id/status  (admin) ────────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
