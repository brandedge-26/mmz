"use client";

import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";
import {
  Search, Eye, ChevronLeft, ChevronRight,
  RefreshCw, Package, X, Trash2, Phone, Mail, MapPin,
  Clock, Loader2, Truck, CheckCircle, XCircle, ShoppingBag,
} from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
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
  status:        OrderStatus;
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

const ALL_STATUSES: Array<"all" | OrderStatus> = [
  "all", "pending", "processing", "shipped", "delivered", "cancelled",
];

const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  order, onClose, onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (s: OrderStatus) => {
    setSaving(true);
    try {
      await privateAxios.patch(`/orders/${order._id}/status`, { status: s });
      setStatus(s);
      onStatusChange(order._id, s);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">

          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-2.5 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">{order.orderNumber}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Placed {fmt(order.createdAt)}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <span>{order.shipping.phone}</span>
                <a
                  href={`https://wa.me/${order.shipping.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="ml-0.5 shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <span className="truncate">{order.shipping.email}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3.5 py-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600">{item.brand}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.color ? `Color: ${item.color} · ` : ""}Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                {[
                  ["Name",    order.shipping.fullName],
                  ["City",    order.shipping.city],
                  ["Address", order.shipping.address],
                  ...(order.shipping.notes ? [["Notes", order.shipping.notes]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500 shrink-0">{label}</span>
                    <span className="font-medium text-gray-800 text-right break-words">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500 shrink-0">Address</span>
                  <span className="font-medium text-gray-800 text-right flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    {order.shipping.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Payment</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-800">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">PKR {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-800">
                    {order.shippingFee === 0 ? "Free" : `PKR ${order.shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-1.5">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-gray-900">PKR {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Status update — pill buttons like appointments */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={saving || status === s}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                      status === s
                        ? (STATUS_STYLES[s] ?? "bg-gray-100 text-gray-600") + " ring-2 ring-offset-1 ring-current"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                {saving && (
                  <div className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin self-center" />
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  order, onConfirm, onClose, deleting,
}: {
  order: Order;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={!deleting ? onClose : undefined} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-5 pt-5 pb-2 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Order?</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              Order <span className="font-semibold text-gray-700">{order.orderNumber}</span> from{" "}
              <span className="font-semibold text-gray-700">{order.shipping.fullName}</span> will be permanently deleted.
            </p>
          </div>
          <div className="px-5 py-4 flex gap-2.5">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums: (number | "…")[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) nums.push(i);
  } else {
    nums.push(1);
    if (page > 3) nums.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
    if (page < pages - 2) nums.push("…");
    nums.push(pages);
  }
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {nums.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-gray-400 text-sm">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${p === page ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === pages}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Stats card ────────────────────────────────────────────────────────────────
interface OrderStats { total: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number }

const STAT_CARDS = [
  { key: "total",      label: "Total",      Icon: ShoppingBag,  bg: "bg-violet-50",  text: "text-violet-600",  num: "text-violet-700" },
  { key: "pending",    label: "Pending",    Icon: Clock,        bg: "bg-yellow-50",  text: "text-yellow-600",  num: "text-yellow-700" },
  { key: "processing", label: "Processing", Icon: Loader2,      bg: "bg-blue-50",    text: "text-blue-600",    num: "text-blue-700" },
  { key: "shipped",    label: "Shipped",    Icon: Truck,        bg: "bg-indigo-50",  text: "text-indigo-600",  num: "text-indigo-700" },
  { key: "delivered",  label: "Delivered",  Icon: CheckCircle,  bg: "bg-green-50",   text: "text-green-600",   num: "text-green-700" },
  { key: "cancelled",  label: "Cancelled",  Icon: XCircle,      bg: "bg-red-50",     text: "text-red-500",     num: "text-red-600" },
] as const;

// ── Main Page ─────────────────────────────────────────────────────────────────
const PER_PAGE = 10;

export default function OrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [total,        setTotal]        = useState(0);
  const [pages,        setPages]        = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [debouncedQ,   setDebouncedQ]   = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [page,         setPage]         = useState(1);
  const [viewOrder,    setViewOrder]    = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting,     setDeleting]     = useState(false);
  const [stats,        setStats]        = useState<OrderStats | null>(null);

  useEffect(() => {
    privateAxios.get("/orders/stats").then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchOrders = useCallback(async (p = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PER_PAGE) });
      if (debouncedQ)             params.set("q",      debouncedQ);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const { data } = await privateAxios.get(`/orders?${params}`);
      setOrders(data.orders ?? []);
      setTotal(data.total  ?? 0);
      setPages(Math.max(1, Math.ceil((data.total ?? 0) / PER_PAGE)));
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ, statusFilter]);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    if (viewOrder?._id === id) setViewOrder((prev) => prev ? { ...prev, status } : prev);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/orders/${deleteTarget._id}`);
      setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      if (orders.length === 1 && page > 1) setPage((p) => p - 1);
    } catch { /* ignore */ } finally { setDeleting(false); }
  };

  const goToPage = (p: number) => { setPage(p); };

  return (
    <>
      <Topbar title="Orders" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total orders</p>
          </div>
          <button
            onClick={() => fetchOrders(page)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {STAT_CARDS.map(({ key, label, Icon, bg, text, num }) => (
            <div key={key} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${num}`}>
                  {stats ? stats[key].toLocaleString() : <span className="inline-block h-6 w-10 bg-gray-100 rounded animate-pulse" />}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order #, name, phone…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                    statusFilter === s ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-medium">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{order.shipping.fullName}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                          <Phone className="w-3 h-3" /> {order.shipping.phone}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        <p>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">
                          {order.items.map((i) => i.name).join(", ")}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        PKR {order.total.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {fmt(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewOrder(order)}
                            title="View"
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(order)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total} orders
              </p>
              <Pagination page={page} pages={pages} onPage={goToPage} />
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewOrder && (
        <DetailModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteModal
          order={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
