import Image from "next/image";
import Link from "next/link";

export default function SameDaySection() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — image grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Top — full width large image */}
            <div className="col-span-2 relative rounded-2xl overflow-hidden h-64 group">
              <Image
                src="/home/same-day-repair.jpg"
                alt="Same-day repairs"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-5 text-white font-bold text-xl leading-tight drop-shadow">
                Same-day<br />repairs
              </span>
            </div>

            {/* Bottom-left */}
            <div className="relative rounded-2xl overflow-hidden h-44 group">
              <Image
                src="/home/technician-1.png"
                alt="Expert technicians"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white font-bold text-sm leading-snug drop-shadow">
                2 Branches<br />in Karachi
              </span>
            </div>

            {/* Bottom-right */}
            <div className="relative rounded-2xl overflow-hidden h-44 group bg-violet-50">
              <Image
                src="/home/accessories.jpg"
                alt="Low price guarantee"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-white font-bold text-sm leading-snug drop-shadow">
                Low price<br />guarantee
              </span>
            </div>
          </div>

          {/* RIGHT — content */}
          <div className="space-y-6 lg:pl-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Your device is in good hands
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Our expert technicians have completed thousands of repairs across Karachi.
              Whether you need a screen fix, battery replacement, or accessories —
              we get it done right, the same day.
            </p>
            <Link
              href="/repairs/iphone"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
            >
              Start a Repair
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
