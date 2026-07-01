"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, X, SlidersHorizontal, ChevronRight, PackageSearch, ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard, { Product } from "@/components/ProductCard";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ShopProduct extends Product { category: string; }

// ── Dummy data ─────────────────────────────────────────────────────────────────
const ALL_PRODUCTS: ShopProduct[] = [
  { id:"p1",  name:"iPhone 16 Pro Max Silicone Case",              brand:"Apple",   price:3999,  originalPrice:4999,  image:"/shop/category/Cases.webp",              badge:"New",      badgeColor:"violet", category:"Cases",            href:"/products/iphone-16-pro-max-case" },
  { id:"p2",  name:"Galaxy S25 Ultra Tempered Glass",              brand:"Samsung", price:1499,                       image:"/shop/category/Screen_Protectors.webp",  badge:"New",      badgeColor:"violet", category:"Screen Protection", href:"/products/galaxy-s25-screen-protector" },
  { id:"p3",  name:"65W USB-C GaN Fast Charger",                   brand:"Anker",   price:2999,  originalPrice:3799,  image:"/shop/category/Charging.webp",            badge:"New",      badgeColor:"violet", category:"Power",            href:"/products/65w-gan-charger" },
  { id:"p4",  name:"True Wireless Noise Cancelling Earbuds Pro",   brand:"JBL",     price:8999,  originalPrice:11999, image:"/shop/category/Audio_Category_Tile.webp", badge:"New",      badgeColor:"violet", category:"Audio",            href:"/products/jbl-earbuds-pro" },
  { id:"p5",  name:"iPhone 16 Clear Case MagSafe Drop Protection", brand:"Spigen",  price:2499,                       image:"/shop/category/Cases.webp",               badge:"Hot",      badgeColor:"red",    category:"Cases",            href:"/products/spigen-clear-case" },
  { id:"p6",  name:"Universal Magnetic Wireless Charging Pad 15W", brand:"Belkin",  price:3499,  originalPrice:4799,  image:"/shop/category/Charging.webp",            badge:"Sale",     badgeColor:"red",    category:"Power",            href:"/products/belkin-wireless-pad" },
  { id:"p7",  name:"Privacy Screen Protector for iPhone 16 Pro",   brand:"ZAGG",    price:1999,                       image:"/shop/category/Screen_Protectors.webp",   badge:"Trending", badgeColor:"green",  category:"Screen Protection", href:"/products/zagg-privacy-screen" },
  { id:"p8",  name:"Portable Bluetooth Speaker 360° Waterproof",   brand:"JBL",     price:5999,  originalPrice:7999,  image:"/shop/category/Audio_Category_Tile.webp", badge:"Hot",      badgeColor:"red",    category:"Audio",            href:"/products/jbl-speaker" },
  { id:"p9",  name:"OnePlus Nord CE4 TPU Bumper Case",             brand:"OnePlus", price:899,                        image:"/shop/category/Cases.webp",                                            category:"Cases",            href:"/products/oneplus-case" },
  { id:"p10", name:"Samsung Galaxy Buds3 Pro In-Ear ANC",          brand:"Samsung", price:12999, originalPrice:15999, image:"/shop/category/Audio_Category_Tile.webp", badge:"Sale",     badgeColor:"red",    category:"Audio",            href:"/products/galaxy-buds3-pro" },
  { id:"p11", name:"20000mAh Slim Power Bank USB-C 65W",           brand:"Anker",   price:4499,  originalPrice:5499,  image:"/shop/category/Charging.webp",                                         category:"Power",            href:"/products/anker-powerbank" },
  { id:"p12", name:"Anti-Blue Light Screen Protector Galaxy S25",  brand:"Spigen",  price:1299,                       image:"/shop/category/Screen_Protectors.webp",                               category:"Screen Protection", href:"/products/spigen-blue-light" },
];

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Cases", "Screen Protection", "Power & Charging", "Audio", "Accessories"];
const CATEGORY_MAP: Record<string, string[]> = {
  All: [], Cases: ["Cases"], "Screen Protection": ["Screen Protection"],
  "Power & Charging": ["Power"], Audio: ["Audio"], Accessories: ["Accessories"],
};
const BRANDS = ["All Brands","Apple","Samsung","Anker","JBL","Spigen","ZAGG","Belkin","OnePlus","Oppo","Vivo","Xiaomi","Realme"];
const PRICE_RANGES = [
  { label: "All Prices",      min: 0,    max: Infinity },
  { label: "Under PKR 1,000", min: 0,    max: 999      },
  { label: "PKR 1,000–3,000", min: 1000, max: 3000     },
  { label: "PKR 3,000–7,000", min: 3001, max: 7000     },
  { label: "PKR 7,000+",      min: 7001, max: Infinity },
];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest First"];

// ── FilterSection — collapsible wrapper ───────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500 group-hover:text-gray-700 transition-colors">
          {title}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

