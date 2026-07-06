"use client";

import { useEffect, useState, useCallback } from "react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";
import {
  Star, Search, Trash2, Eye, X, Package,
  RefreshCw, ChevronLeft, ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReviewProduct {
  _id: string;
  name: string;
  image: string;
  category: string;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
  product: ReviewProduct | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

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

// ── Detail Modal ───────────────────────────────────────────────────────────────

function DetailModal({ review, onClose, onDelete }: { review: Review; onClose: () => void; onDelete: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">Review Details</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Body */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
            {/* Product */}
            {review.product && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0">
                  {review.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.product.image} alt={review.product.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-600">{review.product.category}</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{review.product.name}</p>
                </div>
              </div>
            )}

            {/* Reviewer */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400 font-medium">Reviewer</span>
                <span className="text-sm font-semibold text-gray-800">{review.userName}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400 font-medium">Rating</span>
                <div className="flex items-center gap-1.5">
                  <StarRow rating={review.rating} />
                  <span className="text-xs font-bold text-amber-500">{review.rating}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400 font-medium">Date</span>
                <span className="text-sm text-gray-700">{fmt(review.createdAt)}</span>
              </div>
            </div>

            {/* Review body */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Review</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                {review.body}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Close
            </button>
            <button onClick={onDelete}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────

function DeleteModal({ review, onConfirm, onClose, deleting }: {
  review: Review;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-5 pt-5 pb-2 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Review?</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              Review by <span className="font-semibold text-gray-700">{review.userName}</span> will be permanently deleted.
            </p>
          </div>
          <div className="px-5 py-4 flex gap-2.5">
            <button onClick={onClose} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50">
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

// ── Main Page ──────────────────────────────────────────────────────────────────

const PER_PAGE = 15;

export default function ReviewsPage() {
  const [reviews,      setReviews]      = useState<Review[]>([]);
  const [total,        setTotal]        = useState(0);
  const [pages,        setPages]        = useState(1);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [debouncedQ,   setDebouncedQ]   = useState("");
  const [viewReview,   setViewReview]   = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchReviews = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PER_PAGE) });
      if (debouncedQ) params.set("q", debouncedQ);
      const { data } = await privateAxios.get(`/reviews/all?${params}`);
      setReviews(data.reviews ?? []);
      setTotal(data.total ?? 0);
      setPages(Math.max(1, data.pages ?? 1));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ]);

  useEffect(() => { fetchReviews(page); }, [fetchReviews, page]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/reviews/${deleteTarget._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      setViewReview(null);
      if (reviews.length === 1 && page > 1) setPage((p) => p - 1);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Topbar title="Reviews" />

      <div className="p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total reviews</p>
          </div>
          <button onClick={() => fetchReviews(page)} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Search */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by reviewer or content…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Star className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-medium">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Product", "Reviewer", "Rating", "Review", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0">
                            {review.product?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={review.product.image} alt={review.product.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[180px]">
                              {review.product?.name ?? "—"}
                            </p>
                            <p className="text-[10px] text-gray-400">{review.product?.category ?? ""}</p>
                          </div>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <StarRow rating={review.rating} />
                          <span className="text-xs font-bold text-amber-500">{review.rating}</span>
                        </div>
                      </td>

                      {/* Review body */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <p className="text-sm text-gray-600 line-clamp-2">{review.body}</p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {fmt(review.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewReview(review)} title="View"
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(review)} title="Delete"
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
          )}

          {/* Footer */}
          {!loading && total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total} reviews
              </p>
              <Pagination page={page} pages={pages} onPage={(p) => setPage(p)} />
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewReview && (
        <DetailModal
          review={viewReview}
          onClose={() => setViewReview(null)}
          onDelete={() => { setDeleteTarget(viewReview); setViewReview(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
