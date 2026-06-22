import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "text-violet-600 bg-violet-50 border-violet-100",
    title: "Same Day Service",
    desc: "Drop it off in the morning, pick it up by evening. Most repairs done within hours.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "text-green-600 bg-green-50 border-green-100",
    title: "Genuine Parts Only",
    desc: "Original manufacturer-grade parts — no cheap replacements that fail within weeks.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50 border-blue-100",
    title: "Lifetime Warranty",
    desc: "Every repair is backed by a lifetime warranty. Same issue comes back? We fix it free.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-amber-600 bg-amber-50 border-amber-100",
    title: "Certified Technicians",
    desc: "Trained professionals handle your device — not amateurs learning on the job.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-pink-600 bg-pink-50 border-pink-100",
    title: "Fair & Transparent Pricing",
    desc: "You get the full quote before we start. No hidden fees, no last-minute surprises.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    title: "4.9★ Rated Service",
    desc: "Thousands of satisfied customers across Karachi trust Memom Mobile Zone.",
  },
];

const stats = [
  { value: "10,000+", label: "Devices Repaired" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2", label: "Branches in Karachi" },
  { value: "100%", label: "Warranty on Every Repair" },
];

export default function WhyUsSection() {
  return (
    <section className="bg-white py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top — label + heading + subtext */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Repair you can <br className="hidden sm:block" />
              actually <span className="text-violet-600">trust.</span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-gray-400 text-base leading-relaxed max-w-md lg:ml-auto">
              We don&apos;t just fix devices — we build trust with every repair. Here&apos;s what makes us different from the rest.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-5 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
            >
              Book a Free Diagnosis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* LEFT — Feature cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-2xl p-5 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-sm mb-1.5 group-hover:text-violet-700 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* RIGHT — Image + stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src="/home/technician-1.png"
                alt="Expert technician at Memom Mobile Zone"
                fill
                className="object-cover object-center"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-800">Open Now</span>
                </div>
                <p className="text-xs text-gray-400">Mon–Sat 1 PM – 11 PM · Sun 10 AM – 12 AM</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-center">
                  <p className="text-xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
