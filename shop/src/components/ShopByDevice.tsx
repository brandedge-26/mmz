import Link from "next/link";
import Image from "next/image";

const DEVICES = [
  {
    name:    "iPhone",
    query:   "iPhone",
    image:   "/devices/iphone.png",
    isLogo:  false,
    color:   "group-hover:border-gray-400",
    badge:   "bg-gray-100 text-gray-700",
  },
  {
    name:    "Samsung",
    query:   "Samsung",
    image:   "/devices/samsung.png",
    isLogo:  false,
    color:   "group-hover:border-blue-300",
    badge:   "bg-blue-50 text-blue-700",
  },
  {
    name:    "Google Pixel",
    query:   "Google",
    image:   "/devices/google-pixel.png",
    isLogo:  false,
    color:   "group-hover:border-green-300",
    badge:   "bg-green-50 text-green-700",
  },
  {
    name:    "OnePlus",
    query:   "OnePlus",
    image:   "/devices/oneplus.svg",
    isLogo:  true,
    color:   "group-hover:border-red-300",
    badge:   "bg-red-50 text-red-700",
  },
  {
    name:    "Motorola",
    query:   "Motorola",
    image:   "/devices/motorola.png",
    isLogo:  false,
    color:   "group-hover:border-violet-300",
    badge:   "bg-violet-50 text-violet-700",
  },
];

export default function ShopByDevice() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-extrabold uppercase tracking-widest text-violet-500 mb-1.5">Browse by brand</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shop by Device</h2>
        <p className="text-sm text-gray-400 mt-1.5">Find accessories made for your phone</p>
      </div>

      {/* Cards grid — 2 on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {DEVICES.map((device) => (
          <Link
            key={device.name}
            href={`/products?q=${encodeURIComponent(device.query)}`}
            className={`group relative bg-white border-2 border-gray-100 ${device.color} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center py-6 px-4 gap-4`}
          >
            {/* Device image */}
            <div className="relative w-full flex items-center justify-center" style={{ height: "120px" }}>
              {device.isLogo ? (
                <Image
                  src={device.image}
                  alt={device.name}
                  width={80}
                  height={80}
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <Image
                  src={device.image}
                  alt={device.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>

            {/* Brand name badge */}
            <div className="text-center">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${device.badge}`}>
                {device.name}
              </span>
              <p className="text-[11px] text-gray-400 mt-1.5 group-hover:text-violet-500 transition-colors">
                View accessories →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
