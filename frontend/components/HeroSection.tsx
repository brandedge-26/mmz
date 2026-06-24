import Image from "next/image";
import Link from "next/link";

const deviceCards = [
  { label: "Phone", image: "/home/phone-repair/iphone.png", href: "/repairs/iphone" },
  { label: "Tablet", image: "/header-images/tech-repair/tablet.png", href: "#" },
  { label: "Earbuds", image: "/home/services/earbuds-service.jpg", href: "#" },
  { label: "Smart Watch", image: "/home/services/smartwatch-service.png", href: "#" },
];

export default function HeroSection() {
  return (
    <section className="bg-white min-h-screen flex items-center pt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
              When your tech stops, we don't.
            </h1>

            {/* Subtext */}
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              At Memon Mobile Zone, we offer expert same-day repairs for phones, tablets, earbuds and more — genuine parts, warranty included.
            </p>

            {/* Device cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {deviceCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
                >
                  <div className="relative w-14 h-12">
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-violet-700 text-center transition-colors">
                    {card.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Footer hint */}
            <p className="text-sm text-gray-400">
              Don&apos;t see your device?{" "}
              <Link href="/contact" className="text-violet-600 hover:underline font-medium">
                Contact us
              </Link>{" "}
              — we repair almost everything.
            </p>

          </div>

          {/* RIGHT — Image */}
          <div className="relative h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-xl shadow-gray-200">
            <Image
              src="/home/technician-1.png"
              alt="Memon Mobile Zone repair store"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
