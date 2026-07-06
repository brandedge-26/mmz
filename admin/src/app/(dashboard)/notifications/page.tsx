"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Wrench, MessageSquare, XCircle, Star,
  Bell, CheckCheck, RefreshCw, Trash2, Trash,
} from "lucide-react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────

type NotificationType = "order" | "appointment" | "contact" | "cancel" | "review";

interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  refId: string | null;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { Icon: React.ElementType; bg: string; text: string; border: string; badge: string }
> = {
  order:       { Icon: ShoppingBag,  bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-500",  badge: "bg-violet-100 text-violet-700" },
  appointment: { Icon: Wrench,       bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  contact:     { Icon: MessageSquare,bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-500",    badge: "bg-blue-100 text-blue-700" },
  cancel:      { Icon: XCircle,      bg: "bg-red-50",     text: "text-red-500",     border: "border-red-500",     badge: "bg-red-100 text-red-600" },
  review:      { Icon: Star,         bg: "bg-amber-50",   text: "text-amber-500",   border: "border-amber-500",   badge: "bg-amber-100 text-amber-700" },
};

const TYPE_LABELS: Record<NotificationType, string> = {
  order: "Order", appointment: "Appointment", contact: "Contact", cancel: "Cancelled", review: "Review",
};

const TYPE_ROUTE: Record<NotificationType, string> = {
  order: "/orders", cancel: "/orders", appointment: "/appointments", contact: "/contacts", review: "/reviews",
};

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────

function ConfirmDialog({
  message, onConfirm, onCancel, loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-sm text-gray-700 text-center font-medium mb-5">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-60">
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-100 last:border-0 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-3 w-14 bg-gray-100 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ── Notification Row ──────────────────────────────────────────────────────────

function NotificationRow({
  notification, onMarkRead, onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.order;
  const { Icon } = cfg;

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification._id);
    router.push(TYPE_ROUTE[notification.type]);
  };

  return (
    <div className={`relative flex items-start gap-4 px-5 py-4 border-b border-gray-100 last:border-0 transition-colors group ${
      notification.read ? "bg-white hover:bg-gray-50" : "bg-violet-50/40 hover:bg-violet-50/70"
    }`}>
      {/* Unread accent */}
      {!notification.read && (
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${cfg.text} bg-current`} />
      )}

      {/* Clickable area */}
      <div className="flex items-start gap-4 flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${cfg.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {TYPE_LABELS[notification.type]}
            </span>
            <span className="text-[11px] text-gray-400">{timeAgo(notification.createdAt)}</span>
            {!notification.read && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />}
          </div>
          <p className={`text-sm font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
            {notification.title}
          </p>
          <p className="text-sm text-gray-500 mt-0.5 leading-snug line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>

      {/* Delete btn */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notification._id); }}
        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 shrink-0 self-center"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [marking,       setMarking]       = useState(false);
  const [visible,       setVisible]       = useState(PAGE_SIZE);

  // confirm state: "one" | "all" | null
  const [confirm,        setConfirm]       = useState<"one" | "all" | null>(null);
  const [deleteTarget,   setDeleteTarget]  = useState<string | null>(null);
  const [deleteLoading,  setDeleteLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setVisible(PAGE_SIZE);
    try {
      const { data } = await privateAxios.get("/notifications");
      setNotifications(data.notifications ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    try {
      await privateAxios.patch(`/notifications/${id}/read`);
    } catch {
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: false } : n));
    }
  };

  const handleMarkAllRead = async () => {
    if (marking) return;
    setMarking(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await privateAxios.patch("/notifications/read-all");
    } catch {
      await fetchNotifications();
    } finally {
      setMarking(false);
    }
  };

  // Delete one — ask confirm
  const askDeleteOne = (id: string) => {
    setDeleteTarget(id);
    setConfirm("one");
  };

  // Delete all — ask confirm
  const askDeleteAll = () => {
    setConfirm("all");
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      if (confirm === "one" && deleteTarget) {
        await privateAxios.delete(`/notifications/${deleteTarget}`);
        setNotifications((prev) => prev.filter((n) => n._id !== deleteTarget));
      } else if (confirm === "all") {
        await privateAxios.delete("/notifications/all");
        setNotifications([]);
      }
      setConfirm(null);
      setDeleteTarget(null);
    } catch {
      setConfirm(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Topbar title="Notifications" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={fetchNotifications} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} disabled={marking}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-60">
                <CheckCheck className="w-4 h-4" />
                {marking ? "Marking…" : "Mark all read"}
              </button>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-200" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-semibold">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">New orders, bookings and messages will appear here.</p>
              </div>
            </div>
          ) : (
            <div>
              {notifications.slice(0, visible).map((n) => (
                <NotificationRow
                  key={n._id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={askDeleteOne}
                />
              ))}
              {visible < notifications.length && (
                <div className="px-5 py-4 border-t border-gray-100 text-center">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition">
                    Show more ({notifications.length - visible} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete all btn */}
        {!loading && notifications.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={askDeleteAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition"
            >
              <Trash className="w-4 h-4" />
              Delete all notifications
            </button>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={
            confirm === "one"
              ? "Are you sure you want to delete this notification?"
              : `Are you sure you want to delete all ${notifications.length} notifications? This cannot be undone.`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => { setConfirm(null); setDeleteTarget(null); }}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
