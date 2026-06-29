"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    tag:     "New Arrivals",
    title:   "iPhone 16 Series Cases",
    desc:    "Premium protection meets sleek design. Shop the latest cases for iPhone 16 Pro Max, Pro, Plus & standard.",
    cta:     "Shop Now",
    href:    "/products?category=Cases&q=iPhone+16",
    bg:      "from-violet-600 to-violet-900",
    accent:  "bg-violet-500",
    pill:    "bg-violet-500/30 text-violet-100",
    pattern: "violet",
  },
  {
    tag:     "Best Sellers",
    title:   "Screen Protectors You Can Trust",
    desc:    "Military-grade tempered glass for iPhone, Samsung & Pixel. Crystal clear. Bubble-free installation.",
    cta:     "Browse Collection",
    href:    "/products?category=Screen+Protection",
    bg:      "from-slate-700 to-slate-900",
    accent:  "bg-slate-600",
    pill:    "bg-slate-500/30 text-slate-100",
    pattern: "slate",
  },
  {
    tag:     "Fast Charging",
    title:   "Power Up Anywhere",
    desc:    "USB-C cables, 65W fast chargers, wireless pads & power banks. Never run out of battery again.",
    cta:     "Shop Power",
    href:    "/products?category=Power",
    bg:      "from-amber-500 to-orange-700",
    accent:  "bg-amber-400",
    pill:    "bg-amber-400/30 text-amber-100",
    pattern: "amber",
  },
  {
    tag:     "Sound & Style",
    title:   "Premium Audio Collection",
    desc:    "Earbuds, headphones & Bluetooth speakers from top brands. Immersive sound for every moment.",
    cta:     "Explore Audio",
    href:    "/products?category=Audio",
    bg:      "from-emerald-600 to-teal-800",
    accent:  "bg-emerald-500",
    pill:    "bg-emerald-500/30 text-emerald-100",
    pattern: "emerald",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  // Auto-play
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl" style={{ height: "480px" }}>

      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-10 right-1/3 w-32 h-32 rounded-full bg-white/5" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
        <div
          key={current}
          className="max-w-xl"
          style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
        >
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${slide.pill}`}>
            {slide.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            {slide.desc}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold text-sm rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            {slide.cta}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-5 right-5 z-30 text-white/50 text-xs font-semibold tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
