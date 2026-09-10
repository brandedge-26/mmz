"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, LogOut, User, Package, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import CartSidebar from "./CartSidebar";
import TrackOrderModal from "./TrackOrderModal";
import CategorySidebar from "./CategorySidebar";
import SearchDropdown from "./SearchDropdown";
import MobileSearchOverlay from "./MobileSearchOverlay";

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
    label: "Power & More",
    href: "/products?category=Chargers",
    columns: [
      {
        heading: "Shop by type",
        shopAll: "/products?category=Chargers",
        links: [
          { label: "Chargers",          href: "/products?category=Chargers" },
          { label: "Power Bank",        href: "/products?category=Power+Bank" },
          { label: "Casing Converter",  href: "/products?category=Casing+Converter" },
          { label: "Smart Watches",     href: "/products?category=Smart+Watches" },
        ],
      },
    ],
  },
  {
    label: "Audio",
    href: "/audio",
    columns: [
      {
        heading: "Shop by type",
        shopAll: "/audio",
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
    label: "Back Glass",
    href: "/products?category=Back+Glass",
    columns: [
      {
        heading: "Shop by device",
        shopAll: "/products?category=Back+Glass",
        links: [
          { label: "iPhone",       href: "/products?category=Back+Glass&brand=iPhone" },
          { label: "Samsung",      href: "/products?category=Back+Glass&brand=Samsung" },
          { label: "Google Pixel", href: "/products?category=Back+Glass&brand=Pixel" },
          { label: "OnePlus",      href: "/products?category=Back+Glass&brand=OnePlus" },
          { label: "Oppo",         href: "/products?category=Back+Glass&brand=Oppo" },
          { label: "Vivo",         href: "/products?category=Back+Glass&brand=Vivo" },
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
  const cartCount       = useCartStore((s) => s.totalItems)();

  const [cartOpen, setCartOpen]                 = useState(false);
  const [userMenuOpen, setUserMenuOpen]         = useState(false);
  const [trackOrderOpen, setTrackOrderOpen]     = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [mobileVisible, setMobileVisible]       = useState(false);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen]             = useState(false);
  const [desktopSearch, setDesktopSearch]         = useState("");
  const [mobileSearchOpen, setMobileSearchOpen]   = useState(false);
  const [branchModalOpen, setBranchModalOpen]     = useState(false);
  const [branchIdx, setBranchIdx]               = useState(0);

  const headerRef   = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDesktopSearch("");
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Branch ticker
  useEffect(() => {
    const t = setInterval(() => setBranchIdx((i) => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  const openMobile  = () => { setMobileOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setMobileVisible(true))); };
  const closeMobile = () => { setMobileVisible(false); setTimeout(() => { setMobileOpen(false); setMobileExpandedIdx(null); }, 300); };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    closeMobile();
    await logout();
    router.push("/");
  };

  const handleDesktopSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = desktopSearch.trim();
    if (q) { router.push(`/products?q=${encodeURIComponent(q)}`); setDesktopSearch(""); }
  };

  // User/cart JSX shared between desktop and mobile
  const UserMenu = (
    <div ref={userMenuRef} className="relative">
      {!isInitialized ? (
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
      ) : isAuthenticated && user ? (
        <button
          onClick={() => setUserMenuOpen((o) => !o)}
          className="w-9 h-9 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-700 text-sm font-bold flex items-center justify-center transition-colors border-2 border-transparent hover:border-violet-300"
        >
          {getInitials(user.name)}
        </button>
      ) : (
        <button
          onClick={() => setUserMenuOpen((o) => !o)}
          className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
      )}

      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 overflow-hidden z-50 animate-dropdown-in">
          {isAuthenticated && user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="p-1.5">
                <Link href="/account" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                  My Account
                </Link>
                <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                  My Orders
                </Link>
                <Link href="/wishlist" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                  Wishlist
                </Link>
                <button onClick={() => { setUserMenuOpen(false); setTrackOrderOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium text-left">
                  Track Order
                </button>
                {user.role === "admin" && (
                  <Link href="https://admin.memonmobilezone122.pk" target="_blank" rel="noopener noreferrer" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                  Sign out
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
              <button onClick={() => { setUserMenuOpen(false); setTrackOrderOpen(true); }}
                className="flex items-center justify-center w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Track Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const CartBtn = (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      {/* ── Branches modal ── */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBranchModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-violet-600" />
                <h2 className="font-bold text-gray-900 text-base">Our Branches</h2>
              </div>
              <button onClick={() => setBranchModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Branches */}
            <div className="p-6 space-y-4">
              {/* Branch 1 */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-0.5">Branch 1 — Saddar</p>
                    <p className="text-sm font-semibold text-gray-900">Shop No LB-41, City Star Mall</p>
                    <p className="text-sm text-gray-500">Saddar, Karachi</p>
                    <a
                      href="https://maps.google.com/?q=City+Star+Mall+Saddar+Karachi"
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
              {/* Branch 2 */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-0.5">Branch 2 — North Karachi</p>
                    <p className="text-sm font-semibold text-gray-900">Shop No 122, 1st Floor, Geo Mobile Market</p>
                    <p className="text-sm text-gray-500">North Karachi</p>
                    <a
                      href="https://maps.google.com/?q=Geo+Mobile+Market+North+Karachi"
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Info bar ── */}
      <div className="bg-gray-900 text-gray-300 text-xs">

        {/* keyframes for flip animation */}
        <style>{`@keyframes branchFlip{from{transform:translateY(70%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* Mobile: animated branch ticker only */}
        <div className="lg:hidden flex items-center justify-center h-8">
          <button
            onClick={() => setBranchModalOpen(true)}
            className="flex items-center gap-1.5 underline underline-offset-2 decoration-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span
              key={branchIdx}
              style={{ display: "inline-block", animation: "branchFlip 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              {branchIdx === 0 ? "Branch 1 — City Star Mall, Saddar" : branchIdx === 1 ? "Branch 2 — Geo Mobile Market, North Karachi" : "+92 315 241 3134"}
            </span>
          </button>
        </div>

        {/* Desktop: full bar */}
        <div className="hidden lg:flex items-center justify-between max-w-screen-2xl mx-auto px-6 xl:px-10 h-9">
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/memonmobilezone122" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/memonmobilezone122" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.youtube.com/@memonmobilezone122" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
          {/* Contact info */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setBranchModalOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span className="underline underline-offset-2 decoration-gray-500">2 Branches in Karachi</span>
            </button>
            <a href="tel:+923152413134" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +92 315 241 3134
            </a>
            <a href="mailto:memonmobilezone122@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              memonmobilezone122@gmail.com
            </a>
          </div>
        </div>
      </div>

      <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">

        {/* ── Desktop top bar ── */}
        <div className="hidden lg:flex items-center gap-4 px-6 xl:px-10 h-16 max-w-screen-2xl mx-auto">

          {/* Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              aria-label="Open categories"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/logo_icon.png" alt="MMZ Logo" width={36} height={36} className="rounded-lg" />
              <div className="leading-tight">
                <div>
                  <span className="text-gray-900 font-bold text-base tracking-tight">Memon Mobile </span>
                  <span className="text-violet-600 font-bold text-base">Zone 122</span>
                </div>
                <p className="-mt-1 text-[10px] text-gray-400 font-medium">Established 2007</p>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <div ref={searchRef} className="flex-1 relative">
            <form onSubmit={handleDesktopSearch}>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-violet-300 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                <input
                  type="text"
                  value={desktopSearch}
                  onChange={(e) => setDesktopSearch(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400 self-stretch"
                />
                <button type="submit" className="px-4 self-stretch bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <SearchDropdown query={desktopSearch} onClose={() => setDesktopSearch("")} />
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-1 shrink-0">
            {UserMenu}
            {CartBtn}
          </div>
        </div>

        {/* ── Desktop nav row ── */}
        <div className="hidden lg:block border-t border-gray-100">
          <nav className="flex items-stretch h-11 max-w-screen-2xl mx-auto px-6 xl:px-10">

            {[
              { label: "All Products", href: "/products" },
              { label: "Trending",     href: "/trending" },
              { label: "Top Sellers",  href: "/top-sellers" },
              { label: "New Arrivals", href: "/new-arrivals" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center px-3 text-sm font-medium text-gray-700 hover:text-violet-600 whitespace-nowrap transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Separator */}
            <div className="flex-1" />

            {/* Extra links */}
            <Link href="/orders"
              className="flex items-center px-3 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
              Track Order
            </Link>
            <Link href="https://memonmobilezone122.pk/contact"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center px-3 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
              Contact
            </Link>
            <Link href="https://memonmobilezone122.pk/about"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center px-3 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
              About Us
            </Link>

          </nav>
        </div>

        {/* ── Mobile top bar ── */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14">
          {/* Hamburger + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              aria-label="Open categories"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo_icon.png" alt="MMZ Logo" width={28} height={28} className="rounded-lg" />
              <div className="leading-tight">
                <span className="text-gray-900 font-bold text-sm tracking-tight">Memon Mobile </span>
                <span className="text-violet-600 font-bold text-sm">Zone 122</span>
              </div>
            </Link>
          </div>

          {/* User + Cart + Menu */}
          <div className="flex items-center gap-0.5">
            {UserMenu}
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-violet-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (tap to open overlay) ── */}
        <div className="lg:hidden px-4 pb-3">
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="w-full flex items-stretch bg-gray-50 border border-gray-200 rounded-xl overflow-hidden text-left"
          >
            <span className="flex-1 px-4 py-2.5 text-sm text-gray-400">Search for products...</span>
            <span className="px-4 bg-violet-600 text-white flex items-center justify-center">
              <Search className="w-4 h-4" />
            </span>
          </button>
        </div>

      </header>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Track Order Modal */}
      {trackOrderOpen && <TrackOrderModal onClose={() => setTrackOrderOpen(false)} />}

      {/* Category Sidebar */}
      <CategorySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />

      {/* ── Mobile nav drawer (from right) ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${mobileVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeMobile}
          />
          <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileVisible ? "translate-x-0" : "translate-x-full"}`}>

            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 shrink-0">
              <span className="font-bold text-gray-900 text-sm">MMZ <span className="text-violet-600">Shop</span></span>
              <button onClick={closeMobile} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-2 divide-y divide-gray-100">
                <Link
                  href="/products"
                  onClick={closeMobile}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-gray-800 hover:text-violet-600 transition-colors"
                >
                  All Products
                  <Package className="w-4 h-4 text-gray-400" />
                </Link>

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
                        {item.columns.map((col) => (
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
                        ))}
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
