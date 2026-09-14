const BRANDS = [
  { name: "Vivo",         logo: "/brandlogos/vivo.svg" },
  { name: "Redmi",        logo: "/brandlogos/redim.svg" },
  { name: "Xiaomi",       logo: "/brandlogos/xiaomi.svg" },
  { name: "OnePlus",      logo: "/brandlogos/oneplus.svg" },
  { name: "Google Pixel", logo: "/brandlogos/google_pixel.svg" },
  { name: "Poco",         logo: "/brandlogos/POCO.avif" },
  { name: "Nokia",        logo: "/brandlogos/nokia.png" },
  { name: "Oppo",         logo: "/brandlogos/oppo.png" },
  { name: "Infinix",      logo: "/brandlogos/infinix.svg" },
  { name: "Huawei",       logo: "/brandlogos/huawei_logo.png" },
  { name: "Samsung",      logo: "/brandlogos/samsung.svg" },
  { name: "Sparx",        logo: "/brandlogos/sparx.jpg" },
  { name: "Sony",         logo: "/brandlogos/sony.png" },
  { name: "ZTE",          logo: "/brandlogos/ZTE_logo.jpg" },
  { name: "Aquos",        logo: "/brandlogos/aquos.png" },
  { name: "Dcode",        logo: "/brandlogos/dcode.jpg" },
  { name: "Oukitel",      logo: "/brandlogos/oukitel.png" },
  { name: "Vnus",         logo: "/brandlogos/vnus.jpg" },
  { name: "Alcatel",      logo: "/brandlogos/alcatel.jpg" },
  { name: "Digit",        logo: "/brandlogos/digit.png" },
  { name: "Realme",       logo: "/brandlogos/realme.svg" },
  { name: "Apple",        logo: "/brandlogos/apple.svg" },
  { name: "Nubia",        logo: "/brandlogos/nubia.webp" },
  { name: "Itel",         logo: "/brandlogos/itel.svg" },
  { name: "Motorola",     logo: "/brandlogos/motorola-real.svg" },
  { name: "Honor",        logo: "/brandlogos/honor.png" },
  { name: "LG",          logo: "/brandlogos/lg.svg" },
  { name: "QSmart",      logo: "/brandlogos/Q_smart.avif" },
];

// Duplicate for seamless marquee loop
const MARQUEE = [...BRANDS, ...BRANDS];

export default function BrandShowcase() {
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
            We carry genuine accessories from the world&apos;s most trusted brands.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden" style={{ transform: "translateZ(0)" }}>
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

          <div className="flex gap-5 animate-marquee w-max">
            {MARQUEE.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex items-center justify-center w-44 h-28 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:shadow-md transition-all duration-300 shrink-0 overflow-hidden px-6 py-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
