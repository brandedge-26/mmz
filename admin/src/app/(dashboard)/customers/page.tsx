"use client";

import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Mail, X, Trash2, Eye, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";
import { privateAxios } from "@/lib/axios";
import Topbar from "@/components/Topbar";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const LIMIT = 10;

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

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const initials = customer.name
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up sm:animate-fade-in">
          <div className="flex justify-center pt-2.5 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Customer Details</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-700 font-bold text-base">{initials}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">{customer.name}</p>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium capitalize">{customer.role}</span>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl divide-y divide-gray-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <UserCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm text-gray-500">Joined</span>
                <span className="text-sm text-gray-700 ml-auto">{fmt(customer.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
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
function DeleteModal({ customer, onConfirm, onClose, deleting }: {
  customer: Customer;
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
            <h3 className="text-base font-bold text-gray-900">Delete Customer?</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              <span className="font-semibold text-gray-700">{customer.name}</span> will be permanently removed.
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
export default function CustomersPage() {
  const [customers, setCustomers]         = useState<Customer[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [page, setPage]                   = useState(1);
  const [total, setTotal]                 = useState(0);
  const [pages, setPages]                 = useState(1);
  const [viewCustomer, setViewCustomer]   = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Customer | null>(null);
  const [deleting, setDeleting]           = useState(false);

  const fetchCustomers = async (p = page, q = search) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(LIMIT) };
      if (q.trim()) params.search = q.trim();
      const res = await privateAxios.get("/users", { params });
      setCustomers(res.data.data ?? []);
      setTotal(res.data.total ?? 0);
      setPages(res.data.pages ?? 1);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(1, ""); }, []);

  // Debounced server-side search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchCustomers(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { if (page !== 1) fetchCustomers(page, search); }, [page]);

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/users/${deleteTarget._id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      if (customers.length === 1 && page > 1) setPage((p) => p - 1);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  const goToPage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const start = (page - 1) * LIMIT + 1;
  const end   = Math.min(page * LIMIT, total);

  return (
    <>
      <Topbar title="Customers" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} registered customers</p>
          </div>
          <button
            onClick={() => fetchCustomers(page, search)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Search */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Users className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-medium">No customers found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Customer", "Email", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-violet-700 text-xs font-bold">{getInitials(c.name)}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{c.name}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {c.email}
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {fmt(c.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewCustomer(c)} title="View"
                          className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Footer */}
          {!loading && total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {total === 0 ? 0 : start}–{end} of {total} customers
              </p>
              <Pagination page={page} pages={pages} onPage={goToPage} />
            </div>
          )}
        </div>
      </div>

      {viewCustomer && (
        <DetailModal customer={viewCustomer} onClose={() => setViewCustomer(null)} />
      )}

      {deleteTarget && (
        <DeleteModal
          customer={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
