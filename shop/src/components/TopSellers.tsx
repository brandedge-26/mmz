"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import ProductCard from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

function toCard(p: ApiProduct) {
  return {
    id:            p._id,
    slug:          p.slug,
    name:          p.name,
    brand:         p.brand,
    price:         p.price,
    originalPrice: p.originalPrice,
    image:         p.image,
    badge:         p.badge || "Hot",
    badgeColor:    "red" as const,
    inStock:       p.inStock,
    href:          `/products/${p.slug}`,
  };
}

export default function TopSellers() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/products?status=Active&sortBy=sold&order=desc&limit=8`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="px-3 sm:px-6 py-8">

      {/* Heading */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Top Sellers</h2>
              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                Sale
              </span>
            </div>
            <p className="text-sm text-gray-400">Our best-selling products loved by customers.</p>
          </div>
        </div>
        <Link
          href="/products?sortBy=sold&order=desc"
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors shrink-0 flex items-center gap-1"
        >
          View all
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" style={{ height: 320 }} />
            ))
          : products.map((p) => (
              <ProductCard key={p._id} product={toCard(p)} />
            ))}
      </div>

    </section>
  );
}
