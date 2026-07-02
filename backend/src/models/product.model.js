import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  { key: { type: String, trim: true }, value: { type: String, trim: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["Cases", "Screen Protection", "Power & Charging", "Audio", "Accessories", "Panels"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    variantImages: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ["New", "Hot", "Sale", "Trending", "Best Seller", ""],
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: [specSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ trending: 1, status: 1 });
productSchema.index({ newArrival: 1, status: 1 });

export const Product = mongoose.model("Product", productSchema);
