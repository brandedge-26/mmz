import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: "violet" | "red" | "green";
  href: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const badgeColor = product.badgeColor === "red"
    ? "bg-red-500"
    : product.badgeColor === "green"
    ? "bg-emerald-500"
    : "bg-violet-600";

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300">

      {/* Image area */}
      <div className="relative bg-gray-50 flex items-center justify-center overflow-hidden" style={{ height: "220px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge top-left */}
        {product.badge && (
          <span className={`absolute top-3 left-3 ${badgeColor} text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
            {product.badge}
          </span>
        )}

        {/* Discount badge top-right */}
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-1">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>

        {/* Price + Shop btn */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            <p className="text-base font-extrabold text-gray-900">
              PKR {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          <Link
            href={product.href}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-full transition-colors shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
