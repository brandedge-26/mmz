import Image from "next/image";
import Link from "next/link";

const devices = [
  { label: "Phone", image: "/home/services/phone-service.webp" },
  { label: "Smart Watch", image: "/home/services/smartwatch-service.png" },
  { label: "Tablet", image: "/home/services/tablet-service.webp" },
  { label: "Earbuds", image: "/home/services/earbuds-service.jpg" },
  { label: "Wearables", image: "/home/services/wearables-service.jpg" },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Fix</p>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Services</h2>
          <p className="text-gray-400 mt-3 text-base max-w-lg">
            From cracked screens to dead batteries — we repair all your favourite devices with genuine parts and same-day service.
          </p>
        </div>

        {/* Device cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {devices.map((d) => (
            <Link
              key={d.label}
              href="#"
              className="group flex flex-col items-center gap-3 border border-gray-200 hover:border-violet-400 hover:shadow-md hover:shadow-violet-100 rounded-2xl p-4 transition-all overflow-hidden"
            >
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={d.image}
                  alt={d.label}
                  fill
                  className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2"
                />
              </div>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-violet-600 transition-colors text-center">
                {d.label}
              </span>
            </Link>
          ))}
        </div>

      

      </div>
    </section>
  );
}
