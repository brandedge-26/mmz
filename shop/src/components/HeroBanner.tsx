"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface BannerData {
  _id: string;
  imageUrl: string;
  href: string;
  tag: string;
  title: string;
  desc: string;
  btnText: string;
  bgColor: string;
}

export default function HeroBanner() {
  const [slides, setSlides]     = useState<BannerData[]>([]);
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/banners?type=desktop`)
      .then((r) => r.json())
      .then((d) => setSlides(d.banners ?? []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((idx: number) => {
    if (animating || slides.length === 0) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, slides.length]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (loading) {
    return <div className="rounded-2xl sm:rounded-3xl bg-gray-100 animate-pulse" style={{ height: "480px" }} />;
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl" style={{ height: "480px" }}>

      {/* Slides */}
      {slides.map((s, i) => (
        <div key={s._id}
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{ backgroundColor: s.bgColor }}
        >
          <img src={s.imageUrl} alt="" className="w-full h-full object-contain object-right" draggable={false} />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${s.bgColor} 35%, ${s.bgColor}cc 50%, transparent 70%)` }} />
        </div>
      ))}

      {/* Text — left side */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full sm:w-1/2 px-8 sm:px-12 lg:px-16">
          <div key={current} style={{ animation: "fadeSlideIn 0.5s ease-out both" }}>
            {slide.tag && (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 bg-white/15 text-white/90">
                {slide.tag}
              </span>
            )}
            {slide.title && (
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-tight mb-4 whitespace-pre-line drop-shadow-lg">
                {slide.title}
              </h1>
            )}
            {slide.desc && (
              <p className="text-white/80 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
                {slide.desc}
              </p>
            )}
            {slide.btnText && slide.href && (
              <Link href={slide.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold text-sm rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                {slide.btnText}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 right-8 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {slides.length > 1 && (
        <div className="absolute top-5 right-5 z-30 text-white/40 text-xs font-semibold tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
