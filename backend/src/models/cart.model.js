import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId:     { type: String, required: true },
    slug:          { type: String, required: true },
    name:          { type: String, required: true },
    brand:         { type: String, default: "" },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    image:         { type: String, default: "" },
    color:         { type: String, default: "" },
    quantity:      { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
