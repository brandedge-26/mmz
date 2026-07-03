"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const badgeColor =
    p.badge === "Hot" || p.badge === "Sale" ? "red"
    : p.badge === "Trending" ? "green"
    : "violet";
  return {
    id:            p._id,
    slug:          p.slug,
    name:          p.name,
    brand:         p.brand,
    price:         p.price,
    originalPrice: p.originalPrice,
    image:         p.image,
    badge:         p.badge,
    badgeColor:    badgeColor as "violet" | "red" | "green",
    inStock:       p.inStock,
    href:          `/products/${p.slug}`,
  };
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products?trending=true&status=Active&limit=4`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Don't render section if no trending products
  if (!loading && products.length === 0) return null;

  return (
    <section className="px-3 sm:px-6 py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Trending Products</h2>
          <p className="text-sm text-gray-400 mt-1">What everyone is buying right now.</p>
        </div>
        <Link
          href="/trending"
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors shrink-0 flex items-center gap-1"
        >
          View all
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" style={{ height: 320 }} />
            ))
          : products.map((p) => (
              <ProductCard key={p._id} product={toCard(p)} />
            ))}
      </div>
    </section>
  );
}
