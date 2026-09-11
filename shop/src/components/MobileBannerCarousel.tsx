"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

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

export default function MobileBannerCarousel() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API}/banners?type=mobile`)
      .then((r) => r.json())
      .then((d) => setBanners(d.banners ?? []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => setCurrent((i) => (i + 1) % (banners.length || 1)), [banners.length]);
  const prev = () => setCurrent((i) => (i - 1 + (banners.length || 1)) % (banners.length || 1));

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, banners.length]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div
        className="lg:hidden mt-3 mx-3 rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
        style={{ aspectRatio: "2 / 1" }}
      />
    );
  }

  if (banners.length === 0) return null;

  const hasText = (b: BannerData) => b.tag || b.title || b.desc || b.btnText;

  return (
    <div
      className="relative lg:hidden mt-3 mx-3 rounded-2xl overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        {banners.map((b, i) => (
          <div
            key={b._id}
            className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            style={{ backgroundColor: b.bgColor || "#0f172a" }}
          >
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.imageUrl}
              alt=""
              className={`w-full h-full ${hasText(b) ? "object-cover object-right" : "object-cover"}`}
              draggable={false}
            />

            {/* Gradient overlay — only if text exists */}
            {hasText(b) && (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${b.bgColor || "#0f172a"}ee 30%, ${b.bgColor || "#0f172a"}99 52%, transparent 72%)`,
                }}
              />
            )}

            {/* Text overlay */}
            {hasText(b) && (
              <div className="absolute inset-0 flex items-center">
                <div className="px-4 w-[58%]">
                  {b.tag && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-1.5 bg-white/15 text-white/90">
                      {b.tag}
                    </span>
                  )}
                  {b.title && (
                    <p className="text-white font-extrabold leading-tight mb-1.5 drop-shadow-md"
                      style={{ fontSize: "clamp(13px, 4vw, 18px)" }}>
                      {b.title}
                    </p>
                  )}
                  {b.desc && (
                    <p className="text-white/75 leading-snug mb-2.5 line-clamp-2"
                      style={{ fontSize: "clamp(9px, 2.5vw, 11px)" }}>
                      {b.desc}
                    </p>
                  )}
                  {b.btnText && b.href && (
                    <Link
                      href={b.href}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-3 py-1.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow"
                      style={{ fontSize: "clamp(9px, 2.5vw, 11px)" }}
                    >
                      {b.btnText}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Full-slide tap link (when no button or behind text area) */}
            {!b.btnText && b.href && (
              <Link href={b.href} className="absolute inset-0 z-0" aria-label="View banner" />
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
