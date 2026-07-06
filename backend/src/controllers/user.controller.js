import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

// GET /api/users  (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const matchFilter = search
      ? { role: "user", $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : { role: "user" };

    const [users, total] = await Promise.all([
      User.aggregate([
        { $match: matchFilter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user",
            as: "orders",
          },
        },
        {
          $addFields: {
            orderCount: { $size: "$orders" },
            totalSpent: { $sum: "$orders.total" },
          },
        },
        { $project: { password: 0, orders: 0 } },
      ]),
      User.countDocuments(matchFilter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, message: "User deleted." });
  } catch (err) {
    next(err);
  }
};

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
