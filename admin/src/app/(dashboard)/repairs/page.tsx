"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { useMenuToggle } from "@/app/(dashboard)/layout";
import { Search, Plus, Eye, ChevronLeft, ChevronRight } from "lucide-react";

type RepairStatus =
  | "All"
  | "Pending"
  | "Diagnosed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const repairs = [
  {
    id: "REP-001",
    device: "iPhone 13",
    issue: "Screen replacement",
    customer: "Kamran Ali",
    phone: "0300-1234567",
    technician: "Hamza",
    status: "In Progress" as const,
    created: "01 Jul 2026",
  },
  {
    id: "REP-002",
    device: "Samsung Galaxy S22",
    issue: "Battery swollen",
    customer: "Nida Farooq",
    phone: "0321-9876543",
    technician: "Tariq",
    status: "Diagnosed" as const,
    created: "01 Jul 2026",
  },
  {
    id: "REP-003",
    device: "Redmi Note 12",
    issue: "Charging port not working",
    customer: "Omer Sheikh",
    phone: "0333-4567890",
    technician: "Hamza",
    status: "Completed" as const,
    created: "30 Jun 2026",
  },
  {
    id: "REP-004",
    device: "iPhone 11",
    issue: "Back glass cracked",
    customer: "Hina Baig",
    phone: "0311-2223334",
    technician: "Unassigned",
    status: "Pending" as const,
    created: "30 Jun 2026",
  },
  {
    id: "REP-005",
    device: "OnePlus Nord CE 3",
    issue: "Speaker not working",
    customer: "Zaid Qureshi",
    phone: "0345-6789012",
    technician: "Tariq",
    status: "In Progress" as const,
    created: "29 Jun 2026",
  },
  {
    id: "REP-006",
    device: "Vivo Y36",
    issue: "Mic issue during calls",
    customer: "Sana Javed",
    phone: "0312-8889990",
    technician: "Hamza",
    status: "Cancelled" as const,
    created: "28 Jun 2026",
  },
  {
    id: "REP-007",
    device: "Samsung A54",
    issue: "Face unlock not working",
    customer: "Adnan Mirza",
    phone: "0301-5556667",
    technician: "Tariq",
    status: "Diagnosed" as const,
    created: "28 Jun 2026",
  },
  {
    id: "REP-008",
    device: "iPhone XR",
    issue: "Touch ID failure",
    customer: "Rida Shah",
    phone: "0322-1112223",
    technician: "Hamza",
    status: "Completed" as const,
    created: "27 Jun 2026",
  },
  {
    id: "REP-009",
    device: "Redmi 12C",
    issue: "Water damage",
    customer: "Waqas Butt",
    phone: "0303-4445556",
    technician: "Tariq",
    status: "Pending" as const,
    created: "27 Jun 2026",
  },
  {
    id: "REP-010",
    device: "Realme C55",
    issue: "Camera not focusing",
    customer: "Maham Iqbal",
    phone: "0335-7778889",
    technician: "Hamza",
    status: "In Progress" as const,
    created: "26 Jun 2026",
  },
];

const statusConfig: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Diagnosed: "bg-blue-50 text-blue-700 border border-blue-200",
  "In Progress": "bg-violet-50 text-violet-700 border border-violet-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const tabs: RepairStatus[] = [
  "All",
  "Pending",
  "Diagnosed",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function RepairsPage() {
  const onMenuClick = useMenuToggle();
  const [activeTab, setActiveTab] = useState<RepairStatus>("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  const filtered = repairs.filter((r) => {
    const matchesTab = activeTab === "All" || r.status === activeTab;
    const matchesSearch =
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.device.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div>
      <Topbar title="Repairs" onMenuClick={onMenuClick} />

      <div className="p-4 lg:p-6 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          {/* Top bar */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex flex-wrap items-center gap-3 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search repairs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-56"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition">
              <Plus className="w-4 h-4" />
              New Repair
            </button>
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
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? "bg-violet-600 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Repair ID",
                    "Device",
                    "Issue",
                    "Customer",
                    "Phone",
                    "Technician",
                    "Status",
                    "Created",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No repairs found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50 transition">
                      <td className="pl-6 pr-4 py-3.5 font-medium text-gray-900">
                        {repair.id}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {repair.device}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[160px] truncate">
                        {repair.issue}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {repair.customer}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                        {repair.phone}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {repair.technician}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig[repair.status]}`}
                        >
                          {repair.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                        {repair.created}
                      </td>
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
              of{" "}
              <span className="font-medium text-gray-900">{filtered.length}</span>{" "}
              repairs
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
