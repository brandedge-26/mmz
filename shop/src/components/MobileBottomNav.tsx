"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const SHOP_CATEGORIES = [
  { label: "iPhone",            image: "/nav/iphone.png",           href: "/products?brand=iPhone" },
  { label: "Samsung",           image: "/nav/samsung.png",          href: "/products?brand=Samsung" },
  { label: "Google Pixel",      image: "/nav/pixel.png",            href: "/products?brand=Pixel" },
  { label: "Tablets",           image: "/nav/tablets.png",          href: "/products?category=Tablets" },
  { label: "Cases",             image: "/nav/cases.png",            href: "/products?category=Cases" },
  { label: "Screen Protection", image: "/nav/screen-protection.png",href: "/products?category=Screen+Protection" },
  { label: "Power & Charging",  image: "/nav/power.png",            href: "/products?category=Power" },
  { label: "Audio",             image: "/nav/audio.png",            href: "/products?category=Audio" },
];

export default function MobileBottomNav() {
  const pathname        = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const closeMenu = () => {
    setVisible(false);
    setTimeout(() => setMenuOpen(false), 280);
  };

  const isShopActive = pathname.startsWith("/products") || pathname.startsWith("/deals");

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ backgroundColor: `rgba(0,0,0,${visible ? 0.35 : 0})` }}
          onClick={closeMenu}
        />
      )}

      {/* Slide-up panel */}
      {menuOpen && (
        <div
          className="fixed bottom-16 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 px-5 pt-4 pb-6 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-900">Shop by Category</p>
            <button
              onClick={closeMenu}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={closeMenu}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all group"
              >
                <div className="relative w-12 h-10">
                  <Image src={cat.image} alt={cat.label} fill className="object-contain" sizes="48px" />
                </div>
                <span className="text-[10px] font-semibold text-gray-600 group-hover:text-violet-700 text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200">
        <div className="flex items-stretch">

          {/* Home */}
          <Link
            href="/"
            onClick={closeMenu}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          {/* Shop */}
          <button
            onClick={() => menuOpen ? closeMenu() : openMenu()}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              menuOpen || isShopActive ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            onClick={closeMenu}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative ${
              pathname === "/cart" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] bg-violet-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                0
              </span>
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </Link>

          {/* Account */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            onClick={closeMenu}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/account" || pathname === "/login" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
