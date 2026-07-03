"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User, X, LayoutGrid, Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const SHOP_CATEGORIES = [
  { label: "iPhone",            image: "/nav/iphone.png",           href: "/products?brand=iPhone" },
  { label: "Samsung",           image: "/nav/samsung.png",          href: "/products?brand=Samsung" },
  { label: "Google Pixel",      image: "/nav/pixel.png",            href: "/products?brand=Pixel" },
  { label: "Tablets",           image: "/nav/tablets.png",          href: "/products?category=Tablets" },
  { label: "Cases",             image: "/nav/cases.png",            href: "/cases" },
  { label: "Screen Protection", image: "/nav/screen-protection.png",href: "/screen-protection" },
  { label: "Power & Charging",  image: "/nav/power.png",            href: "/power-charging" },
  { label: "Audio",             image: "/nav/audio.png",            href: "/audio" },
];

export default function MobileBottomNav() {
  const pathname        = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user            = useAuthStore((s) => s.user);
  const cartCount       = useCartStore((s) => s.totalItems)();
  const wishCount       = useWishlistStore((s) => s.items.length);

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

          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">Shop by Category</p>
            <button
              onClick={closeMenu}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* All Products shortcut */}
          <Link
            href="/products"
            onClick={closeMenu}
            className="flex items-center gap-3 w-full mb-3 px-3 py-2.5 rounded-2xl border border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-sm font-bold text-violet-700">All Products</span>
          </Link>

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
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] bg-violet-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            onClick={closeMenu}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/wishlist" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${pathname === "/wishlist" ? "fill-current" : ""}`} />
              {wishCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] bg-violet-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {wishCount > 99 ? "99+" : wishCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Wishlist</span>
          </Link>

          {/* Account */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            onClick={closeMenu}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/account" || pathname === "/login" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            {isAuthenticated && user ? (
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="text-[9px] font-extrabold text-white leading-none">
                  {getInitials(user.name)}
                </span>
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-[10px] font-semibold">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
