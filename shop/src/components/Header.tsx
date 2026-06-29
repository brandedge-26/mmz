"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Package } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import CartSidebar from "./CartSidebar";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const deviceCategories = [
  {
    name: "iPhone",
    image: "/nav/iphone.png",
    href: "/products?brand=iPhone",
    links: [
      { label: "iPhone 16 Series",  href: "/products?brand=iPhone&q=iPhone+16" },
      { label: "iPhone 15 Series",  href: "/products?brand=iPhone&q=iPhone+15" },
      { label: "iPhone 14 Series",  href: "/products?brand=iPhone&q=iPhone+14" },
      { label: "iPhone 13 Series",  href: "/products?brand=iPhone&q=iPhone+13" },
      { label: "Shop all iPhone →", href: "/products?brand=iPhone" },
    ],
  },
  {
    name: "Samsung",
    image: "/nav/samsung.png",
    href: "/products?brand=Samsung",
    links: [
      { label: "Galaxy S25 Series",   href: "/products?brand=Samsung&q=S25" },
      { label: "Galaxy S24 Series",   href: "/products?brand=Samsung&q=S24" },
      { label: "Galaxy A Series",     href: "/products?brand=Samsung&q=Galaxy+A" },
      { label: "Galaxy Z Fold/Flip",  href: "/products?brand=Samsung&q=Galaxy+Z" },
      { label: "Shop all Samsung →",  href: "/products?brand=Samsung" },
    ],
  },
  {
    name: "Google Pixel",
    image: "/nav/pixel.png",
    href: "/products?brand=Pixel",
    links: [
      { label: "Pixel 9 Series",  href: "/products?brand=Pixel&q=Pixel+9" },
      { label: "Pixel 8 Series",  href: "/products?brand=Pixel&q=Pixel+8" },
      { label: "Pixel 7 Series",  href: "/products?brand=Pixel&q=Pixel+7" },
      { label: "Shop all Pixel →", href: "/products?brand=Pixel" },
    ],
  },
  {
    name: "Tablets",
    image: "/nav/tablets.png",
    href: "/products?category=Tablets",
    links: [
      { label: "iPad",             href: "/products?category=Tablets&q=iPad" },
      { label: "Samsung Tablets",  href: "/products?category=Tablets&q=Galaxy+Tab" },
      { label: "All Tablets →",    href: "/products?category=Tablets" },
    ],
  },
];

