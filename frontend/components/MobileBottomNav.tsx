"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Calendar, Phone, Cpu, ShoppingBag, X } from "lucide-react";

const PHONE_REPAIRS = [
  { label: "iPhone",        image: "/header-images/phone-repair/iphone.png",  href: "/repairs/iphone" },
  { label: "Samsung",       image: "/header-images/phone-repair/samsung.png", href: "/repairs/samsung" },
  { label: "Google Pixel",  image: "/header-images/phone-repair/google.png",  href: "/repairs/google-pixel" },
  { label: "Oppo",          image: "/header-images/phone-repair/oppo.jpg",    href: "/repairs/oppo" },
  { label: "Vivo",          image: "/header-images/phone-repair/vivo.jpg",    href: "/repairs/vivo" },
];

const TECH_REPAIRS = [
  { label: "iPad",           image: "/header-images/tech-repair/ipad.png",            href: "/repairs/ipad" },
  { label: "Tablet",         image: "/header-images/tech-repair/tablet.png",          href: "/repairs/tablet" },
  { label: "Something Else", image: "/header-images/tech-repair/something-else.png",  href: "/repairs/something-else" },
];

type MenuKey = "phone" | "tech" | null;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu]   = useState<MenuKey>(null);
  const [visible, setVisible]     = useState(false);   // drives the CSS animation
  const [current, setCurrent]     = useState<MenuKey>(null); // what's actually rendered

  const open = (key: MenuKey) => {
    setCurrent(key);
    // tiny delay so the element mounts before the class is applied
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const close = () => {
    setVisible(false);
    setTimeout(() => { setCurrent(null); setOpenMenu(null); }, 280);
  };

  const toggle = (key: MenuKey) => {
    if (openMenu === key) {
      close();
    } else {
      if (openMenu) {
        // switch menu: close then open
        setVisible(false);
        setTimeout(() => { setCurrent(key); setOpenMenu(key); requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, 200);
      } else {
        setOpenMenu(key);
        open(key);
      }
    }
  };

  // sync current when openMenu first set
  useEffect(() => {
    if (openMenu && !current) open(openMenu);
  }, [openMenu]);

  const menuItems = current === "phone" ? PHONE_REPAIRS : TECH_REPAIRS;
  const menuTitle = current === "phone" ? "Phone Repairs" : "Tech Repairs";

  return (
    <>
      {/* Backdrop */}
      {current && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-300"
          style={{ backgroundColor: `rgba(0,0,0,${visible ? 0.3 : 0})` }}
          onClick={close}
        />
      )}

      {/* Slide-up panel */}
      {current && (
        <div
          className="fixed bottom-16 left-0 right-0 z-50 md:hidden bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 px-5 pt-4 pb-6 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-900">{menuTitle}</p>
            <button
              onClick={close}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all group"
              >
                <div className="relative w-14 h-12">
                  <Image src={item.image} alt={item.label} fill className="object-contain" sizes="56px" />
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-violet-700 text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200">
        <div className="flex items-stretch">

          {/* Home */}
          <Link
            href="/"
            onClick={close}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          {/* Phone Repairs */}
          <button
            onClick={() => toggle("phone")}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              openMenu === "phone" || PHONE_REPAIRS.some(r => pathname === r.href)
                ? "text-violet-600"
                : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Phones</span>
          </button>

          {/* Book */}
          <Link
            href="/appointment"
            onClick={close}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              pathname === "/appointment" ? "text-violet-600" : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Book</span>
          </Link>

          {/* Tech Repairs */}
          <button
            onClick={() => toggle("tech")}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              openMenu === "tech" || TECH_REPAIRS.some(r => pathname === r.href)
                ? "text-violet-600"
                : "text-gray-400 hover:text-violet-600"
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Tech</span>
          </button>

          {/* Shop */}
          <Link
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors text-gray-400 hover:text-violet-600"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Shop</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
