"use client";

import { useEffect, useState } from "react";
import {
  Tag, Plus, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, X, AlertCircle,
} from "lucide-react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Promo {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDiscount(p: Promo) {
  return p.discountType === "percentage"
    ? `${p.discountValue}%`
    : `PKR ${p.discountValue.toLocaleString()}`;
}

function promoStatus(p: Promo): { label: string; cls: string } {
  if (!p.isActive)                                          return { label: "Inactive",  cls: "bg-gray-100 text-gray-500" };
  if (p.expiryDate && new Date(p.expiryDate) < new Date()) return { label: "Expired",   cls: "bg-red-100 text-red-600" };
  if (p.usageLimit !== null && p.usedCount >= p.usageLimit) return { label: "Exhausted", cls: "bg-orange-100 text-orange-600" };
  return { label: "Active", cls: "bg-green-100 text-green-700" };
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────

function DeleteModal({ promo, onConfirm, onClose, deleting }: {
  promo: Promo;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Delete Promo Code?</h3>
          <p className="text-sm text-gray-500 mb-5">
            Code <span className="font-mono font-bold text-gray-800">{promo.code}</span> will be permanently deleted.
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-60">
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Create Promo Modal ────────────────────────────────────────────────────────

interface CreateForm {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minOrderAmount: string;
  usageLimit: string;
  expiryDate: string;
}

const EMPTY_FORM: CreateForm = {
  code: "", discountType: "percentage", discountValue: "",
  minOrderAmount: "", usageLimit: "", expiryDate: "",
};

function CreateModal({ onCreated, onClose }: {
  onCreated: (p: Promo) => void;
  onClose: () => void;
}) {
  const [form, setForm]     = useState<CreateForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k: keyof CreateForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { data } = await privateAxios.post("/promos", {
        code:           form.code.trim().toUpperCase(),
        discountType:   form.discountType,
        discountValue:  Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        usageLimit:     form.usageLimit     ? Number(form.usageLimit)     : null,
        expiryDate:     form.expiryDate     || null,
      });
      onCreated(data.promo);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Failed to create promo code.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Tag className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">New Promo Code</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Code */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Code</label>
              <input
                required
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                className={inputCls + " font-mono tracking-widest uppercase"}
              />
            </div>

            {/* Discount type + value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => set("discountType", e.target.value as "percentage" | "fixed")}
                  className={inputCls}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (PKR)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Value {form.discountType === "percentage" ? "(%)" : "(PKR)"}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  max={form.discountType === "percentage" ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => set("discountValue", e.target.value)}
                  placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 500"}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Min order */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Min Order Amount (PKR) <span className="font-normal normal-case text-gray-400">optional</span></label>
              <input
                type="number"
                min={0}
                value={form.minOrderAmount}
                onChange={(e) => set("minOrderAmount", e.target.value)}
                placeholder="e.g. 1000"
                className={inputCls}
              />
            </div>

            {/* Usage limit + expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Usage Limit <span className="font-normal normal-case text-gray-400">optional</span></label>
                <input
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) => set("usageLimit", e.target.value)}
                  placeholder="Unlimited"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Expiry Date <span className="font-normal normal-case text-gray-400">optional</span></label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => set("expiryDate", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition disabled:opacity-60">
                {saving ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PromosPage() {
  const [promos,       setPromos]       = useState<Promo[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showCreate,   setShowCreate]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [deleting,     setDeleting]     = useState(false);
  const [toggling,     setToggling]     = useState<string | null>(null);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const { data } = await privateAxios.get("/promos");
      setPromos(data.promos ?? []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleToggle = async (promo: Promo) => {
    setToggling(promo._id);
    try {
      const { data } = await privateAxios.patch(`/promos/${promo._id}/toggle`);
      setPromos((prev) => prev.map((p) => p._id === promo._id ? data.promo : p));
    } catch { /* ignore */ } finally { setToggling(null); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/promos/${deleteTarget._id}`);
      setPromos((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch { /* ignore */ } finally { setDeleting(false); }
  };

  return (
    <>
      <Topbar title="Promo Codes" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Promo Codes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{promos.length} total codes</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchPromos} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition">
              <Plus className="w-4 h-4" /> New Code
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Tag className="w-7 h-7 text-gray-200" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-semibold">No promo codes yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first promo code to get started.</p>
              </div>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition">
                <Plus className="w-4 h-4" /> Create Code
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Code", "Discount", "Min Order", "Usage", "Expiry", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promos.map((promo) => {
                    const st = promoStatus(promo);
                    const exhausted = promo.usageLimit !== null && promo.usedCount >= promo.usageLimit;
                    return (
                      <tr key={promo._id} className="hover:bg-gray-50 transition-colors">

                        {/* Code */}
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg text-xs tracking-widest">
                            {promo.code}
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">{fmtDiscount(promo)}</span>
                          <p className="text-xs text-gray-400 capitalize">{promo.discountType}</p>
                        </td>

                        {/* Min Order */}
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {promo.minOrderAmount > 0 ? `PKR ${promo.minOrderAmount.toLocaleString()}` : "—"}
                        </td>

                        {/* Usage */}
                        <td className="px-5 py-4">
                          <span className={`font-semibold ${exhausted ? "text-red-500" : "text-gray-800"}`}>
                            {promo.usedCount}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {" / "}{promo.usageLimit ?? "∞"}
                          </span>
                        </td>

                        {/* Expiry */}
                        <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {promo.expiryDate
                            ? <span className={new Date(promo.expiryDate) < new Date() ? "text-red-500 font-semibold" : ""}>{fmtDate(promo.expiryDate)}</span>
                            : "Never"
                          }
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {/* Toggle */}
                            <button
                              onClick={() => handleToggle(promo)}
                              disabled={toggling === promo._id}
                              title={promo.isActive ? "Deactivate" : "Activate"}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition disabled:opacity-50"
                            >
                              {toggling === promo._id
                                ? <div className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                                : promo.isActive
                                  ? <ToggleRight className="w-5 h-5 text-green-500" />
                                  : <ToggleLeft className="w-5 h-5" />
                              }
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(promo)}
                              title="Delete"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateModal
          onCreated={(p) => { setPromos((prev) => [p, ...prev]); setShowCreate(false); }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          promo={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
