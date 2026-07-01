"use client";

import { useState, createContext, useContext } from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

const MenuToggleCtx = createContext<() => void>(() => {});

export function useMenuToggle() {
  return useContext(MenuToggleCtx);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 pb-16 lg:pb-0">
            <MenuToggleCtx value={() => setSidebarOpen(true)}>
              {children}
            </MenuToggleCtx>
          </main>
        </div>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}
