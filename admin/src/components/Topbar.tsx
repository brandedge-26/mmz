"use client";

import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useMenuToggle } from "@/app/(dashboard)/layout";
import { privateAxios } from "@/lib/axios";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const toggleMenu = useMenuToggle();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    privateAxios.get("/notifications/unread-count")
      .then(({ data }) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-20">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 shrink-0">{title}</h1>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell */}
        <Link
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

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
