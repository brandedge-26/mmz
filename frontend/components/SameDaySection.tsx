import Image from "next/image";
import Link from "next/link";

export default function SameDaySection() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — single image */}
          <div className="relative rounded-2xl overflow-hidden h-[420px] group">
            <Image
              src="/home/man-repair.png"
              alt="Expert repair technician"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
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
