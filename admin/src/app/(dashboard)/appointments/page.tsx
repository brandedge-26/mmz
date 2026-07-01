"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck, Search, RefreshCw, Phone, Mail, MapPin, Clock,
  Eye, Trash2, X, ChevronLeft, ChevronRight, Reply,
} from "lucide-react";
import { privateAxios } from "@/lib/axios";
import Topbar from "@/components/Topbar";

interface Appointment {
  _id: string;
  trackingId?: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  brand: string;
  model: string;
  issues: string[];
  serviceType: string;
  streetAddress: string;
  zipCode: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  createdAt: string;
}

const LIMIT = 10;

const STATUS_TABS = ["all", "pending", "confirmed", "in-progress", "completed", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending:       "bg-yellow-100 text-yellow-700",
  confirmed:     "bg-blue-100 text-blue-700",
  "in-progress": "bg-violet-100 text-violet-700",
  completed:     "bg-green-100 text-green-700",
  cancelled:     "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr: (number | "…")[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (page > 3) arr.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) arr.push(i);
      if (page < pages - 2) arr.push("…");
      arr.push(pages);
    }
    return arr;
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPages().map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">…</span>
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

// ── Detail Modal / Bottom Sheet ───────────────────────────────────────────────
function DetailModal({
  appt,
  onClose,
  onStatusChange,
}: {
  appt: Appointment;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [status, setStatus] = useState(appt.status);
  const [saving, setSaving] = useState(false);

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const handleStatusChange = async (s: string) => {
    setSaving(true);
    try {
      await privateAxios.patch(`/appointments/${appt._id}/status`, { status: s });
      setStatus(s);
      onStatusChange(appt._id, s);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-fade-in">

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">{appt.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-400">Booked {fmt(appt.createdAt)}</p>
                {appt.trackingId && (
                  <span className="text-[10px] font-mono font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                    {appt.trackingId}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <span>{appt.phone}</span>
              </div>
              {appt.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <span className="truncate">{appt.email}</span>
                </div>
              )}
            </div>

            {/* Device */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Device</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">{appt.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Brand / Model</span>
                  <span className="font-medium text-gray-800">{appt.brand} {appt.model}</span>
                </div>
                {appt.issues?.length > 0 && (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500 shrink-0">Issues</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {appt.issues.map((issue) => (
                        <span key={issue} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px] font-medium">{issue}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Service</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${appt.serviceType === "visit-store" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                    {appt.serviceType === "visit-store" ? "Visit Store" : "Mail-In"}
                  </span>
                </div>
                {appt.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Schedule</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5 text-gray-400" /> {appt.date}
                      {appt.time && <><Clock className="w-3.5 h-3.5 text-gray-400 ml-1" /> {appt.time}</>}
                    </span>
                  </div>
                )}
                {appt.streetAddress && (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500 shrink-0">Address</span>
                    <span className="font-medium text-gray-800 text-right flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /> {appt.streetAddress}
                    </span>
                  </div>
                )}
                {appt.zipCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-800">{appt.zipCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {appt.notes && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Notes</p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{appt.notes}</p>
                </div>
              </div>
            )}

            {/* Status change */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {["pending", "confirmed", "in-progress", "completed", "cancelled"].map((s) => (
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
                    {s}
                  </button>
                ))}
                {saving && <div className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin self-center" />}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 flex gap-2.5">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Close
            </button>
            {appt.email && (
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(appt.email)}&su=${encodeURIComponent(`Re: Your Appointment — ${appt.brand} ${appt.model}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2"
              >
                <Reply className="w-4 h-4" /> Reply via Gmail
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ appt, onConfirm, onClose, deleting }: {
  appt: Appointment;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up sm:animate-fade-in">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-5 pt-5 pb-2 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Appointment?</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              Appointment from <span className="font-semibold text-gray-700">{appt.name}</span> will be permanently deleted.
            </p>
          </div>
          <div className="px-5 py-4 flex gap-2.5">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60">
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [activeTab, setActiveTab]       = useState("all");
  const [page, setPage]                 = useState(1);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);

  const [viewAppt, setViewAppt]         = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchAppointments = async (p = page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(LIMIT) };
      if (activeTab !== "all") params.status = activeTab;
      const res = await privateAxios.get("/appointments", { params });
      setAppointments(res.data.data ?? []);
      setTotal(res.data.total ?? 0);
      setPages(res.data.pages ?? 1);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1); fetchAppointments(1); }, [activeTab]);
  useEffect(() => { if (page !== 1) fetchAppointments(page); }, [page]);

  const filtered = appointments.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.brand.toLowerCase().includes(q) ||
      a.model?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q)
    );
  });

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const handleStatusChange = (id: string, status: string) => {
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/appointments/${deleteTarget._id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      if (appointments.length === 1 && page > 1) setPage((p) => p - 1);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  const goToPage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const start = (page - 1) * LIMIT + 1;
  const end   = Math.min(page * LIMIT, total);

  return (
    <>
      <Topbar title="Appointments" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total appointments</p>
          </div>
          <button
            onClick={() => fetchAppointments(page)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, device…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                    activeTab === tab ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab === "all" ? "All" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <CalendarCheck className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-medium">No appointments found</p>
            </div>
          ) : (
            <>
              {/* ── Mobile cards ── */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map((a) => (
                  <div key={a._id} className="p-4 space-y-3">
                    {/* Top row: name + actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Phone className="w-3 h-3" /> {a.phone}
                        </div>
                        {a.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail className="w-3 h-3" /> {a.email}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setViewAppt(a)}
                          className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(a)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Device + issues */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Device</p>
                        <p className="text-sm font-medium text-gray-800">{a.brand} {a.model}</p>
                        <p className="text-xs text-gray-400">{a.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Issues</p>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {a.issues.slice(0, 2).map((issue) => (
                            <span key={issue} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                              {issue}
                            </span>
                          ))}
                          {a.issues.length > 2 && (
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full text-[10px] font-semibold">
                              +{a.issues.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: status + service + date */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={a.status} />
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        a.serviceType === "visit-store" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {a.serviceType === "visit-store" ? "Visit Store" : "Mail-In"}
                      </span>
                      {a.date && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" /> {a.date}{a.time ? ` · ${a.time}` : ""}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{fmt(a.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {["Customer", "Device", "Issues", "Service", "Schedule", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">{a.name}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {a.phone}
                          </div>
                          {a.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Mail className="w-3 h-3" /> {a.email}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">{a.brand} {a.model}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.category}</p>
                        </td>
                        <td className="px-5 py-4 max-w-[180px]">
                          <div className="flex flex-wrap gap-1">
                            {a.issues.slice(0, 2).map((issue) => (
                              <span key={issue} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                                {issue}
                              </span>
                            ))}
                            {a.issues.length > 2 && (
                              <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full text-[10px] font-semibold">
                                +{a.issues.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            a.serviceType === "visit-store" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                          }`}>
                            {a.serviceType === "visit-store" ? "Visit Store" : "Mail-In"}
                          </span>
                          {a.streetAddress && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{a.streetAddress}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {a.date ? (
                            <div>
                              <p className="text-sm font-medium text-gray-800">{a.date}</p>
                              {a.time && (
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                  <Clock className="w-3 h-3" /> {a.time}
                                </div>
                              )}
                            </div>
                          ) : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                        <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{fmt(a.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setViewAppt(a)} title="View"
                              className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget(a)} title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Footer */}
          {!loading && total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {total === 0 ? 0 : start}–{end} of {total} appointments
              </p>
              <Pagination page={page} pages={pages} onPage={goToPage} />
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewAppt && (
        <DetailModal
          appt={viewAppt}
          onClose={() => setViewAppt(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteModal
          appt={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
