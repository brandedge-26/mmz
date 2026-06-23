import Image from "next/image";
import Link from "next/link";
import {
  Zap, ShieldCheck, BadgeDollarSign, Users,
  CircleDollarSign, Star,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "text-violet-600 bg-violet-50 border-violet-100",
    title: "Same-Day Service",
    desc: "Drop it off in the morning, pick it up by evening. Most repairs completed within hours.",
  },
  {
    icon: ShieldCheck,
    color: "text-green-600 bg-green-50 border-green-100",
    title: "Genuine Parts Only",
    desc: "Original manufacturer-grade components — no cheap replacements that fail within weeks.",
  },
  {
    icon: BadgeDollarSign,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    title: "Lifetime Warranty",
    desc: "Every repair is backed by a lifetime warranty. Same issue returns? We fix it free.",
  },
  {
    icon: Users,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    title: "Certified Technicians",
    desc: "Trained professionals handle your device — not amateurs learning on the job.",
  },
  {
    icon: CircleDollarSign,
    color: "text-pink-600 bg-pink-50 border-pink-100",
    title: "Transparent Pricing",
    desc: "Full quote before we start. No hidden fees, no last-minute surprises — ever.",
  },
  {
    icon: Star,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    title: "4.9★ Rated Service",
    desc: "Thousands of satisfied customers across Karachi trust Memon Mobile Zone.",
  },
];

const stats = [
  { value: "10,000+", label: "Devices Repaired" },
  { value: "4.9★",   label: "Average Rating" },
  { value: "2",      label: "Branches in Karachi" },
  { value: "100%",   label: "Warranty on All Repairs" },
];

export default function WhyUsSection() {
  return (
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Repair you can <span className="text-violet-600">actually trust.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mt-3 max-w-lg">
              We don&apos;t just fix devices — we build lasting trust with every single repair.
            </p>
          </div>
          <Link
            href="/contact"
            className="self-start lg:self-auto inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm shadow-md shadow-violet-200 shrink-0"
          >
            Book a Free Diagnosis
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* LEFT — feature cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-white hover:bg-white border border-gray-100 hover:border-violet-100 hover:shadow-lg hover:shadow-violet-50 rounded-2xl p-5 transition-all duration-200 cursor-default"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 ${f.color}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-gray-900 font-bold text-sm mb-1.5 group-hover:text-violet-700 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* RIGHT — image + stats */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Image card */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-100" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/home/technician-1.png"
                alt="Expert technician at Memon Mobile Zone"
                fill
                className="object-cover object-center"
              />
              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Open now badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/60 shadow-lg">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-gray-900">Open Now</span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">
                  Mon–Sat 1 PM – 11 PM &middot; Sun 10 AM – 12 AM
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-gray-100 rounded-2xl px-4 py-4 text-center hover:border-violet-100 hover:shadow-sm transition-all duration-200"
                >
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
