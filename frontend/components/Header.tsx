"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  {
    label: "Phone Repairs",
    children: [
      { label: "iPhone Repair", image: "/header-images/phone-repair/iphone.png", desc: "All models supported", href: "/repairs/iphone" },
      { label: "Samsung Repair", image: "/header-images/phone-repair/samsung.png", desc: "Galaxy series & more", href: "/repairs/samsung" },
      { label: "Google Pixel", image: "/header-images/phone-repair/google.png", desc: "Pixel 6, 7, 8 & newer", href: "/repairs/google-pixel" },
      { label: "Motorola Repair", image: "/header-images/phone-repair/motorola.png", desc: "Moto G, Edge & more", href: "/repairs/motorola" },
      { label: "LG Repair", image: "/header-images/phone-repair/LG.png", desc: "All LG models", href: "/repairs/lg" },
    ],
  },
  {
    label: "Shop Accessories",
    children: [
      { label: "Cases & Covers", image: "/header-images/shop-accessories/case.png", desc: "Protect your device", href: "#" },
      { label: "Screen Protectors", image: "/header-images/shop-accessories/screen-protector.png", desc: "Tempered glass & film", href: "#" },
      { label: "Chargers & Cables", image: "/header-images/shop-accessories/power-accessories.png", desc: "Fast charge & wireless", href: "#" },
      { label: "Audio", image: "/header-images/shop-accessories/audio.png", desc: "Earphones & speakers", href: "#" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
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
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {!link.children ? (
                  <Link href={link.href ?? "#"} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg font-medium">
                    {link.label}
                  </Link>
                ) : (
                  <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg font-medium">
                    {link.label}
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 py-2 overflow-hidden animate-slideDown">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-violet-50 transition-colors group mx-1.5 rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 group-hover:border-violet-200 transition-colors">
                          <Image src={child.image} alt={child.label} width={32} height={32} className="object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-violet-700 leading-tight">{child.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{child.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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

          {/* Mobile: hamburger */}
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 overflow-y-auto max-h-[80vh] animate-slideDown">

          {/* Nav sections */}
          <div className="px-4 pt-3 pb-2 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {!link.children ? (
                  <Link
                    href={link.href ?? "#"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {link.label}
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <>
                    {/* Accordion trigger */}
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Accordion content — image grid */}
                    {mobileExpanded === link.label && (
                      <div className="mt-1 mb-2 grid grid-cols-2 gap-2 px-1 animate-accordionDown">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 rounded-2xl transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden group-hover:border-violet-200 transition-colors">
                              <Image src={child.image} alt={child.label} width={36} height={36} className="object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-semibold text-gray-800 group-hover:text-violet-700 leading-tight">{child.label}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{child.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-4" />

          {/* Auth buttons */}
          <div className="px-4 py-4 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 text-sm font-bold bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-200"
            >
              Start a Repair
            </Link>
          </div>

          {/* Contact quick-access */}
          <div className="px-4 pb-5">
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
      )}
    </header>
  );
}
