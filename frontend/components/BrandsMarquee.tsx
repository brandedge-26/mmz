import Image from "next/image";

const BRANDS = [
  { name: "Vivo",         src: "/brandlogos/vivo.svg" },
  { name: "Redmi",        src: "/brandlogos/redim.svg" },
  { name: "Xiaomi",       src: "/brandlogos/xiaomi.svg" },
  { name: "OnePlus",      src: "/brandlogos/oneplus.svg" },
  { name: "Google Pixel", src: "/brandlogos/google_pixel.svg" },
  { name: "Poco",         src: "/brandlogos/POCO.avif" },
  { name: "Nokia",        src: "/brandlogos/nokia.png" },
  { name: "Oppo",         src: "/brandlogos/oppo.png" },
  { name: "Infinix",      src: "/brandlogos/infinix.svg" },
  { name: "Huawei",       src: "/brandlogos/huawei_logo.png" },
  { name: "Samsung",      src: "/brandlogos/samsung.svg" },
  { name: "Sparx",        src: "/brandlogos/sparx.jpg" },
  { name: "Sony",         src: "/brandlogos/sony.png" },
  { name: "ZTE",          src: "/brandlogos/ZTE_logo.jpg" },
  { name: "Aquos",        src: "/brandlogos/aquos.png" },
  { name: "Dcode",        src: "/brandlogos/dcode.jpg" },
  { name: "Oukitel",      src: "/brandlogos/oukitel.png" },
  { name: "Vnus",         src: "/brandlogos/vnus.jpg" },
  { name: "Alcatel",      src: "/brandlogos/alcatel.jpg" },
  { name: "Digit",        src: "/brandlogos/digit.png" },
  { name: "Realme",       src: "/brandlogos/realme.svg" },
  { name: "Apple",        src: "/brandlogos/apple.svg" },
  { name: "Nubia",        src: "/brandlogos/nubia.webp" },
  { name: "Itel",         src: "/brandlogos/itel.svg" },
  { name: "Motorola",     src: "/brandlogos/motorola-real.svg" },
  { name: "Honor",        src: "/brandlogos/honor.png" },
  { name: "LG",          src: "/brandlogos/lg.svg" },
  { name: "QSmart",      src: "/brandlogos/Q_smart.avif" },
];

const MARQUEE = [...BRANDS, ...BRANDS];

export default function BrandsMarquee() {
  return (
    <section className="px-3 sm:px-6 py-4">
      <div className="rounded-3xl border border-gray-200 bg-white px-6 sm:px-10 py-10 overflow-hidden">

        {/* Header */}
        <div className="text-center mb-9">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 mb-1">
            Official Partners
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Top Brands, All in One Place
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            We repair genuine devices from the world&apos;s most trusted brands.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden" style={{ transform: "translateZ(0)" }}>
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

          <div className="flex gap-5 w-max" style={{ animation: "marquee 25s linear infinite" }}>
            {MARQUEE.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex items-center justify-center w-44 h-28 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:shadow-md transition-all duration-300 shrink-0 overflow-hidden px-6 py-5"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={120}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