const navItems = [
  {
    label: "Cases",
    href: "/products?category=Cases",
    columns: [
      {
        heading: "Apple",
        links: [
          { label: "iPhone 16 Pro Max", href: "/products?category=Cases&q=iPhone+16+Pro+Max" },
          { label: "iPhone 16 Pro",     href: "/products?category=Cases&q=iPhone+16+Pro" },
          { label: "iPhone 16 Plus",    href: "/products?category=Cases&q=iPhone+16+Plus" },
          { label: "iPhone 16",         href: "/products?category=Cases&q=iPhone+16" },
          { label: "iPhone 15 Pro Max", href: "/products?category=Cases&q=iPhone+15+Pro+Max" },
          { label: "iPhone 15 Pro",     href: "/products?category=Cases&q=iPhone+15+Pro" },
          { label: "iPhone 15",         href: "/products?category=Cases&q=iPhone+15" },
          { label: "Shop all Apple →",  href: "/products?category=Cases&brand=iPhone" },
        ],
      },
      {
        heading: "Samsung",
        links: [
          { label: "Galaxy S25 Ultra",   href: "/products?category=Cases&q=S25+Ultra" },
          { label: "Galaxy S25 Plus",    href: "/products?category=Cases&q=S25+Plus" },
          { label: "Galaxy S25",         href: "/products?category=Cases&q=Galaxy+S25" },
          { label: "Galaxy S24 Ultra",   href: "/products?category=Cases&q=S24+Ultra" },
          { label: "Galaxy Z Fold 6",    href: "/products?category=Cases&q=Z+Fold" },
          { label: "Galaxy Z Flip 6",    href: "/products?category=Cases&q=Z+Flip" },
          { label: "Shop all Samsung →", href: "/products?category=Cases&brand=Samsung" },
        ],
      },
      {
        heading: "Google & Others",
        links: [
          { label: "Pixel 9 Pro",         href: "/products?category=Cases&q=Pixel+9+Pro" },
          { label: "Pixel 9",             href: "/products?category=Cases&q=Pixel+9" },
          { label: "Pixel 8 Pro",         href: "/products?category=Cases&q=Pixel+8+Pro" },
          { label: "Shop all Pixel →",    href: "/products?category=Cases&brand=Pixel" },
        ],
      },
    ],
  },
  {
    label: "Screen Protection",
    href: "/products?category=Screen+Protection",
    columns: [
      {
        heading: "Shop by device",
        shopAll: "/products?category=Screen+Protection",
        links: [
          { label: "iPhone",    href: "/products?category=Screen+Protection&brand=iPhone" },
          { label: "Samsung",   href: "/products?category=Screen+Protection&brand=Samsung" },
          { label: "Google Pixel", href: "/products?category=Screen+Protection&brand=Pixel" },
          { label: "Tablets",   href: "/products?category=Screen+Protection&q=Tablet" },
          { label: "Wearables", href: "/products?category=Screen+Protection&q=Watch" },
        ],
      },
    ],
  },
  {
    label: "Power & Charging",
    href: "/products?category=Power",
    columns: [
      {
        heading: "Shop by type",
        shopAll: "/products?category=Power",
        links: [
          { label: "Cables & Adapters",   href: "/products?category=Power&q=Cable" },
          { label: "Power Banks",         href: "/products?category=Power&q=Power+Bank" },
          { label: "Wireless Charging",   href: "/products?category=Power&q=Wireless" },
          { label: "Car Chargers",        href: "/products?category=Power&q=Car" },
          { label: "Charging Stands",     href: "/products?category=Power&q=Stand" },
        ],
      },
    ],
  },
  {
    label: "Audio",
    href: "/products?category=Audio",
    columns: [
      {
        heading: "Shop by type",
        shopAll: "/products?category=Audio",
        links: [
          { label: "Earbuds & AirPods",  href: "/products?category=Audio&q=Earbuds" },
          { label: "Headphones",         href: "/products?category=Audio&q=Headphones" },
          { label: "Bluetooth Speakers", href: "/products?category=Audio&q=Speaker" },
          { label: "Gaming Audio",       href: "/products?category=Audio&q=Gaming" },
        ],
      },
    ],
  },
  {
    label: "Accessories",
    href: "/products?category=Accessories",
    columns: [
      {
        heading: "Shop by category",
        shopAll: "/products?category=Accessories",
        links: [
          { label: "Phone Grips & Rings",   href: "/products?category=Accessories&q=Grip" },
          { label: "Mounts & Holders",      href: "/products?category=Accessories&q=Mount" },
          { label: "MagSafe Accessories",   href: "/products?category=Accessories&q=MagSafe" },
          { label: "Pop Sockets",           href: "/products?category=Accessories&q=PopSocket" },
          { label: "Storage & Memory",      href: "/products?category=Accessories&q=Storage" },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const router = useRouter();

  const user            = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);
  const logout          = useAuthStore((s) => s.logout);

  const [openIndex, setOpenIndex]               = useState<number | null>(null);
  const [browseOpen, setBrowseOpen]             = useState(false);
  const [cartOpen, setCartOpen]                 = useState(false);
  const [userMenuOpen, setUserMenuOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [mobileVisible, setMobileVisible]       = useState(false);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState<number | null>(null);

  const headerRef   = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const browseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click / scroll
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenIndex(null);
    };
    const onScroll = () => { setOpenIndex(null); setBrowseOpen(false); };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { document.removeEventListener("mousedown", onClick); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpenIndex(null), 80); };
  const cancelClose   = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  const openBrowse    = () => { if (browseTimer.current) clearTimeout(browseTimer.current); setBrowseOpen(true); setOpenIndex(null); };
  const closeBrowse   = () => { browseTimer.current = setTimeout(() => setBrowseOpen(false), 80); };

  const openMobile  = () => { setMobileOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setMobileVisible(true))); };
  const closeMobile = () => { setMobileVisible(false); setTimeout(() => { setMobileOpen(false); setMobileExpandedIdx(null); }, 300); };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    closeMobile();
    await logout();
    router.push("/");
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">

        {/* ── Desktop bar ── */}
        <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 h-16 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-gray-900 font-bold text-base tracking-tight">MMZ </span>
              <span className="text-violet-600 font-bold text-base">Shop</span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-stretch h-full">

            {/* Browse All — mega panel */}
            <div
              className="relative flex items-stretch"
              onMouseEnter={openBrowse}
              onMouseLeave={closeBrowse}
            >
              <button
                className={`relative flex items-center gap-1 px-3 text-sm font-medium transition-colors ${
                  browseOpen ? "text-violet-600" : "text-gray-700 hover:text-violet-600"
                }`}
              >
                Browse
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${browseOpen ? "rotate-180" : ""}`} />
                {browseOpen && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-full" />}
              </button>

              {browseOpen && (
                <div
                  className="fixed left-4 right-4 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden"
                  style={{ top: "calc(4rem + 8px)" }}
                >
                  {/* Device cards */}
                  <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Shop by Device</p>
                    <div className="grid grid-cols-4 gap-3">
                      {deviceCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setBrowseOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all group"
                        >
                          <div className="w-12 h-10 relative shrink-0">
                            <Image src={cat.image} alt={cat.name} fill className="object-contain" sizes="48px" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-violet-700 transition-colors">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Category columns */}
                  <div className="px-6 py-5 grid grid-cols-5 gap-6">
                    {navItems.map((item) => (
                      <div key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => setBrowseOpen(false)}
                          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-violet-600 transition-colors mb-3 block"
                        >
                          {item.label}
                        </Link>
                        <ul className="space-y-1.5">
                          {item.columns[0].links.slice(0, 5).map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                onClick={() => setBrowseOpen(false)}
                                className="text-sm text-gray-500 hover:text-violet-600 transition-colors block"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item, idx) => (
              <div
                key={item.label}
                className="relative flex items-stretch"
                onMouseEnter={() => { cancelClose(); setOpenIndex(idx); }}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => { router.push(item.href); setOpenIndex(null); }}
                  className={`relative flex items-center gap-1 px-3 text-sm font-medium transition-colors ${
                    openIndex === idx ? "text-violet-600" : "text-gray-700 hover:text-violet-600"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`} />
                  {openIndex === idx && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-full" />
                  )}
                </button>

                {/* Dropdown */}
                {openIndex === idx && (
                  "deviceMenu" in item ? (
                    /* Devices — image card mega menu */
                    <div
                      className="fixed left-4 right-4 mt-2 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden"
                      style={{ top: "calc(4rem + 8px)" }}
                    >
                      <div className="grid grid-cols-4 divide-x divide-gray-100">
                        {deviceCategories.map((cat) => (
                          <div key={cat.name} className="flex flex-col p-6 gap-4 hover:bg-violet-50/40 transition-colors">
                            <Link href={cat.href} onClick={() => setOpenIndex(null)} className="flex flex-col items-center gap-3 group">
                              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-violet-100 transition-colors">
                                <Image src={cat.image} alt={cat.name} width={64} height={64} className="object-contain" />
                              </div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors">{cat.name}</p>
                            </Link>
                            <ul className="space-y-2">
                              {cat.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenIndex(null)}
                                    className={`text-sm block transition-colors ${
                                      link.label.startsWith("Shop all") || link.label.startsWith("All")
                                        ? "font-semibold text-violet-600 hover:text-violet-700 mt-1"
                                        : "text-gray-500 hover:text-violet-600"
                                    }`}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : item.columns.length > 1 ? (
                    /* Multi-column (Cases) */
                    <div
                      className="fixed left-4 right-4 mt-2 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden"
                      style={{ top: "calc(4rem + 8px)" }}
                    >
                      <div className="flex gap-10 px-8 py-6">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="min-w-[160px]">
                            <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">{col.heading}</p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenIndex(null)}
                                    className={`text-sm block transition-colors ${
                                      link.label.startsWith("Shop all")
                                        ? "font-semibold text-violet-600 hover:text-violet-700"
                                        : "text-gray-600 hover:text-violet-600"
                                    }`}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Single-column dropdown */
                    <div
                      className="absolute top-full mt-2 left-0 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50"
                      style={{ width: "260px" }}
                    >
                      <div className="px-6 py-5">
                        {item.columns.map((col) => (
                          <div key={col.heading}>
                            <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">{col.heading}</p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenIndex(null)}
                                    className="text-sm text-gray-600 hover:text-violet-600 transition-colors block py-0.5"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {"shopAll" in col && col.shopAll && (
                              <Link
                                href={col.shopAll}
                                onClick={() => setOpenIndex(null)}
                                className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors"
                              >
                                Shop all
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}

          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* User */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              >
                {!isInitialized ? (
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                ) : isAuthenticated && user ? (
                  <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
                    {getInitials(user.name)}
                  </span>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center shrink-0">
                            {getInitials(user.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link href="/account" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                          <User className="w-4 h-4 text-gray-400" /> My Account
                        </Link>
                        <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                          <Package className="w-4 h-4 text-gray-400" /> My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link href="/login" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-center w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
                        Sign in
                      </Link>
                      <Link href="/signup" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-center w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                0
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile bar ── */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-sm tracking-tight">
              MMZ <span className="text-violet-600">Shop</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-violet-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                0
              </span>
            </button>
            <button onClick={() => mobileOpen ? closeMobile() : openMobile()}
              className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${mobileVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeMobile}
          />
          {/* Panel — slides in from right */}
          <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileVisible ? "translate-x-0" : "translate-x-full"}`}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 shrink-0">
              <span className="font-bold text-gray-900 text-sm">MMZ <span className="text-violet-600">Shop</span></span>
              <button onClick={closeMobile} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* Auth card */}
              {isInitialized && (
                isAuthenticated && user ? (
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-3 bg-violet-50 rounded-xl">
                      <span className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center shrink-0">
                        {getInitials(user.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Link href="/account" onClick={closeMobile}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-100 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition-colors">
                        My Account
                      </Link>
                      <Link href="/orders" onClick={closeMobile}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                        My Orders
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100 grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={closeMobile}
                      className="flex items-center justify-center py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
                      Sign in
                    </Link>
                    <Link href="/signup" onClick={closeMobile}
                      className="flex items-center justify-center py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                      Sign up
                    </Link>
                  </div>
                )
              )}

              {/* Nav */}
              <nav className="px-4 py-2 divide-y divide-gray-100">
                {navItems.map((item, idx) => (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpandedIdx(mobileExpandedIdx === idx ? null : idx)}
                      className="w-full flex items-center justify-between py-3"
                    >
                      <span className={`text-sm font-semibold transition-colors ${mobileExpandedIdx === idx ? "text-violet-600" : "text-gray-800"}`}>
                        {item.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${mobileExpandedIdx === idx ? "rotate-180 text-violet-600" : ""}`} />
                    </button>

                    {mobileExpandedIdx === idx && (
                      <div className="pb-4 space-y-4">
                        {"deviceMenu" in item ? (
                          <div className="grid grid-cols-2 gap-2 pb-1">
                            {deviceCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                onClick={closeMobile}
                                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all group"
                              >
                                <div className="relative w-14 h-12">
                                  <Image src={cat.image} alt={cat.name} fill className="object-contain" sizes="56px" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-violet-700 text-center leading-tight">
                                  {cat.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          item.columns.map((col) => (
                            <div key={col.heading}>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{col.heading}</p>
                              <ul className="space-y-1.5 pl-2">
                                {col.links.map((link) => (
                                  <li key={link.label}>
                                    <Link href={link.href} onClick={closeMobile}
                                      className={`text-sm transition-colors ${
                                        link.label.startsWith("Shop all")
                                          ? "font-semibold text-violet-600"
                                          : "text-gray-600 hover:text-violet-600"
                                      }`}>
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              {"shopAll" in col && col.shopAll && (
                                <Link href={col.shopAll} onClick={closeMobile}
                                  className="mt-3 inline-flex items-center gap-1 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors">
                                  Shop all
                                </Link>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isAuthenticated && user && (
                  <div className="py-3">
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
