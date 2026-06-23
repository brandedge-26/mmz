"use client";

import { useState } from "react";
import Link from "next/link";

const branches = [
  {
    id: 1,
    label: "Saddar Branch",
    area: "Saddar, Karachi",
    address: "Shop No LB-41, City Star Mall, Saddar",
    phone: "0315-2413134",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=City+Star+Mall+Saddar+Karachi",
    top: "52%",
    left: "30%",
  },
  {
    id: 2,
    label: "North Karachi Branch",
    area: "North Karachi",
    address: "Shop No 122, 1st Floor, Geo Mobile Market",
    phone: "0315-2413134",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Geo+Mobile+Market+North+Karachi",
    top: "28%",
    left: "68%",
  },
];

function MapPin({ branch }: { branch: typeof branches[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute"
      style={{ top: branch.top, left: branch.left, transform: "translate(-50%, -100%)" }}
      onClick={() => setOpen((p) => !p)}
    >
      {/* Tooltip */}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white rounded-2xl shadow-2xl shadow-gray-300/60 border border-gray-100 p-4 z-20 animate-dropdown-in">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">{branch.label}</p>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{branch.address}</p>
          <p className="text-xs text-gray-400 mt-1">{branch.area}</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs font-medium text-gray-600">{branch.phone}</span>
          </div>
          <a
            href={branch.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 -mt-1.5" />
        </div>
      )}

      {/* 3D Pin */}
      <div className="flex flex-col items-center cursor-pointer group">
        {/* Pin head */}
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          open
            ? "bg-violet-700 scale-110 shadow-violet-400/60"
            : "bg-violet-600 group-hover:scale-110 group-hover:bg-violet-700 shadow-violet-300/50"
        }`}
          style={{
            boxShadow: open
              ? "0 8px 24px rgba(124,58,237,0.55), inset 0 2px 4px rgba(255,255,255,0.25)"
              : "0 6px 18px rgba(124,58,237,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
          }}
        >
          {/* Inner shine */}
          <div className="absolute top-1.5 left-2 w-3 h-2 rounded-full bg-white/30" />
          <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.071 0-4.367-3.3-7.898-7.37-8.268A8.25 8.25 0 003.75 12c0 3.374 1.557 6.068 3.501 8.07a19.58 19.58 0 002.683 2.283 16.974 16.974 0 001.144.742zM12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Pin tail */}
        <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent transition-colors duration-200 ${
          open ? "border-t-violet-700" : "border-t-violet-600 group-hover:border-t-violet-700"
        }`} />
        {/* Shadow on ground */}
        <div className={`w-4 h-1.5 rounded-full bg-gray-900/20 blur-sm mt-0.5 transition-all duration-200 ${open ? "scale-110" : ""}`} />
      </div>
    </div>
  );
}

