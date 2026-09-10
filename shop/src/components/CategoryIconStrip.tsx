"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef  = useRef<HTMLDivElement>(null);
  const lastY      = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true);  // scrolling up
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });

  return (
    <div
      className={`sticky top-[108px] z-40 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-[200%]"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-2 xl:px-4 flex items-center">

        {/* Arrows — only visible when scrollable (mobile/tablet) */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="shrink-0 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors lg:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Mobile: horizontal scroll | Desktop: evenly distributed */}
        <div
          ref={scrollRef}
          className="
            flex flex-1 scroll-smooth
            overflow-x-auto lg:overflow-x-visible
            lg:justify-between
          "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 px-2 py-3 group
                shrink-0 min-w-[72px]
                lg:shrink lg:min-w-0 lg:flex-1
                hover:text-violet-600 transition-colors"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] lg:text-[11px] font-medium text-gray-600 group-hover:text-violet-600 text-center leading-tight max-w-[70px]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="shrink-0 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors lg:hidden"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
