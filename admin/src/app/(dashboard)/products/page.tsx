"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { useMenuToggle } from "@/app/(dashboard)/layout";
import { Search, Plus, Pencil, Trash2, Package } from "lucide-react";

type Category = "All" | "Cases" | "Chargers" | "Accessories" | "Audio" | "Cables";

const products = [
  {
    id: "PRD-001",
    name: "iPhone 15 Silicone Case",
    category: "Cases" as const,
    price: "PKR 1,200",
    stock: 45,
    status: "In Stock" as const,
  },
  {
    id: "PRD-002",
    name: "65W GaN Charger (USB-C)",
    category: "Chargers" as const,
    price: "PKR 2,500",
    stock: 18,
    status: "In Stock" as const,
  },
  {
    id: "PRD-003",
    name: "Samsung Galaxy A54 Clear Cover",
    category: "Cases" as const,
    price: "PKR 650",
    stock: 0,
    status: "Out of Stock" as const,
  },
  {
    id: "PRD-004",
    name: "Wireless Charger Pad 15W",
    category: "Chargers" as const,
    price: "PKR 3,200",
    stock: 9,
    status: "Low Stock" as const,
  },
  {
    id: "PRD-005",
    name: "TWS Earbuds Pro (Clone AirPods)",
    category: "Audio" as const,
    price: "PKR 3,500",
    stock: 22,
    status: "In Stock" as const,
  },
  {
    id: "PRD-006",
    name: "USB-C to USB-C Cable 1m",
    category: "Cables" as const,
    price: "PKR 350",
    stock: 120,
    status: "In Stock" as const,
  },
  {
    id: "PRD-007",
    name: "MagSafe Compatible Ring Holder",
    category: "Accessories" as const,
    price: "PKR 480",
    stock: 3,
    status: "Low Stock" as const,
  },
  {
    id: "PRD-008",
    name: "Car Phone Mount (Dashboard)",
    category: "Accessories" as const,
    price: "PKR 1,100",
    stock: 31,
    status: "In Stock" as const,
  },
];

const stockConfig: Record<string, string> = {
  "In Stock": "bg-green-50 text-green-700 border border-green-200",
  "Low Stock": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Out of Stock": "bg-red-50 text-red-700 border border-red-200",
};

const categories: Category[] = ["All", "Cases", "Chargers", "Accessories", "Audio", "Cables"];

export default function ProductsPage() {
  const onMenuClick = useMenuToggle();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filtered = products.filter((p) => {
    const matchesCat = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <Topbar title="Products" onMenuClick={onMenuClick} />

      <div className="p-4 lg:p-6 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-56"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {product.price}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stockConfig[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 border border-blue-200 transition">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 border border-red-200 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">{filtered.length}</span> of{" "}
              <span className="font-medium text-gray-900">{products.length}</span> products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
