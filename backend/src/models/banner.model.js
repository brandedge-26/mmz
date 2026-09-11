import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    type:     { type: String, enum: ["desktop", "mobile"], required: true },
    imageUrl: { type: String, required: true },
    href:     { type: String, default: "" },
    label:    { type: String, default: "" },
    order:    { type: Number, default: 0 },
    active:   { type: Boolean, default: true },
    // Desktop text overlay fields
    tag:      { type: String, default: "" },
    title:    { type: String, default: "" },
    desc:     { type: String, default: "" },
    btnText:  { type: String, default: "" },
    bgColor:  { type: String, default: "#0f172a" },
  },
  { timestamps: true }
);

export const Banner = mongoose.model("Banner", bannerSchema);
