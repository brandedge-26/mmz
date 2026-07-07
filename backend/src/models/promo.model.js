import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType:  { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount:{ type: Number, default: 0 },
    usageLimit:    { type: Number, default: null },
    usedCount:     { type: Number, default: 0 },
    expiryDate:    { type: Date, default: null },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Promo = mongoose.model("Promo", promoSchema);