export default function LocationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f3f0fa] py-10 mx-4 sm:mx-6 lg:mx-8 rounded-3xl">

      {/* Realistic city map SVG background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 340">
        {/* Base fill */}
        <rect width="1200" height="340" fill="#ede9f7" />

        {/* City blocks */}
        <rect x="30"  y="20"  width="110" height="70"  rx="3" fill="#e4dff5" />
        <rect x="30"  y="110" width="110" height="50"  rx="3" fill="#e4dff5" />
        <rect x="30"  y="180" width="110" height="80"  rx="3" fill="#e4dff5" />
        <rect x="30"  y="278" width="110" height="50"  rx="3" fill="#e4dff5" />

        <rect x="165" y="20"  width="90"  height="90"  rx="3" fill="#e4dff5" />
        <rect x="165" y="130" width="90"  height="60"  rx="3" fill="#e4dff5" />
        <rect x="165" y="210" width="90"  height="110" rx="3" fill="#e4dff5" />

        <rect x="280" y="20"  width="130" height="55"  rx="3" fill="#e4dff5" />
        <rect x="280" y="95"  width="130" height="80"  rx="3" fill="#e4dff5" />
        <rect x="280" y="195" width="130" height="60"  rx="3" fill="#e4dff5" />
        <rect x="280" y="275" width="130" height="55"  rx="3" fill="#e4dff5" />

        {/* Park / green area */}
        <rect x="440" y="30"  width="100" height="120" rx="6" fill="#d4f0d8" opacity="0.7" />
        <rect x="440" y="170" width="100" height="80"  rx="6" fill="#d4f0d8" opacity="0.5" />

        <rect x="570" y="20"  width="80"  height="60"  rx="3" fill="#e4dff5" />
        <rect x="570" y="100" width="80"  height="90"  rx="3" fill="#e4dff5" />
        <rect x="570" y="210" width="80"  height="70"  rx="3" fill="#e4dff5" />
        <rect x="570" y="298" width="80"  height="32"  rx="3" fill="#e4dff5" />

        <rect x="680" y="20"  width="120" height="75"  rx="3" fill="#e4dff5" />
        <rect x="680" y="115" width="120" height="55"  rx="3" fill="#e4dff5" />
        <rect x="680" y="190" width="120" height="90"  rx="3" fill="#e4dff5" />
        <rect x="680" y="298" width="120" height="32"  rx="3" fill="#e4dff5" />

        <rect x="830" y="20"  width="90"  height="90"  rx="3" fill="#e4dff5" />
        <rect x="830" y="130" width="90"  height="70"  rx="3" fill="#e4dff5" />
        <rect x="830" y="220" width="90"  height="60"  rx="3" fill="#e4dff5" />
        <rect x="830" y="298" width="90"  height="32"  rx="3" fill="#e4dff5" />

        <rect x="950" y="20"  width="110" height="55"  rx="3" fill="#e4dff5" />
        <rect x="950" y="95"  width="110" height="80"  rx="3" fill="#e4dff5" />
        <rect x="950" y="195" width="110" height="55"  rx="3" fill="#e4dff5" />
        <rect x="950" y="268" width="110" height="62"  rx="3" fill="#e4dff5" />

        <rect x="1090" y="20"  width="90" height="100" rx="3" fill="#e4dff5" />
        <rect x="1090" y="140" width="90" height="80"  rx="3" fill="#e4dff5" />
        <rect x="1090" y="240" width="90" height="90"  rx="3" fill="#e4dff5" />

        {/* Small building footprints inside blocks */}
        <rect x="40"  y="30"  width="30" height="20" rx="1" fill="#d5cff0" />
        <rect x="80"  y="30"  width="50" height="20" rx="1" fill="#d5cff0" />
        <rect x="40"  y="60"  width="90" height="20" rx="1" fill="#d5cff0" />
        <rect x="290" y="30"  width="50" height="30" rx="1" fill="#d5cff0" />
        <rect x="355" y="30"  width="45" height="30" rx="1" fill="#d5cff0" />
        <rect x="690" y="30"  width="45" height="40" rx="1" fill="#d5cff0" />
        <rect x="750" y="30"  width="40" height="40" rx="1" fill="#d5cff0" />
        <rect x="960" y="30"  width="40" height="30" rx="1" fill="#d5cff0" />
        <rect x="1010" y="30" width="40" height="30" rx="1" fill="#d5cff0" />

        {/* Major arterial roads (horizontal) */}
        <rect x="0" y="9"   width="1200" height="10" fill="#f5f3ff" />
        <rect x="0" y="99"  width="1200" height="10" fill="#f5f3ff" />
        <rect x="0" y="185" width="1200" height="9"  fill="#f5f3ff" />
        <rect x="0" y="262" width="1200" height="12" fill="#f5f3ff" />
        <rect x="0" y="328" width="1200" height="12" fill="#f5f3ff" />

        {/* Major arterial roads (vertical) */}
        <rect x="145" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="260" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="420" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="546" y="0" width="20"  height="340" fill="#f5f3ff" />
        <rect x="660" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="810" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="930" y="0" width="16"  height="340" fill="#f5f3ff" />
        <rect x="1080" y="0" width="16" height="340" fill="#f5f3ff" />

        {/* Minor roads (horizontal) */}
        <rect x="0" y="55"  width="1200" height="5" fill="#ede9f7" opacity="0.8" />
        <rect x="0" y="158" width="1200" height="5" fill="#ede9f7" opacity="0.8" />
        <rect x="0" y="232" width="1200" height="5" fill="#ede9f7" opacity="0.8" />
        <rect x="0" y="300" width="1200" height="4" fill="#ede9f7" opacity="0.8" />

        {/* Diagonal road */}
        <line x1="0" y1="340" x2="440" y2="0" stroke="#f5f3ff" strokeWidth="8" opacity="0.6" />
        <line x1="760" y1="0" x2="1200" y2="280" stroke="#f5f3ff" strokeWidth="6" opacity="0.5" />

        {/* Road center dashes on major roads */}
        {[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140].map((x, i) => (
          <rect key={i} x={x} y="103" width="40" height="2" rx="1" fill="#c4b8f0" opacity="0.5" />
        ))}
        {[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140].map((x, i) => (
          <rect key={i} x={x} y="266" width="40" height="2" rx="1" fill="#c4b8f0" opacity="0.5" />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          Find us in Karachi
        </h2>
        <p className="text-gray-500 text-base leading-relaxed mb-7">
          Two conveniently located branches — hover the pins to find the one closest to you.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm shadow-lg shadow-violet-300/40"
        >
          Get Directions
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Map pins layer */}
      <div className="relative z-10 mx-auto max-w-5xl h-28 mt-3">
        {branches.map((b) => (
          <MapPin key={b.id} branch={b} />
        ))}
      </div>

    </section>
  );
}
