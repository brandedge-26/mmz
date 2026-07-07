import Image from "next/image";

const BRANDS = [
  { name: "Apple",        src: "/appoinments/brands/apple.svg" },
  { name: "Samsung",      src: "/appoinments/brands/samsung.svg" },
  { name: "Google Pixel", src: "/appoinments/brands/gooogle-pixel.svg" },
  { name: "Motorola",     src: "/appoinments/brands/motorola-real.svg" },
  { name: "OnePlus",      src: "/appoinments/brands/oneplus.svg" },
  { name: "Vivo",         src: "/appoinments/brands/vivo.svg" },
  { name: "Oppo",         src: "/appoinments/brands/oppo.svg" },
  { name: "Xiaomi",       src: "/appoinments/brands/xiaomi.svg" },
  { name: "Infinix",      src: "/appoinments/brands/infinix.svg" },
  { name: "Realme",       src: "/appoinments/brands/realme.svg" },
  { name: "Tecno",        src: "/appoinments/brands/tecno.svg" },
  { name: "Lenovo",       src: "/appoinments/brands/lenovo.svg" },
  { name: "Huawei",       src: "/appoinments/brands/huawei.png" },
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
