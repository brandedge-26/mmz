"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: "violet" | "red" | "green";
  inStock?: boolean;
  href: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.inStock === false;
  const toggle     = useWishlistStore((s) => s.toggle);
  const wished     = useWishlistStore((s) => s.has(product.id));

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const badgeColor = product.badgeColor === "red"
    ? "bg-red-500"
    : product.badgeColor === "green"
    ? "bg-emerald-500"
    : "bg-violet-600";

  return (
    <div className={`group flex flex-col bg-white rounded-xl sm:rounded-2xl border overflow-hidden transition-all duration-300 ${
      outOfStock
        ? "border-gray-200 opacity-75"
        : "border-gray-200 hover:shadow-lg hover:border-violet-200"
    }`}>

      {/* Image area */}
      <div className="relative bg-gray-50 flex items-center justify-center overflow-hidden h-[130px] sm:h-[220px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 ${
            outOfStock ? "grayscale" : "group-hover:scale-105"
          }`}
        />

        {/* Out of Stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badge top-left */}
        {product.badge && !outOfStock && (
          <span className={`absolute top-1.5 left-1.5 sm:top-3 sm:left-3 ${badgeColor} text-white text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full`}>
            {product.badge}
          </span>
        )}

        {/* Discount badge top-right */}
        {discount && !outOfStock && (
          <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-red-500 text-white text-[8px] sm:text-[10px] font-extrabold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Wishlist heart — top-right when no discount, else bottom-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle({
              id:            product.id,
              slug:          product.slug,
              name:          product.name,
              brand:         product.brand,
              price:         product.price,
              originalPrice: product.originalPrice,
              image:         product.image,
              inStock:       product.inStock,
            });
          }}
          className={`absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition-all z-10 opacity-0 group-hover:opacity-100 ${
            wished
              ? "bg-red-500 text-white opacity-100"
              : "bg-white/90 text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-2.5 pt-2 pb-2.5 sm:px-4 sm:pt-3 sm:pb-4 gap-0.5 sm:gap-1">
        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-violet-600">
          {product.brand}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>

        {/* Price + Shop btn */}
        <div className="flex items-center justify-between mt-1.5 sm:mt-3 gap-1">
          <div>
            <p className="text-xs sm:text-base font-extrabold text-gray-900">
              PKR {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {outOfStock ? (
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 shrink-0">Unavailable</span>
          ) : (
            <Link
              href={product.href}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-violet-600 hover:bg-violet-700 text-white text-[10px] sm:text-xs font-bold rounded-full transition-colors shrink-0"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Shop
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
