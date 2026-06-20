"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  {
    label: "Phone Repairs",
    children: ["iPhone Repair", "Samsung Repair", "Google Pixel", "OnePlus"],
  },
  {
    label: "Tech Repairs",
    children: ["Laptop Repair", "Tablet Repair", "Console Repair", "MacBook Repair"],
  },
  {
    label: "Shop Accessories",
    children: ["Cases & Covers", "Screen Protectors", "Chargers", "Audio"],
  },
  { label: "Repair Guides" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight">
              Memom <span className="text-violet-600">Mobile Zone</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg font-medium">
                  {link.label}
                  {link.children && (
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/60 py-1.5">
                    {link.children.map((child) => (
                      <Link
                        key={child}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-violet-50 transition-colors"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium">
              Login
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-full transition-colors"
            >
              Start a Repair
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-0.5">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link href="#" className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4 space-y-0.5">
                  {link.children.map((child) => (
                    <Link key={child} href="#" className="block px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 rounded-lg">
                      {child}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            <Link href="#" className="text-center py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 font-medium">Login</Link>
            <Link href="#" className="text-center py-2 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700">Start a Repair</Link>
          </div>
        </div>
      )}
    </header>
  );
}
