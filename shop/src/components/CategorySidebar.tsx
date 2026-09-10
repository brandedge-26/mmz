"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "All Products",         href: "/products" },
  { label: "Panels",               href: "/products?category=Panels" },
  { label: "Mobile Batteries",     href: "/products?category=Mobile+Batteries" },
  { label: "Charging Jacks",       href: "/products?category=Charging+Jacks" },
  { label: "Keypad Mobile Parts",  href: "/products?category=Keypad+Mobile+Parts" },
  { label: "Trending Accessories", href: "/products?category=Trending+Accessories" },
  { label: "Chargers",             href: "/products?category=Chargers" },
  { label: "Power Bank",           href: "/products?category=Power+Bank" },
  { label: "Casing Converter",     href: "/products?category=Casing+Converter" },
  { label: "Smart Watches",        href: "/products?category=Smart+Watches" },
  { label: "Car Accessories",      href: "/products?category=Car+Accessories" },
  { label: "Audio",                href: "/products?category=Audio" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CategorySidebar({ open, onClose }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; setExpandedIdx(null); }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            All Categories
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <nav className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {SIDEBAR_ITEMS.map((item, idx) => (
            <div key={item.label}>
              {"children" in item ? (
                <>
                  {/* Expandable row */}
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    <span className={expandedIdx === idx ? "text-violet-600" : ""}>
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedIdx === idx ? "rotate-180 text-violet-600" : ""
                      }`}
                    />
                  </button>

                  {/* Sub-links */}
                  {expandedIdx === idx && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center px-7 py-2.5 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        Shop all {item.label} →
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          className="flex items-center px-7 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center px-5 py-4 text-sm font-semibold text-gray-800 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
