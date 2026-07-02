"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { type ShopProduct } from "@/lib/products";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingCart, Heart, Share2, ChevronRight, Check,
  Truck, RotateCcw, ShieldCheck, Star, Minus, Plus,
} from "lucide-react";

// ─── Amazon-style image zoom ──────────────────────────────────────────────────
const ZOOM_FACTOR = 2.5;
const LENS_SIZE   = 120;

function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos]     = useState({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left)  / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top)   / rect.height));
    setPos({ x, y });
  }, []);

  const bgX = pos.x * 100;
  const bgY = pos.y * 100;

  return (
    <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
      {/* Main image */}
      <div
        ref={containerRef}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-crosshair select-none"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onMouseMove={handleMove}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain p-6 pointer-events-none"
        />
        {/* Lens */}
        {active && (
          <div
            className="absolute border-2 border-violet-400/60 bg-violet-100/20 backdrop-blur-[1px] rounded-md pointer-events-none"
            style={{
              width:  LENS_SIZE,
              height: LENS_SIZE,
              left:   `calc(${pos.x * 100}% - ${LENS_SIZE / 2}px)`,
              top:    `calc(${pos.y * 100}% - ${LENS_SIZE / 2}px)`,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.04)",
            }}
          />
        )}
      </div>

      {/* Zoomed panel — right side on large screens */}
      {active && (
        <div
          className="hidden lg:block absolute top-0 left-[calc(100%+16px)] w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl z-30 pointer-events-none"
          style={{
            backgroundImage:    `url(${src})`,
            backgroundSize:     `${ZOOM_FACTOR * 100}% ${ZOOM_FACTOR * 100}%`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            backgroundRepeat:   "no-repeat",
          }}
        />
      )}
    </div>
  );
}

const COLOR_MAP: Record<string, string> = {
  black:        "bg-gray-900",
  white:        "bg-gray-100 border-2 border-gray-300",
  red:          "bg-red-500",
  blue:         "bg-blue-500",
  "navy blue":  "bg-blue-900",
  green:        "bg-green-500",
  silver:       "bg-slate-300 border-2 border-slate-400",
  gold:         "bg-yellow-400",
  clear:        "bg-sky-100 border-2 border-sky-300",
  "matte clear":"bg-slate-200 border-2 border-slate-400",
  purple:       "bg-purple-500",
  pink:         "bg-pink-400",
  orange:       "bg-orange-500",
  yellow:       "bg-yellow-300",
  gray:         "bg-gray-400",
  brown:        "bg-amber-800",
};

const colorClass = (name: string) =>
  COLOR_MAP[name.toLowerCase()] ?? "bg-gray-400";

const BADGE_STYLES: Record<string, string> = {
  New:           "bg-violet-600 text-white",
  Hot:           "bg-red-500 text-white",
  Sale:          "bg-red-500 text-white",
  Trending:      "bg-emerald-500 text-white",
  "Best Seller": "bg-amber-500 text-white",
};

function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">({count.toLocaleString()} reviews)</span>
    </div>
  );
}

