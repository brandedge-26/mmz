"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useMenuToggle } from "@/app/(dashboard)/layout";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const toggleMenu = useMenuToggle();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-20">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 shrink-0">{title}</h1>

      {/* Search — center */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full ring-1 ring-white" />
        </button>

        {/* Mobile menu toggle — replaces avatar */}
        <button
          onClick={toggleMenu}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
