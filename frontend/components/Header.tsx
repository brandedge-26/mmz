"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import NavDropdown, { type DropdownPanel } from "./NavDropdown";

type NavLink = {
  label: string;
  href?: string;
  dropdown?: DropdownPanel;
  mobileChildren?: { label: string; image: string; href: string }[];
};

const navLinks: NavLink[] = [
  {
    label: "Phone Repairs",
    dropdown: {
      icon: "/header-images/icons/phone-repair.svg",
      heading: "Your phone is in good hands",
      subtext: "Free diagnostics, genuine parts, and same-day service across Karachi.",
      items: [
        { label: "iPhone", image: "/header-images/phone-repair/iphone.png", desc: "All models", href: "/repairs/iphone" },
        { label: "Samsung", image: "/header-images/phone-repair/samsung.png", desc: "Galaxy series", href: "/repairs/samsung" },
        { label: "Google Pixel", image: "/header-images/phone-repair/google.png", desc: "Pixel 6–9", href: "/repairs/google-pixel" },
        { label: "Oppo", image: "/header-images/phone-repair/oppo.jpg", desc: "All Oppo models", href: "/repairs/oppo" },
        { label: "Vivo", image: "/header-images/phone-repair/vivo.jpg", desc: "All Vivo models", href: "/repairs/vivo" },
        { label: "All repair options", desc: "", href: "#", isAll: true },
      ],
    },
    mobileChildren: [
      { label: "iPhone", image: "/header-images/phone-repair/iphone.png", href: "/repairs/iphone" },
      { label: "Samsung", image: "/header-images/phone-repair/samsung.png", href: "/repairs/samsung" },
      { label: "Google Pixel", image: "/header-images/phone-repair/google.png", href: "/repairs/google-pixel" },
      { label: "Oppo", image: "/header-images/phone-repair/oppo.jpg", href: "/repairs/oppo" },
      { label: "Vivo", image: "/header-images/phone-repair/vivo.jpg", href: "/repairs/vivo" },
    ],
  },
  {
    label: "Tech Repairs",
    dropdown: {
      icon: "/header-images/tech-repair/tech-icon-header-nav-menu.svg",
      heading: "Expert fixes for your tech",
      subtext: "Tablets, iPads and more — all repaired with genuine parts.",
      items: [
        { label: "iPad", image: "/header-images/tech-repair/ipad.png", desc: "All iPad models", href: "#" },
        { label: "Tablet", image: "/header-images/tech-repair/tablet.png", desc: "All Android tablets", href: "#" },
        { label: "All repair options", desc: "", href: "#", isAll: true },
      ],
    },
    mobileChildren: [
      { label: "iPad", image: "/header-images/tech-repair/ipad.png", href: "#" },
      { label: "Tablet", image: "/header-images/tech-repair/tablet.png", href: "#" },
    ],
  },
  {
    label: "Shop Accessories",
    dropdown: {
      icon: "/header-images/icons/shop-accessories.svg",
      heading: "Accessories for your device",
      subtext: "Cases, screen protectors, chargers & more.",
      items: [
        { label: "Cases & Covers", image: "/header-images/shop-accessories/case.png", desc: "Protect your device", href: "#" },
        { label: "Screen Protectors", image: "/header-images/shop-accessories/screen-protector.png", desc: "Tempered glass & film", href: "#" },
        { label: "Chargers & Cables", image: "/header-images/shop-accessories/power-accessories.png", desc: "Fast charge & wireless", href: "#" },
        { label: "Audio", image: "/header-images/shop-accessories/audio.png", desc: "Earphones & speakers", href: "#" },
        { label: "All accessories", desc: "", href: "#", isAll: true },
      ],
    },
    mobileChildren: [
      { label: "Cases & Covers", image: "/header-images/shop-accessories/case.png", href: "#" },
      { label: "Screen Protectors", image: "/header-images/shop-accessories/screen-protector.png", href: "#" },
      { label: "Chargers & Cables", image: "/header-images/shop-accessories/power-accessories.png", href: "#" },
      { label: "Audio", image: "/header-images/shop-accessories/audio.png", href: "#" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };
  const scheduleClose = () => { leaveTimer.current = setTimeout(() => setActiveDropdown(null), 180); };

  const activeItem = navLinks.find((n) => n.label === activeDropdown);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-gray-900 font-bold text-lg tracking-tight">
                Memom <span className="text-violet-600">Mobile Zone</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeDropdown === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative h-16 flex items-center"
                    onMouseEnter={() => { clearTimer(); if (link.dropdown) setActiveDropdown(link.label); }}
                    onMouseLeave={() => { if (link.dropdown) scheduleClose(); }}
                  >
                    <Link
                      href={link.href ?? "#"}
                      className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                        isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {link.label}
                      {link.dropdown && (
                        <svg className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 rounded-t-full" />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-full transition-colors">
                Start a Repair
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop mega dropdown */}
        {activeItem?.dropdown && (
          <div
            className="absolute left-0 right-0 top-full z-40"
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden animate-dropdown-in">
                <NavDropdown panel={activeItem.dropdown} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slideDown flex flex-col">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <span className="text-gray-900 font-bold text-base tracking-tight">
                Memom <span className="text-violet-600">Mobile Zone</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-col flex-1 px-4 py-4 gap-1">
              {navLinks.map((link) => {
                const isExpanded = mobileExpanded === link.label;
                return (
                  <div key={link.label}>
                    {link.mobileChildren ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(isExpanded ? null : link.label)}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          {link.label}
                          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="mt-1 mb-2 grid grid-cols-3 gap-2 px-1 animate-accordionDown">
                            {link.mobileChildren.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all group"
                              >
                                <div className="relative w-12 h-10">
                                  <Image src={child.image} alt={child.label} fill className="object-contain" />
                                </div>
                                <span className="text-[11px] font-medium text-gray-600 group-hover:text-violet-700 text-center leading-tight">
                                  {child.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.href ?? "#"}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        {link.label}
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-2.5 shrink-0">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="block text-center py-3 text-sm font-bold bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-200">
                Start a Repair
              </Link>
              <a
                href="https://api.whatsapp.com/send/?phone=923152413134"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