function RelatedCard({ product }: { product: ShopProduct }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${BADGE_STYLES[product.badge] ?? "bg-violet-600 text-white"}`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>
      <div className="px-3.5 pt-3 pb-4 flex flex-col gap-1">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">{product.name}</p>
        <p className="text-sm font-extrabold text-gray-900 mt-1.5">PKR {product.price.toLocaleString()}</p>
        {product.originalPrice && (
          <p className="text-xs text-gray-400 line-through -mt-1">PKR {product.originalPrice.toLocaleString()}</p>
        )}
      </div>
    </Link>
  );
}

// ─── Write Review Modal ───────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5510";

interface ReviewItem {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
}

function WriteReviewModal({
  productId, onClose, userName, onSubmitted,
}: {
  productId: string;
  onClose: () => void;
  userName: string;
  onSubmitted: (review: ReviewItem) => void;
}) {
  const [hovered, setHovered]   = useState(0);
  const [selected, setSelected] = useState(0);
  const [body, setBody]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !body.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { privateAxios } = await import("@/lib/axios");
      const res = await privateAxios.post("/reviews", {
        productId,
        rating: selected,
        body:   body.trim(),
      });
      onSubmitted(res.data.data);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to submit review. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
            </div>
            <p className="text-base font-bold text-gray-900 mb-1">Thank you, {userName.split(" ")[0]}!</p>
            <p className="text-sm text-gray-400 mb-6">Your review has been submitted and will be visible after approval.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Star picker */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating <span className="text-red-400">*</span></p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(s)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        s <= (hovered || selected)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                {selected > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][selected]}
                  </span>
                )}
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{body.length}/500</p>
            </div>

            {/* Submitting as */}
            <p className="text-xs text-gray-400">
              Reviewing as <span className="font-semibold text-gray-600">{userName}</span>
            </p>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={!selected || !body.trim() || loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-bold rounded-full transition-colors"
            >
              {loading ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Login Prompt Modal ───────────────────────────────────────────────────────

function LoginPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Login Required</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center py-10 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-violet-600" />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">Login to Write a Review</p>
          <p className="text-sm text-gray-400 mb-6">
            You need to be logged in to share your experience with this product.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <a
              href="/login"
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-full text-center transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="w-full py-3 border border-gray-200 hover:border-violet-300 text-gray-700 hover:text-violet-600 text-sm font-semibold rounded-full text-center transition"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Panel ───────────────────────────────────────────────────────────

function ReviewsPanel({ productId, initialRating, initialCount, onStatsChange }: {
  productId: string;
  initialRating: number;
  initialCount: number;
  onStatsChange: (rating: number, count: number) => void;
}) {
  const user = useAuthStore((s) => s.user);
  const [modalOpen, setModalOpen]       = useState(false);
  const [reviews, setReviews]           = useState<ReviewItem[]>([]);
  const [total, setTotal]               = useState(initialCount);
  const [rating, setRating]             = useState(initialRating);
  const [fetched, setFetched]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Fetch reviews from API
  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setFetchLoading(true);
    try {
      const res = await fetch(`${API}/api/reviews?productId=${productId}&limit=20`);
      const json = await res.json();
      const fetchedReviews = json.reviews ?? [];
      const fetchedTotal   = json.total   ?? 0;
      setReviews(fetchedReviews);
      setTotal(fetchedTotal);
      // Check if current user already reviewed
      if (user) {
        setAlreadyReviewed(fetchedReviews.some((r: ReviewItem) => r.user === user.id));
      }
      // Compute real rating from fetched reviews
      if (fetchedTotal > 0) {
        const avg = Math.round(
          (fetchedReviews.reduce((s: number, r: ReviewItem) => s + r.rating, 0) / fetchedTotal) * 10
        ) / 10;
        setRating(avg);
        onStatsChange(avg, fetchedTotal);
      } else {
        onStatsChange(0, 0);
      }
    } catch { /* ignore */ } finally {
      setFetchLoading(false);
      setFetched(true);
    }
  }, [productId, onStatsChange, user]);

  // Load when tab is rendered
  useEffect(() => { loadReviews(); }, [loadReviews]);

  function handleNewReview(review: ReviewItem) {
    setReviews((prev) => [review, ...prev]);
    const newTotal  = total + 1;
    const newRating = Math.round(
      ((rating * total + review.rating) / newTotal) * 10
    ) / 10;
    setTotal(newTotal);
    setRating(newRating);
    setAlreadyReviewed(true);
    onStatsChange(newRating, newTotal);
  }

  // Rating breakdown from real reviews
  const dist = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  const WriteReviewBtn = ({ full }: { full?: boolean }) => {
    if (alreadyReviewed) {
      return (
        <div className={`flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 ${full ? "w-full py-3 border border-emerald-100 bg-emerald-50 rounded-2xl" : "px-6 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full"}`}>
          <Check className="w-4 h-4" strokeWidth={2.5} />
          You&apos;ve already reviewed this product
        </div>
      );
    }
    return (
      <button
        onClick={() => setModalOpen(true)}
        className={
          full
            ? "w-full py-3 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors font-medium"
            : "px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors"
        }
      >
        Write a Review
      </button>
    );
  };

  return (
    <div className="max-w-3xl">
      {/* Summary card — only when there are reviews */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-6xl font-extrabold text-gray-900 leading-none">{rating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 mt-1.5">{total.toLocaleString()} reviews</span>
          </div>
          <div className="flex-1 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star, idx) => {
              const count = dist[idx];
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 w-3">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews list / empty / loading */}
      {fetchLoading && !fetched ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 border border-gray-100 rounded-2xl space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Star className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">No reviews yet</p>
          <p className="text-sm text-gray-400 mb-6">Be the first to share your experience with this product.</p>
          <WriteReviewBtn />
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r._id} className="p-5 border border-gray-100 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                    {r.userName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.userName}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(r.createdAt).toLocaleDateString("en-PK", { month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Check className="w-3 h-3 text-emerald-500" /> Verified Purchase
              </span>
            </div>
          ))}

          <WriteReviewBtn full />
        </div>
      )}

      {/* Modals */}
      {modalOpen && user && (
        <WriteReviewModal
          productId={productId}
          userName={user.name}
          onClose={() => setModalOpen(false)}
          onSubmitted={(review) => { handleNewReview(review); setModalOpen(false); }}
        />
      )}
      {modalOpen && !user && (
        <LoginPromptModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  product: ShopProduct;
  related: ShopProduct[];
}

export default function ProductDetail({ product, related }: Props) {
  const [activeImage, setActiveImage]   = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [qty, setQty]                   = useState(1);
  const [added, setAdded]               = useState(false);
  const [wished, setWished]             = useState(false);
  const [copied, setCopied]             = useState(false);
  const [activeTab, setActiveTab]       = useState<"features" | "specs" | "reviews">("features");
  const [liveRating, setLiveRating]     = useState(product.rating);
  const [liveCount,  setLiveCount]      = useState(product.reviews);
  const handleStatsChange = useCallback((r: number, c: number) => {
    setLiveRating(r);
    setLiveCount(c);
  }, []);

  const gallery = [product.image, ...(product.variantImages ?? [])].filter(
    (src, idx, arr) => src && arr.indexOf(src) === idx
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const features = product.features ?? [];

  function handleAdd() {
    if (!product.inStock || added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen">

        {/* Breadcrumb */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-3 flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-violet-600 transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product section */}
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* ── Left: Images ── */}
            <div className="space-y-3">
              {/* Main image with zoom */}
              <div className="relative">
                <ImageZoom src={activeImage} alt={product.name} />
                {/* Badges overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${BADGE_STYLES[product.badge] ?? "bg-violet-600 text-white"}`}>
                      {product.badge}
                    </span>
                  )}
                  {discount && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      -{discount}% OFF
                    </span>
                  )}
                </div>
                {/* Wishlist button */}
                <button
                  onClick={() => setWished((w) => !w)}
                  className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all z-10 ${
                    wished ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Variant image thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {gallery.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(src)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 transition-all ${
                        activeImage === src
                          ? "border-violet-600 shadow-md shadow-violet-100"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-contain p-1.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="space-y-5">

              {/* Brand + name */}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-violet-600 mb-1.5">
                  {product.brand}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <StarRow rating={liveRating} count={liveCount} />

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through mb-0.5">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="mb-0.5 text-sm font-bold text-red-500">
                      Save PKR {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-gray-300">·</span>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                  {product.category}
                </Link>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              )}

              <div className="border-t border-gray-100" />

              {/* Color picker */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        title={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 transition-all ${colorClass(color)} ${
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-violet-600 scale-110 shadow-md"
                            : "hover:scale-105 hover:shadow-sm"
                        }`}
                        style={{ borderRadius: "15px" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      disabled={qty >= 10}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {qty > 1 && (
                    <span className="text-sm text-gray-500">
                      Total: <span className="font-bold text-gray-900">PKR {(product.price * qty).toLocaleString()}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                    added
                      ? "bg-emerald-500 text-white"
                      : product.inStock
                        ? "bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {added ? (
                    <><Check className="w-4 h-4" /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                  )}
                </button>

                <button
                  onClick={() => setWished((w) => !w)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${
                    wished ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={handleCopy}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-all"
                  title={copied ? "Link copied!" : "Share product"}
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { icon: Truck,       label: "Fast Delivery" },
                  { icon: RotateCcw,   label: "7-Day Return" },
                  { icon: ShieldCheck, label: "Genuine Product" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                    <Icon className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-14 lg:mt-20">
            <div className="flex gap-1 border-b border-gray-100 mb-8">
              {([
                { key: "features", label: "Features & Details" },
                { key: "specs",    label: "Specifications" },
                { key: "reviews",  label: `Reviews (${liveCount})` },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 px-1 mr-6 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "features" && (
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Quick Info</h3>
                  <dl className="space-y-3">
                    {[
                      { label: "Brand",        value: product.brand },
                      { label: "Category",     value: product.category },
                      ...(product.colors && product.colors.length > 0 ? [{ label: "Colors", value: product.colors.join(", ") }] : []),
                      { label: "Availability", value: product.inStock ? "In Stock" : "Out of Stock" },
                    ].map((spec) => (
                      <div key={spec.label} className="flex items-start gap-4 py-2.5 border-b border-gray-100 last:border-0">
                        <dt className="text-sm font-semibold text-gray-500 w-28 shrink-0">{spec.label}</dt>
                        <dd className="text-sm text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl">
                <h3 className="text-base font-bold text-gray-900 mb-4">Full Specifications</h3>
                <dl className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {[
                    { label: "Brand",        value: product.brand },
                    { label: "Category",     value: product.category },
                    ...(product.colors && product.colors.length > 0 ? [{ label: "Colors", value: product.colors.join(", ") }] : []),
                    { label: "Availability", value: product.inStock ? "✓ In Stock" : "✗ Out of Stock" },
                    ...(product.specifications ?? []).map((s) => ({ label: s.key, value: s.value })),
                  ].map((spec, i) => (
                    <div key={i} className={`flex items-start gap-6 px-5 py-3.5 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <dt className="text-sm font-semibold text-gray-500 w-36 shrink-0">{spec.label}</dt>
                      <dd className="text-sm text-gray-900 flex-1">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsPanel
                productId={product.id}
                initialRating={product.rating}
                initialCount={product.reviews}
                onStatsChange={handleStatsChange}
              />
            )}
          </div>

          {/* ── Related products ── */}
          {related.length > 0 && (
            <div className="mt-16 lg:mt-20">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 rounded-full px-3 py-1 mb-3">
                    {product.category}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hidden sm:inline-flex text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p) => <RelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
