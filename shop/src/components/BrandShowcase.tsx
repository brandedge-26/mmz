const BRANDS = [
  { name: "Apple", logo: "/brands/brands/apple.svg" },
  { name: "Samsung", logo: "/brands/brands/samsung.svg" },
  { name: "Google Pixel", logo: "/brands/brands/gooogle-pixel.svg" },
  { name: "OnePlus", logo: "/brands/brands/oneplus.svg" },
  { name: "Oppo", logo: "/brands/brands/oppo.svg" },
  { name: "Vivo", logo: "/brands/brands/vivo.svg" },
  { name: "Xiaomi", logo: "/brands/brands/xiaomi.svg" },
  { name: "Realme", logo: "/brands/brands/realme.svg" },
  { name: "Infinix", logo: "/brands/brands/infinix.svg" },
  { name: "Tecno", logo: "/brands/brands/tecno.svg" },
  { name: "Motorola", logo: "/brands/brands/motorola-real.svg" },
  { name: "Huawei", logo: "/brands/brands/huawei.png" },
  { name: "Lenovo", logo: "/brands/brands/lenovo.svg" },
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
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

          <div className="flex gap-5 animate-marquee w-max">
            {MARQUEE.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex items-center justify-center w-36 h-24 rounded-2xl border border-gray-100 bg-gray-50 hover:border-violet-200 hover:bg-violet-50 transition-all duration-300 shrink-0 overflow-hidden px-5 py-4"
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
