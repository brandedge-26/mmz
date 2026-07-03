"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const items          = useCartStore((s) => s.items);
  const removeItem     = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart      = useCartStore((s) => s.clearCart);
  const totalPrice     = useCartStore((s) => s.totalPrice);

  const count    = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = totalPrice();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Cart</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
            Shopping Cart
            {count > 0 && <span className="ml-3 text-lg font-semibold text-gray-400">({count} items)</span>}
          </h1>

          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-violet-300" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs">Looks like you haven&apos;t added anything yet. Browse our products and find something you love!</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">

              {/* Cart items */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
<ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.color}`} className="flex items-start gap-3 px-4 sm:px-6 py-4">

                      {/* Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                      </div>

                      {/* Info + controls */}
                      <div className="flex-1 min-w-0">
                        {/* Top: name info */}
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-violet-600">{item.brand}</p>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors line-clamp-2 mt-0.5 block"
                        >
                          {item.name}
                        </Link>
                        {item.color && (
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Color: {item.color}</p>
                        )}

                        {/* Bottom row: qty + price + delete */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          {/* Qty controls */}
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price + delete */}
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                                PKR {(item.price * item.quantity).toLocaleString()}
                              </p>
                              {item.originalPrice && (
                                <p className="text-[10px] text-gray-400 line-through">
                                  PKR {item.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.color)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href="/products"
                    className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-sm font-semibold text-red-400 hover:text-red-600 transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-6 lg:mt-0 sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                  <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.color}`} className="flex items-start justify-between gap-3">
                        <span className="text-gray-500 line-clamp-1 flex-1">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-800 shrink-0">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subtotal ({count} items)</span>
                      <span className="font-semibold text-gray-800">PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-emerald-600 font-semibold">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">PKR {subtotal.toLocaleString()}</span>
                  </div>

                  <button className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors">
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Secure checkout · Free returns
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
