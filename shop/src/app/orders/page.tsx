"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, Package, Search } from "lucide-react";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/authStore";
import { privateAxios } from "@/lib/axios";
import TrackOrderModal from "@/components/TrackOrderModal";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: OrderItem[];
  total: number;
}

const STATUS_STYLES: Record<Order["status"], string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-violet-100 text-violet-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-3 w-24 bg-gray-100 rounded-full mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 bg-gray-100 rounded-full" />
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router          = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);

  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [trackOpen, setTrackOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/orders");
      return;
    }

    (async () => {
      try {
        const { data } = await privateAxios.get("/orders/my");
        setOrders(data.orders);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isInitialized, isAuthenticated, router]);

  return (
    <>
      <Header />

      {trackOpen && <TrackOrderModal onClose={() => setTrackOpen(false)} />}

      <main className="min-h-screen bg-gray-50 pb-24 lg:pb-8 overflow-x-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">My Orders</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Orders</h1>
            <button
              onClick={() => setTrackOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-violet-300" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-full transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Start Shopping
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full capitalize shrink-0 ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                        {order.items[0] && ` · ${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`}
                      </p>
                      <p className="text-sm font-extrabold text-gray-900">
                        PKR {order.total.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href={`/orders/${order._id}`}
                        className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
