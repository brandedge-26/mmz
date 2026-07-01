"use client";

import { useState } from "react";
import { X, Search, CheckCircle2, Clock, Wrench, XCircle, Package } from "lucide-react";

interface TrackResult {
  trackingId: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  status: string;
  serviceType: string;
  date: string;
  time: string;
  createdAt: string;
  issues: string[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:       { label: "Pending",     color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200",  icon: <Clock className="w-5 h-5 text-yellow-500" /> },
  confirmed:     { label: "Confirmed",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" /> },
  "in-progress": { label: "In Progress", color: "text-violet-700", bg: "bg-violet-50 border-violet-200",  icon: <Wrench className="w-5 h-5 text-violet-500" /> },
  completed:     { label: "Completed",   color: "text-green-700",  bg: "bg-green-50 border-green-200",    icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
  cancelled:     { label: "Cancelled",   color: "text-red-700",    bg: "bg-red-50 border-red-200",        icon: <XCircle className="w-5 h-5 text-red-500" /> },
};

interface Props {
  onClose: () => void;
}

export default function TrackRepairModal({ onClose }: Props) {
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<TrackResult | null>(null);
  const [error, setError]       = useState("");

  const handleTrack = async () => {
    const id = input.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/track/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Not found.");
      setResult(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const statusCfg = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG.pending) : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]"
          style={{ animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both" }}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">Track Your Repair</h2>
              <p className="text-xs text-gray-400 mt-0.5">Enter your booking ID to check status</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 flex-1 space-y-4">

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="e.g. MMZ-A1B2C3"
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal"
              />
              <button
                onClick={handleTrack}
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Search className="w-4 h-4" />
                }
                Track
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Result */}
            {result && statusCfg && (
              <div className="space-y-3">
                {/* Status card */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${statusCfg.bg}`}>
                  {statusCfg.icon}
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Current Status</p>
                    <p className={`text-base font-bold ${statusCfg.color}`}>{statusCfg.label}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-gray-400 font-mono">{result.trackingId}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmt(result.createdAt)}</p>
                  </div>
                </div>

                {/* Device info */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl divide-y divide-gray-100">
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Device</span>
                    <span className="font-semibold text-gray-800">{result.brand} {result.model}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-400">Category</span>
                    <span className="font-medium text-gray-700">{result.category}</span>
                  </div>
                  {result.issues?.length > 0 && (
                    <div className="px-4 py-3 text-sm">
                      <span className="text-gray-400 block mb-1.5">Issues</span>
                      <div className="flex flex-wrap gap-1">
                        {result.issues.map((i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px] font-medium">{i}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-400">Service</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${result.serviceType === "visit-store" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                      {result.serviceType === "visit-store" ? "Visit Store" : "Mail-In"}
                    </span>
                  </div>
                  {result.date && (
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-gray-400">Scheduled</span>
                      <span className="font-medium text-gray-700">{result.date}{result.time ? ` · ${result.time}` : ""}</span>
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

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { opacity: 0; transform: scale(0.97); }
            to   { opacity: 1; transform: scale(1); }
          }
        }
      `}</style>
    </>
  );
}
