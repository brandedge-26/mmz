"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    tag:      "Premium Quality",
    title:    "Mobile Panels",
    desc:     "High-clarity LCD & OLED panels for iPhone, Samsung & more. Restore your screen to factory perfection.",
    cta:      "Shop Panels",
    href:     "/products?category=Panels",
    image:    "/banners/panels.png",
    imgBg:    "#1e2535",
    pill:     "bg-blue-500/30 text-blue-200",
  },
  {
    tag:      "Sound & Style",
    title:    "Premium Audio\nCollection",
    desc:     "Earbuds, headphones & Bluetooth speakers from top brands. Immersive sound for every moment.",
    cta:      "Explore Audio",
    href:     "/products?category=Audio",
    image:    "/banners/audio.png",
    imgBg:    "#1a0533",
    pill:     "bg-purple-500/30 text-purple-200",
  },
  {
    tag:      "Stay Charged",
    title:    "Power Banks",
    desc:     "Never run out of battery. Compact, high-capacity power banks with fast charging for every device.",
    cta:      "Shop Power Banks",
    href:     "/products?category=Power+Bank",
    image:    "/banners/powerbank.png",
    imgBg:    "#052e16",
    pill:     "bg-emerald-500/30 text-emerald-200",
  },
  {
    tag:      "Latest Compatible",
    title:    "iPhone 17 & 18\nCase Converting",
    desc:     "Seamlessly upgrade your iPhone casing with our premium conversion kits. Perfect fit, flawless finish.",
    cta:      "Shop Now",
    href:     "/products?category=Casing+Converter",
    image:    "/banners/iphone1718caseconverting.png",
    imgBg:    "#0f0f0f",
    pill:     "bg-gray-400/30 text-gray-200",
  },
];

export default function HeroBanner() {
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl" style={{ height: "480px" }}>

      {/* Full-width background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundColor: s.imgBg }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-contain object-right"
            draggable={false}
          />
          {/* Left-side gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${s.imgBg} 35%, ${s.imgBg}cc 50%, transparent 70%)` }}
          />
        </div>
      ))}

      {/* Text — left side */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full sm:w-1/2 px-8 sm:px-12 lg:px-16">
          <div
            key={current}
            style={{ animation: "fadeSlideIn 0.5s ease-out both" }}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 ${slide.pill}`}>
              {slide.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-tight mb-4 whitespace-pre-line drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
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
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 right-8 z-30 flex items-center gap-2">
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

      {/* Counter */}
      <div className="absolute top-5 right-5 z-30 text-white/40 text-xs font-semibold tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
