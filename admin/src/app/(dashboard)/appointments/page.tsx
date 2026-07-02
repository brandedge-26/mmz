"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck, Search, RefreshCw, Phone, Mail, MapPin, Clock,
  Eye, Trash2, X, ChevronLeft, ChevronRight, Reply, Wrench,
} from "lucide-react";
import { privateAxios, publicAxios } from "@/lib/axios";
import Topbar from "@/components/Topbar";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const toWa = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "92" + digits.slice(1) : digits;
  return `https://wa.me/${intl}`;
};

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
                <span className="flex-1">{appt.phone}</span>
                <a
                  href={toWa(appt.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 hover:bg-green-100 transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-green-600" />
                </a>
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

// ── Track Repair Modal ────────────────────────────────────────────────────────
interface TrackResult {
  trackingId: string;
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  category: string;
  issues: string[];
  serviceType: string;
  streetAddress: string;
  zipCode: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  createdAt: string;
}

const TRACK_STATUS_STYLES: Record<string, { pill: string; icon: string }> = {
  pending:       { pill: "bg-yellow-100 text-yellow-700", icon: "text-yellow-500" },
  confirmed:     { pill: "bg-blue-100 text-blue-700",    icon: "text-blue-500" },
  "in-progress": { pill: "bg-violet-100 text-violet-700", icon: "text-violet-500" },
  completed:     { pill: "bg-green-100 text-green-700",  icon: "text-green-500" },
  cancelled:     { pill: "bg-red-100 text-red-700",      icon: "text-red-500" },
};

function TrackRepairModal({ onClose }: { onClose: () => void }) {
  const [inputId, setInputId]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<TrackResult | null>(null);
  const [error, setError]             = useState<string | null>(null);

  const handleTrack = async () => {
    const id = inputId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await publicAxios.get(`/appointments/track/${id}`);
      setResult(res.data.data);
    } catch {
      setError("No appointment found with this tracking ID.");
    } finally {
      setLoading(false);
    }
  };

  const style = result ? (TRACK_STATUS_STYLES[result.status] ?? { pill: "bg-gray-100 text-gray-600", icon: "text-gray-400" }) : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-fade-in">

          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Track Repair</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. MMZ-A1B2C3"
                value={inputId}
                onChange={(e) => setInputId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white font-mono tracking-widest transition-all"
              />
              <button
                onClick={handleTrack}
                disabled={loading || !inputId.trim()}
                className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Result */}
            {result && style && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">

                {/* Status banner */}
                <div className={`px-4 py-3 flex items-center justify-between ${style.pill}`}>
                  <div>
                    <p className="font-bold text-sm">{result.name}</p>
                    <p className="text-[11px] font-mono opacity-70 mt-0.5">{result.trackingId}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-white/60">
                    {result.status}
                  </span>
                </div>

                {/* Contact */}
                <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Name</span>
                    <span className="font-semibold text-gray-900">{result.name}</span>
                  </div>
                  {result.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone className="w-3.5 h-3.5" /> Phone
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{result.phone}</span>
                        <a href={toWa(result.phone)} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center hover:bg-green-100 transition">
                          <WhatsAppIcon className="w-3 h-3 text-green-600" />
                        </a>
                      </div>
                    </div>
                  )}
                  {result.email && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">{result.email}</span>
                    </div>
                  )}
                </div>

                {/* Device */}
                <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Device</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Brand / Model</span>
                    <span className="font-medium text-gray-800">{result.brand} {result.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-800">{result.category}</span>
                  </div>
                  {result.issues?.length > 0 && (
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-gray-500 shrink-0">Issues</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {result.issues.map((issue) => (
                          <span key={issue} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px] font-medium">{issue}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Service */}
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service</p>
                  {result.serviceType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${result.serviceType === "visit-store" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                        {result.serviceType === "visit-store" ? "Visit Store" : "Mail-In"}
                      </span>
                    </div>
                  )}
                  {result.date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Schedule</span>
                      <span className="font-medium text-gray-800">
                        {result.date}{result.time ? ` · ${result.time}` : ""}
                      </span>
                    </div>
                  )}
                  {result.streetAddress && (
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-gray-500 shrink-0">Address</span>
                      <span className="font-medium text-gray-800 text-right">
                        {result.streetAddress}{result.zipCode ? `, ${result.zipCode}` : ""}
                      </span>
                    </div>
                  )}
                  {result.notes && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-500">Notes</span>
                      <p className="text-gray-700 bg-gray-50 rounded-lg px-3 py-2 text-xs leading-relaxed">{result.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Close
            </button>
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
  const [trackOpen, setTrackOpen]       = useState(false);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTrackOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Wrench className="w-4 h-4" /> Track Repair
            </button>
            <button
              onClick={() => fetchAppointments(page)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
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

      {/* Track Repair Modal */}
      {trackOpen && <TrackRepairModal onClose={() => setTrackOpen(false)} />}

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
