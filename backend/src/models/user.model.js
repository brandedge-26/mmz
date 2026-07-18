import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // OAuth fields
    provider:        { type: String, default: "local" },
    providerId:      { type: String, default: null },
    profilePicture:  { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
