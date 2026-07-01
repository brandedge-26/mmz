"use client";

import Topbar from "@/components/Topbar";
import {
  TrendingUp,
  ShoppingBag,
  Wrench,
  Users,
  Plus,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "PKR 2,45,000",
    change: "+12%",
    positive: true,
    icon: TrendingUp,
    color: "bg-violet-50 text-violet-600",
    chipColor: "bg-violet-50 text-violet-700",
  },
  {
    label: "Total Orders",
    value: "142",
    change: "+8%",
    positive: true,
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600",
    chipColor: "bg-blue-50 text-blue-700",
  },
  {
    label: "Repairs",
    value: "38",
    change: "+5%",
    positive: true,
    icon: Wrench,
    color: "bg-emerald-50 text-emerald-600",
    chipColor: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Customers",
    value: "890",
    change: "+18%",
    positive: true,
    icon: Users,
    color: "bg-orange-50 text-orange-600",
    chipColor: "bg-orange-50 text-orange-700",
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Ali Hassan",
    items: "iPhone 15 Case, Screen Protector",
    amount: "PKR 2,800",
    status: "Completed",
    date: "01 Jul 2026",
  },
  {
    id: "ORD-002",
    customer: "Sara Khan",
    items: "Samsung Charger x2",
    amount: "PKR 1,400",
    status: "Processing",
    date: "01 Jul 2026",
  },
  {
    id: "ORD-003",
    customer: "Usman Malik",
    items: "Airpods Clone",
    amount: "PKR 3,500",
    status: "Pending",
    date: "30 Jun 2026",
  },
  {
    id: "ORD-004",
    customer: "Fatima Noor",
    items: "Redmi Note 13 Back Cover",
    amount: "PKR 850",
    status: "Completed",
    date: "30 Jun 2026",
  },
  {
    id: "ORD-005",
    customer: "Bilal Ahmed",
    items: "USB-C Hub",
    amount: "PKR 4,200",
    status: "Cancelled",
    date: "29 Jun 2026",
  },
];

const recentRepairs = [
  {
    id: "REP-001",
    device: "iPhone 13",
    issue: "Screen replacement",
    customer: "Kamran Ali",
    status: "In Progress",
    technician: "Hamza",
  },
  {
    id: "REP-002",
    device: "Samsung S22",
    issue: "Battery swollen",
    customer: "Nida Farooq",
    status: "Diagnosed",
    technician: "Tariq",
  },
  {
    id: "REP-003",
    device: "Redmi 12",
    issue: "Charging port issue",
    customer: "Omer Sheikh",
    status: "Completed",
    technician: "Hamza",
  },
  {
    id: "REP-004",
    device: "iPhone 11",
    issue: "Back glass crack",
    customer: "Hina Baig",
    status: "Pending",
    technician: "Unassigned",
  },
  {
    id: "REP-005",
    device: "OnePlus Nord",
    issue: "Speaker not working",
    customer: "Zaid Qureshi",
    status: "In Progress",
    technician: "Tariq",
  },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Processing: "bg-blue-50 text-blue-700 border border-blue-200",
    Completed: "bg-green-50 text-green-700 border border-green-200",
    Cancelled: "bg-red-50 text-red-700 border border-red-200",
    Diagnosed: "bg-blue-50 text-blue-700 border border-blue-200",
    "In Progress": "bg-violet-50 text-violet-700 border border-violet-200",
  };
  return (
    map[status] || "bg-gray-50 text-gray-700 border border-gray-200"
  );
};

export default function DashboardPage() {

  return (
    <div>
      <Topbar title="Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${stat.chipColor}`}
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition">
            <Wrench className="w-4 h-4" />
            New Repair
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition">
            <FileText className="w-4 h-4" />
            View Reports
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <span className="text-xs text-violet-600 font-medium cursor-pointer hover:underline">
                View all
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Order
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.date}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Repairs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Repairs</h2>
              <span className="text-xs text-violet-600 font-medium cursor-pointer hover:underline">
                View all
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Device
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRepairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-gray-900">{repair.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {repair.technician}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-gray-700">{repair.device}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {repair.issue}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {repair.customer}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(repair.status)}`}
                        >
                          {repair.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
