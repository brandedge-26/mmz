import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white min-h-screen flex items-center pt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
              Cracked screen? Dead battery? We fix it fast.
            </h1>

            {/* Subtext */}
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              Bring your device to Memom Mobile Zone and get it back fixed, tested, and ready to go — usually within the same day.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
              >
                Book a Repair
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-violet-400 text-gray-700 hover:text-violet-600 font-semibold px-7 py-3.5 rounded-full transition-colors text-sm"
              >
                Our Services
              </Link>
            </div>

          </div>

          {/* RIGHT — Image */}
          <div className="relative h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-xl shadow-gray-200">
            <Image
              src="/home/home-phone-repair.jpg"
              alt="Memom Mobile Zone repair store"
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
