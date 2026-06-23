import Image from "next/image";
import Link from "next/link";

const brands = [
  { label: "Start a Samsung repair", image: "/home/brand-small-banner/samsung-ipad-new2.jpg", href: "/repairs/samsung" },
  { label: "Start an Apple repair", image: "/home/brand-small-banner/apple-new2.jpg", href: "/repairs/iphone" },
  { label: "Start a Google repair", image: "/home/brand-small-banner/google-new.jpg", href: "/repairs/google-pixel" },
  { label: "Start an Oppo repair", image: "/home/brand-small-banner/oppo.jpg", href: "/repairs/oppo" },
  { label: "Start a Vivo repair", image: "/home/brand-small-banner/vivo-new.jpg", href: "/repairs/vivo" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.label}
              href={brand.href}
              className="group flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:border-violet-300 hover:shadow-md transition-all duration-200"
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
