"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

interface BannerData { _id: string; imageUrl: string; href: string; }

export default function MobileBannerCarousel() {
  const [banners, setBanners]   = useState<BannerData[]>([]);
  const [current, setCurrent]   = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API}/banners?type=mobile`)
      .then((r) => r.json())
      .then((d) => setBanners(d.banners ?? []))
      .catch(() => setBanners([]));
  }, []);

  const next = useCallback(() => setCurrent((i) => (i + 1) % (banners.length || 1)), [banners.length]);
  const prev = () => setCurrent((i) => (i - 1 + (banners.length || 1)) % (banners.length || 1));

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, banners.length]);

  // Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  if (banners.length === 0) return null;

  return (
    <div
      className="relative lg:hidden mt-3 mx-3 rounded-2xl overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        {banners.map((b, i) => (
          <Link
            key={b._id}
            href={b.href}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
