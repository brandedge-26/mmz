"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Search, RefreshCw, Phone, Mail, Eye, Trash2, X, Reply, ChevronLeft, ChevronRight } from "lucide-react";
import { privateAxios } from "@/lib/axios";
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

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

const LIMIT = 10;

const STATUS_TABS = ["all", "new", "read", "replied"];

const STATUS_STYLES: Record<string, string> = {
  new:     "bg-blue-100 text-blue-700",
  read:    "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
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
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPages().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
              p === page
                ? "bg-violet-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Detail Modal / Bottom Sheet ───────────────────────────────────────────────
function DetailModal({
  contact,
  onClose,
  onStatusChange,
}: {
  contact: Contact;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [status, setStatus]     = useState(contact.status);
  const [saving, setSaving]     = useState(false);

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    try {
      await privateAxios.patch(`/contact/${contact._id}/status`, { status: newStatus });
      setStatus(newStatus as Contact["status"]);
      onStatusChange(contact._id, newStatus);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[80vh] animate-slide-up sm:animate-fade-in">

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">{contact.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{fmt(contact.createdAt)}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <span className="flex-1">{contact.phone}</span>
                  <a
                    href={toWa(contact.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 hover:bg-green-100 transition"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-green-600" />
                  </a>
                </div>
              )}
            </div>

            {/* Status change */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Status</p>
              <div className="flex items-center gap-2">
                {(["new", "read", "replied"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={saving || status === s}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                      status === s
                        ? STATUS_STYLES[s] + " ring-2 ring-offset-1 " + (s === "new" ? "ring-blue-400" : s === "replied" ? "ring-green-400" : "ring-gray-400")
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {saving && <div className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />}
              </div>
            </div>

            {/* Subject */}
            {contact.subject && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-gray-800">{contact.subject}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Message</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
            >
              Close
            </button>
            {contact.email && (
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(contact.email)}&su=${encodeURIComponent(`Re: ${contact.subject || "Your message"}`)}`}
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
function DeleteModal({ contact, onConfirm, onClose, deleting }: {
  contact: Contact;
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
            <h3 className="text-base font-bold text-gray-900">Delete Message?</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              Message from <span className="font-semibold text-gray-700">{contact.name}</span> will be permanently deleted.
            </p>
          </div>
          <div className="px-5 py-4 flex gap-2.5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);

  const [viewContact, setViewContact]   = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchContacts = async (p = page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(LIMIT) };
      if (activeTab !== "all") params.status = activeTab;
      const res = await privateAxios.get("/contact", { params });
      setContacts(res.data.data ?? []);
      setTotal(res.data.total ?? 0);
      setPages(res.data.pages ?? 1);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchContacts(1);
  }, [activeTab]);

  useEffect(() => {
    if (page !== 1) fetchContacts(page);
  }, [page]);

  // client-side search within current page
  const filtered = contacts.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    );
  });

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const handleView = (c: Contact) => {
    setViewContact(c);
    if (c.status === "new") {
      privateAxios.patch(`/contact/${c._id}/status`, { status: "read" }).catch(() => {});
      setContacts((prev) => prev.map((x) => x._id === c._id ? { ...x, status: "read" } : x));
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setContacts((prev) => prev.map((c) => c._id === id ? { ...c, status: status as Contact["status"] } : c));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/contact/${deleteTarget._id}`);
      setContacts((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      if (contacts.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = (page - 1) * LIMIT + 1;
  const end   = Math.min(page * LIMIT, total);

  return (
    <>
      <Topbar title="Contacts" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total messages</p>
          </div>
          <button
            onClick={() => fetchContacts(page)}
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
                placeholder="Search by name, email, subject…"
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

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <MessageSquare className="w-12 h-12 text-gray-200" />
                <p className="text-gray-400 font-medium">No messages found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Sender", "Subject", "Message", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((c) => (
                    <tr
                      key={c._id}
                      className={`hover:bg-gray-50 transition-colors ${c.status === "new" ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <p className={`font-semibold ${c.status === "new" ? "text-gray-900" : "text-gray-700"}`}>{c.name}</p>
                        {c.email && (
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                            <Mail className="w-3 h-3" /> {c.email}
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-[160px]">
                        <p className="font-medium text-gray-700 truncate">{c.subject || "—"}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[260px]">
                        <p className="text-gray-500 truncate text-xs leading-relaxed">{c.message}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{fmt(c.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleView(c)}
                            title="View detail"
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
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
            )}
          </div>

          {/* Footer: count + pagination */}
          {!loading && total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {total === 0 ? 0 : start}–{end} of {total} messages
              </p>
              <Pagination page={page} pages={pages} onPage={goToPage} />
            </div>
          )}
        </div>
      </div>

      {viewContact && (
        <DetailModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          contact={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
