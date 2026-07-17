import Image from "next/image";
import Link from "next/link";

// Desktop: first 5 shown (lg:grid-cols-5), last one mobile-only (lg:hidden)
const brands = [
  { label: "Start a Samsung repair",   image: "/home/brand-small-banner/samsung.png",     href: "/repairs/samsung",      mobileOnly: false },
  { label: "Start an Apple repair",    image: "/home/brand-small-banner/iphone.png",      href: "/repairs/iphone",       mobileOnly: false },
  { label: "Start a Google repair",    image: "/home/brand-small-banner/google-pixel.png",href: "/repairs/google-pixel", mobileOnly: false },
  { label: "Start an Oppo repair",     image: "/home/brand-small-banner/oppo.png",        href: "/repairs/oppo",         mobileOnly: false },
  { label: "Start a OnePlus repair",   image: "/home/brand-small-banner/one-plus.png",    href: "/repairs/oneplus",      mobileOnly: false },
  { label: "Start a Realme repair",    image: "/home/brand-small-banner/realme.png",      href: "/repairs/realme",       mobileOnly: true  },
];

export default function BrandsSection() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">
            The brands our customers trust
          </h2>
          <p className="text-gray-500 text-sm">
            We repair all major brands with genuine parts and expert technicians.
          </p>
        </div>

        {/* Brand cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.label}
              href={brand.href}
              className={`group flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:border-violet-300 hover:shadow-md transition-all duration-200 ${brand.mobileOnly ? "lg:hidden" : ""}`}
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/2] bg-gray-50 overflow-hidden">
                <Image
                  src={brand.image}
                  alt={brand.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Label */}
              <div className="px-3 py-2.5 bg-white">
                <p className="text-xs font-semibold text-gray-800 group-hover:text-violet-600 transition-colors leading-snug">
                  {brand.label}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
