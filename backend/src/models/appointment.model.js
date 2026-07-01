import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Device
    category: {
      type: String,
      enum: ["Phone", "iPad", "Tablet", "Accessories"],
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
      default: "",
    },

    // Issues
    issues: {
      type: [String],
      required: true,
    },
    otherIssueText: {
      type: String,
      trim: true,
      default: "",
    },

    // Service
    serviceType: {
      type: String,
      enum: ["mail-in", "visit-store"],
      required: true,
    },
    zipCode: {
      type: String,
      trim: true,
      default: "",
    },
    streetAddress: {
      type: String,
      trim: true,
      default: "",
    },

    // Schedule (visit-store only)
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },

    // Customer
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Tracking
    trackingId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Admin
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
