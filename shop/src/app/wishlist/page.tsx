"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function WishlistPage() {
  const items      = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart  = useCartStore((s) => s.addItem);

  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAddToCart(item: (typeof items)[0]) {
    addToCart({
      id:            item.id,
      slug:          item.slug,
      name:          item.name,
      brand:         item.brand,
      price:         item.price,
      originalPrice: item.originalPrice,
      image:         item.image,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Wishlist</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
            Wishlist
            {items.length > 0 && (
              <span className="ml-3 text-lg font-semibold text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-red-300" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs">
                Save products you love and come back to them anytime.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {items.map((item) => {
                const discount = item.originalPrice
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : null;
                const isAdded = addedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative bg-gray-50 h-[140px] sm:h-[200px] flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 ${
                          item.inStock === false ? "grayscale opacity-60" : ""
                        }`}
                      />
                      {discount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                      {item.inStock === false && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-gray-800 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {/* Remove from wishlist */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 left-2 w-7 h-7 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-violet-600">
                        {item.brand}
                      </p>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors line-clamp-2 flex-1"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1.5">
                        <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </p>
                        {item.originalPrice && (
                          <p className="text-[10px] text-gray-400 line-through">
                            PKR {item.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Add to cart */}
                      {item.inStock === false ? (
                        <span className="mt-2 text-[10px] font-bold text-gray-400 text-center">Unavailable</span>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${
                            isAdded
                              ? "bg-emerald-500 text-white"
                              : "bg-violet-600 hover:bg-violet-700 text-white"
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {isAdded ? "Added!" : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
