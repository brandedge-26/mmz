"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Wrench,
  Users, BarChart3, Settings, LogOut, X,
  ChevronDown, CalendarCheck, MessageSquare, PlusCircle, List,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const repairsOpen =
    pathname.startsWith("/appointments") ||
    pathname.startsWith("/contacts");

  const productsOpen =
    pathname.startsWith("/products");

  const [repairsExpanded,   setRepairsExpanded]   = useState(repairsOpen);
  const [productsExpanded,  setProductsExpanded]  = useState(productsOpen);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const handleLogout = async () => { await logout(); };

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-violet-600 text-white shadow-sm shadow-violet-900"
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        {label}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">
              MM<span className="text-violet-400">Z</span>
            </span>
            <p className="text-gray-500 text-[10px] leading-none mt-0.5">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">

          <li><NavLink href="/"          icon={LayoutDashboard} label="Dashboard" /></li>
          <li><NavLink href="/orders" icon={ShoppingBag} label="Orders" /></li>

          {/* Products — expandable */}
          <li>
            <button
              onClick={() => setProductsExpanded((o) => !o)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                productsOpen
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Package className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1 text-left">Products</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsExpanded ? "rotate-180" : ""}`} />
            </button>
            {productsExpanded && (
              <ul className="mt-1 ml-3 pl-4 border-l border-gray-700 space-y-1">
                <li>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      pathname === "/products"
                        ? "text-violet-400 bg-gray-800"
                        : "text-gray-500 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <List className="w-[15px] h-[15px] flex-shrink-0" />
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/add"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      pathname === "/products/add"
                        ? "text-violet-400 bg-gray-800"
                        : "text-gray-500 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <PlusCircle className="w-[15px] h-[15px] flex-shrink-0" />
                    Add Product
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Repairs — expandable */}
          <li>
            <button
              onClick={() => setRepairsExpanded((o) => !o)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive("/appointments") || isActive("/contacts")
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Wrench className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1 text-left">Repairs</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${repairsExpanded ? "rotate-180" : ""}`} />
            </button>

            {/* Sub-items */}
            {repairsExpanded && (
              <ul className="mt-1 ml-3 pl-4 border-l border-gray-700 space-y-1">
                <li>
                  <Link
                    href="/appointments"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive("/appointments")
                        ? "text-violet-400 bg-gray-800"
                        : "text-gray-500 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <CalendarCheck className="w-[15px] h-[15px] flex-shrink-0" />
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacts"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive("/contacts")
                        ? "text-violet-400 bg-gray-800"
                        : "text-gray-500 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <MessageSquare className="w-[15px] h-[15px] flex-shrink-0" />
                    Contacts
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li><NavLink href="/customers"  icon={Users}     label="Customers" /></li>
          <li><NavLink href="/analytics"  icon={BarChart3} label="Analytics" /></li>
          <li><NavLink href="/settings"   icon={Settings}  label="Settings" /></li>
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email || "admin@mmz.com"}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-gray-500 hover:text-red-400 transition flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
