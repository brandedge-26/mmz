"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarCheck,
  MessageSquare,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",             icon: LayoutDashboard, label: "Dashboard"    },
  { href: "/orders",       icon: ShoppingBag,     label: "Orders"       },
  { href: "/appointments", icon: CalendarCheck,   label: "Appointments" },
  { href: "/contacts",     icon: MessageSquare,   label: "Contacts"     },
  { href: "/settings",     icon: Settings,        label: "Settings"     },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors"
            >
              {/* Active indicator pill */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-600 rounded-full" />
              )}

              <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-violet-50" : ""}`}>
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-violet-600" : "text-gray-400"
                  }`}
                />
              </div>

              <span
                className={`text-[10px] font-semibold leading-none transition-colors ${
                  active ? "text-violet-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
