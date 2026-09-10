"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

const ALL_CATEGORIES = [
  { label: "Panels",               href: "/products?category=Panels" },
  { label: "Mobile Batteries",     href: "/products?category=Mobile+Batteries" },
  { label: "Charging Jacks",       href: "/products?category=Charging+Jacks" },
  { label: "Keypad Mobile Parts",  href: "/products?category=Keypad+Mobile+Parts" },
  { label: "Trending Accessories", href: "/products?category=Trending+Accessories" },
  { label: "Chargers",             href: "/products?category=Chargers" },
  { label: "Power Bank",           href: "/products?category=Power+Bank" },
  { label: "Casing Converter",     href: "/products?category=Casing+Converter" },
  { label: "Smart Watches",        href: "/products?category=Smart+Watches" },
  { label: "Car Accessories",      href: "/products?category=Car+Accessories" },
  { label: "Audio",                href: "/products?category=Audio" },
];

interface Product {
  _id: string;
  name: string;
  brand?: string;
  price: number;
  image?: string;
  slug?: string;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <strong key={i} className="text-gray-900 font-bold">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileSearchOverlay({ open, onClose }: Props) {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setTotal(0); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query.trim(), status: "Active", limit: "8" });
        const res = await fetch(`${API}/products?${params}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const prods: Product[] = data.products ?? [];
          setResults(prods);
          setTotal(data.total ?? prods.length);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  const matchedCategories = query.trim().length >= 1
    ? ALL_CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col lg:hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
        </form>

        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex-1 overflow-y-auto">

        {loading && (
          <div className="flex items-center gap-2 px-5 py-4 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
            Searching…
          </div>
        )}

        {/* Categories */}
        {!loading && matchedCategories.length > 0 && (
          <div>
            <p className="px-5 pt-5 pb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Categories
            </p>
            <div className="divide-y divide-gray-50">
              {matchedCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  className="flex flex-col px-5 py-3 hover:bg-violet-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {highlightMatch(cat.label, query)}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">in All Products › {cat.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-1" />
          </div>
        )}

        {/* Products */}
        {!loading && results.length > 0 && (
          <div>
            <p className="px-5 pt-5 pb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Products
            </p>
            <ul className="divide-y divide-gray-50">
              {results.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/products/${p.slug ?? p._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-violet-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {p.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                      {highlightMatch(p.name, query)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* See all */}
            <button
              onClick={() => { router.push(`/products?q=${encodeURIComponent(query)}`); onClose(); }}
              className="w-full py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-violet-600 transition-colors border-t border-gray-100 text-center"
            >
              See all products… ({total})
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && query.trim().length >= 2 && results.length === 0 && matchedCategories.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            No results found for &quot;{query}&quot;
          </div>
        )}

        {/* Idle state */}
        {query.trim().length < 2 && (
          <div className="px-5 py-10 text-center text-sm text-gray-300">
            Start typing to search products…
          </div>
        )}

      </div>
    </div>
  );
}
