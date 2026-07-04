import { Order } from "../models/order.model.js";

// ── POST /api/orders ──────────────────────────────────────────────────────────
// No auth required — supports guest checkout.
// If req.user exists (optionalAuth ran), attach userId.
export const createOrder = async (req, res, next) => {
  try {
    const { items, shipping, subtotal, shippingFee = 0, total, paymentMethod = "cod" } = req.body;

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

    const orderData = {
      items,
      shipping,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
    };

    // Attach user if authenticated
    if (req.user?._id) {
      orderData.user = req.user._id;
    }

    const order = await Order.create(orderData);

    return res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/my ────────────────────────────────────────────────────────
// Requires auth — returns orders for logged-in user.
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
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
    const { status, q, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
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
