"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, Truck, AlertCircle, CheckCircle2, Package } from "lucide-react";
import Header from "@/components/Header";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { privateAxios, publicAxios } from "@/lib/axios";

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const items      = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart  = useCartStore((s) => s.clearCart);

  const user            = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);

  const subtotal    = totalPrice();
  const shippingFee = 0;
  const total       = subtotal + shippingFee;

  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email:    "",
    phone:    "",
    address:  "",
    city:     "",
    notes:    "",
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState<{ orderId: string; orderNumber: string } | null>(null);

  // Pre-fill form from user profile when auth is ready
  useEffect(() => {
    if (isInitialized && user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email:    prev.email    || user.email || "",
      }));
    }
  }, [isInitialized, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const orderItems = items.map((item) => ({
      productId:     item.id,
      slug:          item.slug,
      name:          item.name,
      brand:         item.brand,
      price:         item.price,
      originalPrice: item.originalPrice,
      image:         item.image,
      color:         item.color,
      quantity:      item.quantity,
    }));

    setLoading(true);
    try {
      const axios = isAuthenticated ? privateAxios : publicAxios;
      const { data } = await axios.post("/orders", {
        items:         orderItems,
        shipping:      form,
        subtotal,
        shippingFee,
        total,
        paymentMethod: "cod",
      });

      setSuccess({ orderId: data.order._id, orderNumber: data.order.orderNumber });
      clearCart();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success overlay
  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pb-24 lg:pb-8 overflow-x-hidden flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Order Placed!</h2>
            <p className="text-sm text-gray-400 mb-4">
              Thank you for your order. We&apos;ll process it shortly.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-xl mb-6">
              <Package className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-bold text-violet-700 font-mono tracking-widest">{success.orderNumber}</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/orders/${success.orderId}`)}
                className="w-full py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-colors"
              >
                View Order
              </button>
              <Link
                href="/"
                className="block w-full py-3 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Empty cart state
  if (isInitialized && items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pb-24 lg:pb-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-violet-300" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs">
                Add some items to your cart before checking out.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Go to Shop
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-colors placeholder-gray-400 bg-white";
  const disabledInputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pb-24 lg:pb-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cart" className="hover:text-violet-600 transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Checkout</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="lg:grid lg:grid-cols-[1fr_340px] gap-8 items-start">

              {/* ── Left: Shipping form ───────────────────────────── */}
              <div className="space-y-6">

                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-sm font-bold text-gray-900 mb-5">Shipping Details</h2>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Email <span className="text-red-400">*</span>
                      </label>
                      {isAuthenticated ? (
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          disabled
                          className={disabledInputClass}
                        />
                      ) : (
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className={inputClass}
                        />
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 300 0000000"
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Address <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House/Flat No., Street, Area"
                        required
                        rows={3}
                        className={inputClass + " resize-none"}
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Karachi"
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Order Notes */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions for delivery..."
                        rows={2}
                        className={inputClass + " resize-none"}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="flex items-center gap-3 p-4 border-2 border-violet-500 rounded-xl bg-violet-50">
                    <div className="w-5 h-5 rounded-full border-2 border-violet-600 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Truck className="w-4 h-4 text-violet-600" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right: Order Summary ──────────────────────────── */}
              <div className="mt-6 lg:mt-0 sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h2 className="text-sm font-bold text-gray-900">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                          {item.color && (
                            <p className="text-[10px] text-gray-400">Color: {item.color}</p>
                          )}
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-bold text-gray-900 shrink-0">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-800">PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-emerald-600 font-semibold">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">PKR {total.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 font-bold text-sm rounded-full transition-colors ${
                      loading
                        ? "bg-violet-400 text-white cursor-not-allowed"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Secure checkout · Free returns
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
    </>
  );
}
