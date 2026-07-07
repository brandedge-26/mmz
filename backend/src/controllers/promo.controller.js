import { Promo } from "../models/promo.model.js";

// ── Shared helpers (also exported for order controller) ───────────────────────

export const findValidPromo = async (code, subtotal) => {
  const promo = await Promo.findOne({ code: code.trim().toUpperCase() });
  if (!promo)          throw new Error("Promo code not found.");
  if (!promo.isActive) throw new Error("This promo code is inactive.");
  if (promo.expiryDate && new Date(promo.expiryDate) < new Date())
                       throw new Error("This promo code has expired.");
  if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit)
                       throw new Error("This promo code has reached its usage limit.");
  if (subtotal < promo.minOrderAmount)
    throw new Error(`Minimum order amount of PKR ${promo.minOrderAmount.toLocaleString()} required.`);
  return promo;
};

export const calcDiscount = (promo, subtotal) => {
  if (promo.discountType === "percentage") {
    return Math.min((promo.discountValue / 100) * subtotal, subtotal);
  }
  return Math.min(promo.discountValue, subtotal);
};

// ── POST /api/promos/validate  (authenticated users — shop checkout) ──────────
export const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined)
      return res.status(400).json({ success: false, message: "Code and subtotal are required." });

    const promo = await findValidPromo(code, Number(subtotal));
    const discountAmount = parseFloat(calcDiscount(promo, Number(subtotal)).toFixed(2));

    return res.json({
      success: true,
      promo: {
        code:          promo.code,
        discountType:  promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        minOrderAmount: promo.minOrderAmount,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ── GET /api/promos  (admin) ──────────────────────────────────────────────────
export const getPromos = async (req, res, next) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, promos });
  } catch (err) { next(err); }
};

// ── POST /api/promos  (admin) ─────────────────────────────────────────────────
export const createPromo = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, usageLimit, expiryDate } = req.body;
    if (!code || !discountType || discountValue === undefined)
      return res.status(400).json({ success: false, message: "code, discountType, and discountValue are required." });

    if (discountType === "percentage" && (discountValue < 1 || discountValue > 100))
      return res.status(400).json({ success: false, message: "Percentage discount must be between 1 and 100." });

    const promo = await Promo.create({
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount ?? 0),
      usageLimit: usageLimit ? Number(usageLimit) : null,
      expiryDate: expiryDate || null,
    });

    return res.status(201).json({ success: true, promo });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: "Promo code already exists." });
    next(err);
  }
};

// ── PATCH /api/promos/:id/toggle  (admin) ────────────────────────────────────
export const togglePromo = async (req, res, next) => {
  try {
    const promo = await Promo.findById(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: "Promo not found." });
    promo.isActive = !promo.isActive;
    await promo.save();
    return res.json({ success: true, promo });
  } catch (err) { next(err); }
};

// ── DELETE /api/promos/:id  (admin) ──────────────────────────────────────────
export const deletePromo = async (req, res, next) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) { next(err); }
};
