"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { useMenuToggle } from "@/app/(dashboard)/layout";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

type OrderStatus = "All" | "Pending" | "Processing" | "Completed" | "Cancelled";

const allOrders = [
  {
    id: "ORD-001",
    customer: "Ali Hassan",
    items: "iPhone 15 Case, Screen Protector",
    amount: "PKR 2,800",
    status: "Completed" as const,
    date: "01 Jul 2026",
  },
  {
    id: "ORD-002",
    customer: "Sara Khan",
    items: "Samsung Charger x2",
    amount: "PKR 1,400",
    status: "Processing" as const,
    date: "01 Jul 2026",
  },
  {
    id: "ORD-003",
    customer: "Usman Malik",
    items: "Airpods Clone",
    amount: "PKR 3,500",
    status: "Pending" as const,
    date: "30 Jun 2026",
  },
  {
    id: "ORD-004",
    customer: "Fatima Noor",
    items: "Redmi Note 13 Back Cover",
    amount: "PKR 850",
    status: "Completed" as const,
    date: "30 Jun 2026",
  },
  {
    id: "ORD-005",
    customer: "Bilal Ahmed",
    items: "USB-C Hub",
    amount: "PKR 4,200",
    status: "Cancelled" as const,
    date: "29 Jun 2026",
  },
  {
    id: "ORD-006",
    customer: "Hina Baig",
    items: "Phone Stand, Car Mount",
    amount: "PKR 1,950",
    status: "Pending" as const,
    date: "28 Jun 2026",
  },
  {
    id: "ORD-007",
    customer: "Zaid Qureshi",
    items: "Samsung Galaxy A54 Cover",
    amount: "PKR 750",
    status: "Processing" as const,
    date: "28 Jun 2026",
  },
  {
    id: "ORD-008",
    customer: "Nida Farooq",
    items: "Wireless Charger 15W",
    amount: "PKR 3,200",
    status: "Completed" as const,
    date: "27 Jun 2026",
  },
  {
    id: "ORD-009",
    customer: "Kamran Ali",
    items: "Type-C Cable x3",
    amount: "PKR 900",
    status: "Completed" as const,
    date: "27 Jun 2026",
  },
  {
    id: "ORD-010",
    customer: "Omer Sheikh",
    items: "Pop Socket, Ring Holder",
    amount: "PKR 650",
    status: "Cancelled" as const,
    date: "26 Jun 2026",
  },
];

const statusConfig: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const tabs: OrderStatus[] = ["All", "Pending", "Processing", "Completed", "Cancelled"];

export default function OrdersPage() {
  const onMenuClick = useMenuToggle();
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  const filtered = allOrders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <Topbar title="Orders" onMenuClick={onMenuClick} />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Search + Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 px-5 py-3 border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? "bg-violet-600 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
                {tab !== "All" && (
                  <span className={`ml-1.5 text-xs ${activeTab === tab ? "opacity-80" : "text-gray-400"}`}>
                    ({allOrders.filter((o) => o.status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[200px] truncate">
                        {order.items}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{order.date}</td>
                      <td className="px-4 py-3.5">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg border border-violet-200 transition">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–
                {Math.min(currentPage * perPage, filtered.length)}
              </span>{" "}
              of <span className="font-medium text-gray-900">{filtered.length}</span> orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
