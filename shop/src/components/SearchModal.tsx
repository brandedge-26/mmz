"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";

const TABS = [
  { id: "all",                label: "All" },
  { id: "Cases",              label: "Cases" },
  { id: "Screen Protection",  label: "Screen Protection" },
  { id: "Power",              label: "Power & Charging" },
  { id: "Audio",              label: "Audio" },
  { id: "Accessories",        label: "Accessories" },
];

interface Product {
  _id: string;
  name: string;
  brand?: string;
  price: number;
  category?: string;
  image?: string;
  slug?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query,     setQuery]     = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visible,   setVisible]   = useState(false);
  const [results,   setResults]   = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animation
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setVisible(false);
      const t = setTimeout(() => { setQuery(""); setActiveTab("all"); setResults([]); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced API search
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search: query.trim(), limit: "12" });
        if (activeTab !== "all") params.set("category", activeTab);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products ?? []);
        }
      } catch { /* ignore abort */ }
      finally { setLoading(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, activeTab]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open && !visible) return null;

  const filtered = activeTab === "all"
    ? results
    : results.filter((p) => p.category === activeTab);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 transition-all duration-250 ${
        visible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
      }`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-3"
        }`}
        style={{ maxHeight: "78vh" }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands…"
            className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center gap-2 px-5 py-3 text-xs text-gray-400 border-b border-gray-100">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
              Searching…
            </div>
          )}

          {!loading && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <Search className="w-12 h-12 text-gray-200 mb-4" />
              {!query.trim() ? (
                <p className="text-gray-400 font-medium">Start typing to search products…</p>
              ) : (
                <>
                  <p className="text-gray-600 font-semibold">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different keyword or category</p>
                </>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <li key={product._id}>
                  <Link
                    href={`/products/${product.slug ?? product._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-violet-50 transition-colors group"
                  >
                    {product.image ? (
                      <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-violet-50 shrink-0 flex items-center justify-center">
                        <Search className="w-5 h-5 text-violet-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                        {product.name}
                      </p>
                      {product.brand && (
                        <p className="text-xs text-gray-400 truncate">{product.brand}</p>
                      )}
                    </div>
                    {product.price && (
                      <span className="text-sm font-bold text-gray-900 shrink-0">
                        PKR {product.price.toLocaleString()}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {query.trim()
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${query}"`
              : "Search across all products"}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
