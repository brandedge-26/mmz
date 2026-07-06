"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";
import {
  TrendingUp,
  ShoppingBag,
  Wrench,
  Users,
  Plus,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  shipping: { fullName: string };
  total: number;
  status: string;
  createdAt: string;
}

interface RecentRepair {
  _id: string;
  trackingId: string;
  name: string;
  brand: string;
  model: string;
  issues: string[];
  status: string;
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalRepairs: number;
}

const ORDER_STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-violet-50 text-violet-700 border border-violet-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const REPAIR_STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  "in-progress": "bg-violet-50 text-violet-700 border border-violet-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentRepairs, setRecentRepairs] = useState<RecentRepair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await privateAxios.get("/dashboard/stats");
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setRecentRepairs(data.recentRepairs);
      } catch {
        // silently fail — will show zeros
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    {
      label: "Total Sell",
      value: stats ? `PKR ${stats.totalRevenue.toLocaleString()}` : "—",
      icon: TrendingUp,
      color: "bg-violet-50 text-violet-600",
      chipColor: "bg-violet-50 text-violet-700",
    },
    {
      label: "Total Orders",
      value: stats ? stats.totalOrders.toLocaleString() : "—",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      chipColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "Repairs",
      value: stats ? stats.totalRepairs.toLocaleString() : "—",
      icon: Wrench,
      color: "bg-emerald-50 text-emerald-600",
      chipColor: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Customers",
      value: stats ? stats.totalCustomers.toLocaleString() : "—",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
      chipColor: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div>
      <Topbar title="Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {loading && (
                    <Loader2 className="w-4 h-4 text-gray-300 animate-spin mt-1" />
                  )}
                  {!loading && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${stat.chipColor}`}>
                      <ArrowUpRight className="w-3 h-3" />
                      Live
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? <span className="inline-block h-7 w-24 bg-gray-100 rounded-lg animate-pulse" /> : stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/products/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
          <Link href="/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition">
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Link>
          <Link href="/repairs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition">
            <Wrench className="w-4 h-4" />
            View Repairs
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/orders" className="text-xs text-violet-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-4 bg-gray-100 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No orders yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3.5">
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700">{order.shipping.fullName}</td>
                        <td className="px-4 py-3.5 font-medium text-gray-900">
                          PKR {order.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_BADGE[order.status] ?? "bg-gray-50 text-gray-700 border border-gray-200"}`}>
                            {capitalize(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Repairs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Repairs</h2>
              <Link href="/repairs" className="text-xs text-violet-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-4 bg-gray-100 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : recentRepairs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No repairs yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Device</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentRepairs.map((repair) => (
                      <tr key={repair._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3.5">
                          <p className="font-medium text-gray-900 font-mono text-xs">{repair.trackingId}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(repair.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-gray-700">{repair.brand} {repair.model}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">
                            {repair.issues.slice(0, 2).join(", ")}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700">{repair.name}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${REPAIR_STATUS_BADGE[repair.status] ?? "bg-gray-50 text-gray-700 border border-gray-200"}`}>
                            {capitalize(repair.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
