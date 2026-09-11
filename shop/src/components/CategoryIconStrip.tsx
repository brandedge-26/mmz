"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { label: "Panels",               image: "/category/mobile_panel-removebg-preview.png",         href: "/products?category=Panels" },
  { label: "Mobile Batteries",     image: "/category/mobile_battery-removebg-preview.png",       href: "/products?category=Mobile+Batteries" },
  { label: "Charging Jacks",       image: "/category/charging_jacks-removebg-preview.png",       href: "/products?category=Charging+Jacks" },
  { label: "Keypad Mobile Parts",  image: "/category/keypad_mobile_parts-removebg-preview.png",  href: "/products?category=Keypad+Mobile+Parts" },
  { label: "Trending Accessories", image: "/category/trending_accessories-removebg-preview.png", href: "/products?category=Trending+Accessories" },
  { label: "Chargers",             image: "/category/mobile_chargers-removebg-preview.png",      href: "/products?category=Chargers" },
  { label: "Power Bank",           image: "/category/powerbank-removebg-preview.png",            href: "/products?category=Power+Bank" },
  { label: "Casing Converter",     image: "/category/casing_converts-removebg-preview.png",     href: "/products?category=Casing+Converter" },
  { label: "Smart Watches",        image: "/category/smart_watch-removebg-preview.png",          href: "/products?category=Smart+Watches" },
  { label: "Car Accessories",      image: "/category/car_accessories-removebg-preview.png",      href: "/products?category=Car+Accessories" },
];

export default function CategoryIconStrip() {
  const lastY      = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) setVisible(false);
      else setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categoryItem = (cat: typeof CATEGORIES[0], key: string | number) => (
    <Link
      key={key}
      href={cat.href}
      className="flex flex-col items-center gap-1.5 px-3 py-3 group shrink-0 min-w-[72px] hover:text-violet-600 transition-colors"
    >
      <div className="w-12 h-12 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.image}
          alt={cat.label}
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-[10px] font-medium text-gray-600 group-hover:text-violet-600 text-center leading-tight max-w-[70px]">
        {cat.label}
      </span>
    </Link>
  );

  return (
    <div
      className={`sticky top-[108px] z-40 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-[200%]"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto">

        {/* ── Mobile: infinite marquee ── */}
        <div className="lg:hidden overflow-hidden">
          <div className="flex w-max" style={{ animation: "categoryMarquee 16s linear infinite" }}>
            {/* duplicate for seamless loop */}
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => categoryItem(cat, i))}
          </div>
        </div>

        {/* ── Desktop: evenly distributed ── */}
        <div className="hidden lg:flex px-4 justify-between">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 px-2 py-3 group shrink lg:flex-1 hover:text-violet-600 transition-colors"
            >
              <div className="w-14 h-14 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[11px] font-medium text-gray-600 group-hover:text-violet-600 text-center leading-tight max-w-[70px]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes categoryMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
