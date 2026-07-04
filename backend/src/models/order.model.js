import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId:     { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    slug:          { type: String },
    name:          { type: String, required: true },
    brand:         { type: String, default: "" },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    image:         { type: String, default: "" },
    color:         { type: String, default: null },
    quantity:      { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true, trim: true },
    address:  { type: String, required: true, trim: true },
    city:     { type: String, required: true, trim: true },
    notes:    { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type:   String,
      unique: true,
    },
    user: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },
    items:    { type: [orderItemSchema], required: true },
    shipping: { type: shippingSchema,   required: true },

    subtotal:    { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total:       { type: Number, required: true },

    paymentMethod: {
      type:    String,
      enum:    ["cod"],
      default: "cod",
    },
    paymentStatus: {
      type:    String,
      enum:    ["pending", "paid"],
      default: "pending",
    },
    status: {
      type:    String,
      enum:    ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Auto-generate orderNumber before first save
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    this.orderNumber = "MMZ-" + Math.floor(100000 + Math.random() * 900000);
  }
});

export const Order = mongoose.model("Order", orderSchema);
