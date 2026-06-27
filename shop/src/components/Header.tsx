"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import CartSidebar from "./CartSidebar";

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Products",   href: "/products" },
  { label: "Deals",      href: "/deals" },
  { label: "About",      href: "/about" },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();

  const user            = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);
  const logout          = useAuthStore((s) => s.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setAvatarOpen(false);
    router.push("/");
  };

  const authLoading = !isInitialized;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

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

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.label} href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-violet-600 bg-violet-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2">

              {/* Skeleton */}
              {authLoading && (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              )}

              {/* Logged in — avatar dropdown */}
              {!authLoading && isAuthenticated && user && (
                <div ref={avatarRef} className="relative">
                  <button onClick={() => setAvatarOpen(!avatarOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all">
                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${avatarOpen ? "rotate-180" : ""}`} />
                  </button>

                  {avatarOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link href="/account" onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                        <Link href="/orders" onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                          <ShoppingBag className="w-4 h-4" /> My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors font-medium">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logged out */}
              {!authLoading && !isAuthenticated && (
                <Link href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                  Login
                </Link>
              )}

              {/* Cart */}
              <button onClick={() => setCartOpen(true)} className="relative w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-gray-600 hover:text-violet-600">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">0</span>
              </button>
            </div>

            {/* Mobile right */}
            <div className="md:hidden flex items-center gap-2">
              {authLoading && <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />}
              {!authLoading && isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
                  {getInitials(user.name)}
                </div>
              )}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600 hover:text-violet-600">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-violet-600 rounded-full text-[8px] font-bold text-white flex items-center justify-center">0</span>
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <span className="font-bold text-gray-900">MMZ <span className="text-violet-600">Shop</span></span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.label} href={link.href}
                    className={`px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "text-violet-700 bg-violet-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom auth */}
            <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-2.5 shrink-0">
              {!authLoading && isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="block w-full text-center py-3 text-sm font-semibold text-red-500 border border-red-100 rounded-full hover:bg-red-50 transition-colors">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="block text-center py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                    Login
                  </Link>
                  <Link href="/signup"
                    className="block text-center py-3 text-sm font-bold bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-200">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
