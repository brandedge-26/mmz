"use client";

import Image from "next/image";
import Link from "next/link";

export type DropdownItem = {
  label: string;
  image?: string;
  desc: string;
  href: string;
  isAll?: boolean;
};

export type DropdownPanel = {
  heading: string;
  subtext: string;
  icon?: string;
  items: DropdownItem[];
};

interface NavDropdownProps {
  panel: DropdownPanel;
}

export default function NavDropdown({ panel }: NavDropdownProps) {
  const gridItems = panel.items.filter((i) => !i.isAll);
  const allItem = panel.items.find((i) => i.isAll);

  return (
    <div className="flex gap-10 px-8 py-7 bg-white">

      {/* Left — info */}
      <div className="w-48 shrink-0 flex flex-col justify-center gap-3">
        <div className="w-10 h-10">
          <Image src={panel.icon ?? "/header-images/icons/phone-repair.svg"} alt={panel.heading} width={40} height={40} className="object-contain" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{panel.heading}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{panel.subtext}</p>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-200 self-stretch" />

      {/* Right — grid */}
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-3">
          {gridItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50 transition-all group"
            >
              <div className="relative w-full h-24 flex items-center justify-center">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                  />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}

          {/* All options card */}
          {allItem && (
            <Link
              href={allItem.href}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-gray-200 group-hover:border-violet-400 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-500 group-hover:text-violet-700 text-center transition-colors">
                All repair options
              </span>
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
