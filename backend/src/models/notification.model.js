import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type:    { type: String, enum: ["order", "appointment", "contact", "cancel", "review"], required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
    refId:   { type: String, default: null },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
