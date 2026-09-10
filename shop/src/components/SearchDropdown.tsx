"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  _id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  slug?: string;
  description?: string;
  inStock?: boolean;
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
  query: string;
  onClose: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function SearchDropdown({ query, onClose }: Props) {
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const [results,      setResults]      = useState<Product[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [activeIdx,    setActiveIdx]    = useState(0);

  const preview = results[activeIdx] ?? null;

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setTotal(0); setActiveIdx(0); return; }

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
          setActiveIdx(0);
        }
      } catch { /* ignore abort */ }
      finally { setLoading(false); }
    }, 300);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // Keyboard navigation — exposed via window event so Header input can forward keys
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && preview) {
      e.preventDefault();
      router.push(`/products/${preview.slug ?? preview._id}`);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [results.length, preview, router, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (query.trim().length < 2) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex"
      style={{ maxHeight: "460px" }}
    >
      {/* ── Left: suggestions list ── */}
      <div className="w-[55%] border-r border-gray-100 flex flex-col min-h-0">
        {loading ? (
          <div className="flex items-center gap-2 px-5 py-4 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
            Searching…
          </div>
        ) : results.length === 0 ? (
          <div className="px-5 py-8 text-sm text-gray-400 text-center">
            No products found for &quot;{query}&quot;
          </div>
        ) : (
          <ul ref={listRef} className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {results.map((p, idx) => (
              <li key={p._id}>
                <Link
                  href={`/products/${p.slug ?? p._id}`}
                  onClick={onClose}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                    activeIdx === idx ? "bg-violet-50" : "hover:bg-violet-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <p className={`text-sm leading-snug line-clamp-2 transition-colors ${
                    activeIdx === idx ? "text-violet-700" : "text-gray-600 group-hover:text-violet-700"
                  }`}>
                    {highlightMatch(p.name, query)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* See all */}
        {results.length > 0 && (
          <button
            onClick={() => { router.push(`/products?q=${encodeURIComponent(query)}`); onClose(); }}
            className="w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-violet-600 hover:bg-gray-50 transition-colors border-t border-gray-100 text-center shrink-0"
          >
            See all products… ({total})
          </button>
        )}
      </div>

      {/* ── Right: product preview ── */}
      <div className="flex-1 flex flex-col p-5 gap-3 overflow-y-auto">
        {preview ? (
          <>
            <div className="w-full bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden" style={{ height: "180px" }}>
              {preview.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.image} alt={preview.name} className="w-full h-full object-contain p-4" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 leading-snug">{preview.name}</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-extrabold text-gray-900">
                  PKR {preview.price?.toLocaleString()}
                </span>
                {preview.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    PKR {preview.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {preview.description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {preview.description}
                </p>
              )}

              <div className="mt-3">
                {preview.inStock === false ? (
                  <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg">
                    Out of Stock
                  </span>
                ) : (
                  <Link
                    href={`/products/${preview.slug ?? preview._id}`}
                    onClick={onClose}
                    className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Product →
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-300">
            Hover a result to preview
          </div>
        )}
      </div>
    </div>
  );
}
