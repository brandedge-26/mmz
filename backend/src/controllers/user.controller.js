import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

// PATCH /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      throw new Error("Name is required", { cause: { statusCode: 400 } });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("All fields are required", { cause: { statusCode: 400 } });
    }
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters", { cause: { statusCode: 400 } });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect", { cause: { statusCode: 400 } });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    next(err);
  }
};
