"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Package, CheckCircle2, ShoppingBag, XCircle, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import { publicAxios } from "@/lib/axios";

interface OrderItem {
  productId:     string;
  slug:          string;
  name:          string;
  brand:         string;
  price:         number;
  originalPrice?: number;
  image:         string;
  color?:        string;
  quantity:      number;
}

interface Shipping {
  fullName: string;
  email:    string;
  phone:    string;
  address:  string;
  city:     string;
  notes:    string;
}

interface Order {
  _id:           string;
  orderNumber:   string;
  status:        "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: string;
  items:         OrderItem[];
  shipping:      Shipping;
  subtotal:      number;
  shippingFee:   number;
  total:         number;
  createdAt:     string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-violet-100 text-violet-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending:    "Pending",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day:    "numeric",
    month:  "long",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }      = use(params);
  const searchParams = useSearchParams();
  const isNew       = searchParams.get("new") === "1";

  const [order,          setOrder]          = useState<Order | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [cancelConfirm,  setCancelConfirm]  = useState(false);
  const [cancelLoading,  setCancelLoading]  = useState(false);
  const [cancelError,    setCancelError]    = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await publicAxios.get(`/orders/${id}`);
        setOrder(data.order);
      } catch {
        setError("Order not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelLoading(true);
    setCancelError("");
    try {
      const { data } = await publicAxios.patch(`/orders/${order._id}/cancel`);
      setOrder(data.order);
      setCancelConfirm(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCancelError(msg || "Failed to cancel order. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pb-28 lg:pb-10 overflow-x-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/orders" className="hover:text-violet-600 transition-colors">My Orders</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-gray-700 font-medium">Order Details</span>
          </nav>

          {/* ── Success banner (shown right after placing order) ── */}
          {isNew && !loading && order && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800">Order Placed Successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Thank you for your order. We&apos;ll contact you soon to confirm delivery.
                </p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="h-4 w-40 bg-gray-200 rounded-full mb-3" />
                  <div className="h-3 w-64 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-violet-300" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Order not found</h2>
              <p className="text-gray-400 text-sm mb-8">{error}</p>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
              >
                Back to Orders
              </Link>
            </div>
          )}

          {/* Order detail */}
          {!loading && !error && order && (
            <div className="space-y-4">

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order placed</p>
                    <h1 className="text-xl font-extrabold text-gray-900">{order.orderNumber}</h1>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </h2>
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600">{item.brand}</p>
                        <p className="text-sm font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-2">{item.name}</p>
                        {item.color && <p className="text-xs text-gray-400 mt-0.5">Color: {item.color}</p>}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-sm font-extrabold text-gray-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.originalPrice && (
                          <p className="text-[10px] text-gray-400 line-through">
                            PKR {item.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Name",    value: order.shipping.fullName },
                    { label: "Phone",   value: order.shipping.phone },
                    { label: "Email",   value: order.shipping.email },
                    { label: "City",    value: order.shipping.city },
                    { label: "Address", value: order.shipping.address },
                    ...(order.shipping.notes ? [{ label: "Notes", value: order.shipping.notes }] : []),
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="font-semibold text-gray-800 break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment + Price breakdown — 2 col on sm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Payment</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Method</p>
                      <p className="font-semibold text-gray-800">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Price Breakdown</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-800">PKR {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className={order.shippingFee === 0 ? "text-emerald-600 font-semibold" : "font-semibold text-gray-800"}>
                        {order.shippingFee === 0 ? "Free" : `PKR ${order.shippingFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-lg font-extrabold text-gray-900">PKR {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 pb-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 hover:border-violet-300 text-gray-700 hover:text-violet-700 font-semibold text-sm rounded-full transition-colors"
                >
                  My Orders
                </Link>
                {["pending", "processing"].includes(order.status) && (
                  <button
                    onClick={() => { setCancelConfirm(true); setCancelError(""); }}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-red-200 hover:border-red-400 text-red-500 hover:text-red-600 font-semibold text-sm rounded-full transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Order
                  </button>
                )}
              </div>

              {/* Cancel confirmation dialog */}
              {cancelConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                  <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900">Cancel Order?</h3>
                        <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone.</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-5">
                      Are you sure you want to cancel order <span className="font-bold text-gray-900">{order.orderNumber}</span>?
                    </p>
                    {cancelError && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">{cancelError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCancelConfirm(false)}
                        disabled={cancelLoading}
                        className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Keep Order
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={cancelLoading}
                        className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-60"
                      >
                        {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </>
  );
}