// ── SidebarFilters — defined OUTSIDE parent to prevent remount on every render ─
interface FiltersProps {
  search:       string;
  category:     string;
  brand:        string;
  priceLabel:   string;
  sort:         string;
  hasFilters:   boolean;
  setSearch:    (v: string) => void;
  setCategory:  (v: string) => void;
  setBrand:     (v: string) => void;
  setPriceLabel:(v: string) => void;
  setSort:      (v: string) => void;
  clearAll:     () => void;
}

function SidebarFilters({
  search, category, brand, priceLabel, sort, hasFilters,
  setSearch, setCategory, setBrand, setPriceLabel, setSort, clearAll,
}: FiltersProps) {
  return (
    <div>
      {/* Search */}
      <div className="border-b border-gray-100 pb-5 mb-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3">Search</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${
                category === cat
                  ? "bg-violet-600 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {cat}
              {category === cat && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                brand === b
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                brand === b ? "border-violet-600 bg-violet-600" : "border-gray-300"
              }`} />
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-0.5">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setPriceLabel(r.label)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                priceLabel === r.label
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                priceLabel === r.label ? "border-violet-600 bg-violet-600" : "border-gray-300"
              }`} />
              {r.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2.5 ${
                sort === opt
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                sort === opt ? "border-violet-600 bg-violet-600" : "border-gray-300"
              }`} />
              {opt}
            </button>
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full mt-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}

// ── Inner page ─────────────────────────────────────────────────────────────────
function ProductsPageInner() {
  const searchParams = useSearchParams();

  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [brand,       setBrand]       = useState("All Brands");
  const [priceLabel,  setPriceLabel]  = useState("All Prices");
  const [sort,        setSort]        = useState("Featured");
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

  const priceRange  = PRICE_RANGES.find((r) => r.label === priceLabel) ?? PRICE_RANGES[0];
  const hasFilters  = category !== "All" || brand !== "All Brands" || priceLabel !== "All Prices" || sort !== "Featured" || search.trim() !== "";
  const activeCount = [category !== "All", brand !== "All Brands", priceLabel !== "All Prices", sort !== "Featured", search.trim() !== ""].filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (category !== "All") {
      const cats = CATEGORY_MAP[category] ?? [];
      list = list.filter((p) => cats.includes(p.category));
    }
    if (brand !== "All Brands")  list = list.filter((p) => p.brand === brand);
    list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Newest First")       list.reverse();
    return list;
  }, [search, category, brand, priceRange, sort]);

  const clearAll = () => {
    setSearch(""); setCategory("All"); setBrand("All Brands");
    setPriceLabel("All Prices"); setSort("Featured");
  };

  const openDrawer  = () => { setDrawerOpen(true);  requestAnimationFrame(() => requestAnimationFrame(() => setDrawerVis(true)));  };
  const closeDrawer = () => { setDrawerVis(false); setTimeout(() => setDrawerOpen(false), 300); };

  const filterProps: FiltersProps = {
    search, category, brand, priceLabel, sort, hasFilters,
    setSearch, setCategory, setBrand, setPriceLabel, setSort, clearAll,
  };

  const pageTitle = category === "All" ? "All Products" : category;

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

          {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-900 text-sm">Filters</p>
                {hasFilters && (
                  <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <SidebarFilters {...filterProps} />
            </div>
          </aside>

          {/* ── Right: header + grid ─────────────────────────────────────────── */}
          <div className="min-w-0 flex flex-col">

            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Showing{" "}
                  <span className="text-gray-700 font-semibold">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "product" : "products"}
                </p>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                {/* Sort dropdown — desktop */}
                <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={openDrawer}
                  className={`lg:hidden relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    hasFilters
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
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

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {category !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {category}
                    <button onClick={() => setCategory("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {brand !== "All Brands" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {brand}
                    <button onClick={() => setBrand("All Brands")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {priceLabel !== "All Prices" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {priceLabel}
                    <button onClick={() => setPriceLabel("All Prices")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {sort !== "Featured" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                    {sort}
                    <button onClick={() => setSort("Featured")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 text-center pt-8">
                <div className="w-24 h-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <PackageSearch className="w-11 h-11 text-gray-300" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1.5">No products found</p>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                    No results for the current filters.<br />Try changing your selection or clear all filters.
                  </p>
                </div>
                <button
                  onClick={clearAll}
                  className="mt-1 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile drawer (slides from left) ──────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerVis ? "opacity-100" : "opacity-0"}`}
            onClick={closeDrawer}
          />
          <div
            className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${drawerVis ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">Filters</span>
                {hasFilters && (
                  <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">{activeCount} active</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <button onClick={clearAll} className="text-sm text-violet-600 font-semibold">Clear all</button>
                )}
                <button onClick={closeDrawer} className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SidebarFilters {...filterProps} />
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={closeDrawer}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-2xl transition-colors"
              >
                Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  );
}
