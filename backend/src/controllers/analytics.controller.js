import { Order }       from "../models/order.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User }        from "../models/user.model.js";
import { Product }     from "../models/product.model.js";

// ── GET /api/analytics ────────────────────────────────────────────────────────
export const getAnalytics = async (req, res, next) => {
  try {
    const { range = "30" } = req.query;
    const days  = Math.min(Math.max(parseInt(range) || 30, 7), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const now   = new Date();

    // ── 1. Revenue & orders per day ──────────────────────────────────────────
    const dailyRaw = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const dailyMap = Object.fromEntries(dailyRaw.map((d) => [d._id, d]));
    const daily = [];
    for (let i = days - 1; i >= 0; i--) {
      const d   = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily.push({
        date:    key,
        label:   d.toLocaleDateString("en-PK", { day: "2-digit", month: "short" }),
        revenue: dailyMap[key]?.revenue ?? 0,
        orders:  dailyMap[key]?.orders  ?? 0,
      });
    }

    // ── 2. Order status breakdown ────────────────────────────────────────────
    const statusRaw = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusData = statusRaw.map((s) => ({
      name:  s._id.charAt(0).toUpperCase() + s._id.slice(1),
      value: s.count,
    }));

    // ── 3. Top 5 products by units sold ─────────────────────────────────────
    const topProductsRaw = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:      "$items.name",
          units:    { $sum: "$items.quantity" },
          revenue:  { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 5 },
    ]);
    const topProducts = topProductsRaw.map((p) => ({
      name:    p._id,
      units:   p.units,
      revenue: p.revenue,
    }));

    // ── 4. Appointments per status ───────────────────────────────────────────
    const apptRaw = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const apptData = apptRaw.map((a) => ({
      name:  a._id.charAt(0).toUpperCase() + a._id.slice(1).replace("-", " "),
      value: a.count,
    }));

    // ── 5. New customers per day ─────────────────────────────────────────────
    const customersRaw = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id:   { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const custMap = Object.fromEntries(customersRaw.map((c) => [c._id, c.count]));
    const customers = daily.map((d) => ({
      label: d.label,
      date:  d.date,
      count: custMap[d.date] ?? 0,
    }));

    // ── 6. Summary KPIs ──────────────────────────────────────────────────────
    const [totalRevenue, totalOrders, totalCustomers, totalProducts, cancelledOrders] =
      await Promise.all([
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, sum: { $sum: "$total" } } },
        ]).then((r) => r[0]?.sum ?? 0),
        Order.countDocuments(),
        User.countDocuments({ role: { $ne: "admin" } }),
        Product.countDocuments({ status: "Active" }),
        Order.countDocuments({ status: "cancelled" }),
      ]);

    const periodRevenue = dailyRaw.reduce((s, d) => s + d.revenue, 0);
    const periodOrders  = dailyRaw.reduce((s, d) => s + d.orders,  0);

    return res.json({
      success: true,
      kpis: { totalRevenue, totalOrders, totalCustomers, totalProducts, cancelledOrders, periodRevenue, periodOrders },
      daily,
      statusData,
      topProducts,
      apptData,
      customers,
      days,
    });
  } catch (err) { next(err); }
};
