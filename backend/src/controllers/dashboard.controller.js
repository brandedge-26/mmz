import { Order } from "../models/order.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// GET /api/dashboard/stats  (admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      revenueAgg,
      totalCustomers,
      totalRepairs,
      recentOrders,
      recentRepairs,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      User.countDocuments({ role: "user" }),
      Appointment.countDocuments(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber shipping.fullName total status createdAt")
        .lean(),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("trackingId name brand model issues status createdAt")
        .lean(),
    ]);

    const totalRevenue = revenueAgg[0]?.total ?? 0;

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalRepairs,
      },
      recentOrders,
      recentRepairs,
    });
  } catch (err) {
    next(err);
  }
};
