"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, X, SlidersHorizontal, ChevronRight, PackageSearch, ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = ["All", "Cases", "Screen Protection", "Power & Charging", "Audio", "Accessories", "Panels"];
const PRICE_RANGES = [
  { label: "All Prices",       min: 0,    max: Infinity },
  { label: "Under PKR 1,000",  min: 0,    max: 999      },
  { label: "PKR 1,000–3,000",  min: 1000, max: 3000     },
  { label: "PKR 3,000–7,000",  min: 3001, max: 7000     },
  { label: "PKR 7,000+",       min: 7001, max: Infinity  },
];
const SORT_OPTIONS = [
  { label: "Newest First",       value: "newest"      },
  { label: "Price: Low to High", value: "price-asc"   },
  { label: "Price: High to Low", value: "price-desc"  },
  { label: "Top Rated",          value: "rating-desc" },
];

interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  inStock: boolean;
  trending: boolean;
  newArrival: boolean;
  status: string;
}

function toProductCardProps(p: ApiProduct) {
  const badgeColor =
    p.badge === "Hot" || p.badge === "Sale" ? "red"
    : p.badge === "Trending" ? "green"
    : "violet";
  return {
    id:            p._id,
    name:          p.name,
    brand:         p.brand,
    price:         p.price,
    originalPrice: p.originalPrice,
    image:         p.image,
    badge:         p.badge,
    badgeColor:    badgeColor as "violet" | "red" | "green",
    href:          `/products/${p.slug}`,
  };
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full mb-3 group">
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500 group-hover:text-gray-700 transition-colors">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

function SidebarFilters({
  search, category, priceLabel, sort, hasFilters,
  setSearch, setCategory, setPriceLabel, setSort, clearAll,
}: {
  search: string; category: string; priceLabel: string; sort: string; hasFilters: boolean;
  setSearch: (v: string) => void; setCategory: (v: string) => void;
  setPriceLabel: (v: string) => void; setSort: (v: string) => void; clearAll: () => void;
}) {
  return (
    <div>
      <div className="border-b border-gray-100 pb-5 mb-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3">Search</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Category">
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${
                category === cat ? "bg-violet-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
              {cat}
              {category === cat && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-0.5">
          {PRICE_RANGES.map((r) => (
            <button key={r.label} onClick={() => setPriceLabel(r.label)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                priceLabel === r.label ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}>
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${priceLabel === r.label ? "border-violet-600 bg-violet-600" : "border-gray-300"}`} />
              {r.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sort By">
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setSort(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                sort === opt.value ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}>
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${sort === opt.value ? "border-violet-600 bg-violet-600" : "border-gray-300"}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <button onClick={clearAll}
          className="w-full mt-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();

  const [products,    setProducts]    = useState<ApiProduct[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [pages,       setPages]       = useState(1);
  const [loading,     setLoading]     = useState(true);

  const [search,      setSearch]      = useState("");
  const [debouncedQ,  setDebouncedQ]  = useState("");
  const [category,    setCategory]    = useState("All");
  const [priceLabel,  setPriceLabel]  = useState("All Prices");
  const [sort,        setSort]        = useState("newest");
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [drawerVis,   setDrawerVis]   = useState(false);

  // Pre-apply ?category= from URL
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === urlCat.toLowerCase());
      if (match) setCategory(match);
    }
  }, [searchParams]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const priceRange = PRICE_RANGES.find((r) => r.label === priceLabel) ?? PRICE_RANGES[0];
  const hasFilters = category !== "All" || priceLabel !== "All Prices" || sort !== "newest" || search.trim() !== "";
  const activeCount = [category !== "All", priceLabel !== "All Prices", sort !== "newest", search.trim() !== ""].filter(Boolean).length;

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20", status: "Active", sort });
      if (category !== "All")    params.set("category", category);
      if (debouncedQ)            params.set("q", debouncedQ);

      const res  = await fetch(`${API}/api/products?${params}`);
      const data = await res.json();

      let list: ApiProduct[] = data.products ?? [];

      // Client-side price filter
      if (priceRange.max !== Infinity || priceRange.min > 0) {
        list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
      }

      setProducts(list);
      setTotal(data.total ?? list.length);
      setPages(data.pages ?? 1);
      setPage(p);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, debouncedQ, priceRange, sort]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const clearAll = () => {
    setSearch(""); setCategory("All"); setPriceLabel("All Prices"); setSort("newest");
  };

  const openDrawer  = () => { setDrawerOpen(true);  requestAnimationFrame(() => requestAnimationFrame(() => setDrawerVis(true)));  };
  const closeDrawer = () => { setDrawerVis(false); setTimeout(() => setDrawerOpen(false), 300); };

  const pageTitle = category === "All" ? "All Products" : category;

  const filterProps = { search, category, priceLabel, sort, hasFilters, setSearch, setCategory, setPriceLabel, setSort, clearAll };

  return (
    <>
      <Header />
      <main className="w-full px-4 sm:px-6 xl:px-10 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {category === "All" ? (
            <span className="text-gray-700 font-medium">Products</span>
          ) : (
            <>
              <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-700 font-medium">{category}</span>
            </>
          )}
        </nav>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-900 text-sm">Filters</p>
                {hasFilters && (
                  <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">{activeCount} active</span>
                )}
              </div>
              <SidebarFilters {...filterProps} />
            </div>
          </aside>

          {/* Right: header + grid */}
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {loading ? "Loading…" : <><span className="text-gray-700 font-semibold">{total}</span> products found</>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort by:</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer">
                    {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <button onClick={openDrawer}
                  className={`lg:hidden relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    hasFilters ? "border-violet-400 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-600"
                  }`}>
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-violet-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    &ldquo;{search}&rdquo;<button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {category !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {category}<button onClick={() => setCategory("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {priceLabel !== "All Prices" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {priceLabel}<button onClick={() => setPriceLabel("All Prices")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" style={{ height: 320 }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-5 text-center pt-16">
                <div className="w-24 h-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <PackageSearch className="w-11 h-11 text-gray-300" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1.5">No products found</p>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">Try changing your filters or check back later.</p>
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {products.map((p) => <ProductCard key={p._id} product={toProductCardProps(p)} />)}
                </div>
                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => fetchProducts(page - 1)} disabled={page === 1}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">Page {page} of {pages}</span>
                    <button onClick={() => fetchProducts(page + 1)} disabled={page === pages}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerVis ? "opacity-100" : "opacity-0"}`} onClick={closeDrawer} />
          <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${drawerVis ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">Filters</span>
                {hasFilters && <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">{activeCount} active</span>}
              </div>
              <button onClick={closeDrawer} className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SidebarFilters {...filterProps} />
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={closeDrawer}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-2xl transition-colors">
                View {total} products
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return <Suspense><ProductsPageInner /></Suspense>;
}
