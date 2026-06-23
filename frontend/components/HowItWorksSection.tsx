import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ScanSearch, Wrench, BadgeCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    color: "bg-violet-600",
    lightColor: "bg-violet-50 border-violet-100 text-violet-600",
    title: "Walk In or Book Online",
    desc: "Visit either branch directly or book ahead online. No long wait — we respect your time.",
  },
  {
    number: "02",
    icon: ScanSearch,
    color: "bg-blue-600",
    lightColor: "bg-blue-50 border-blue-100 text-blue-600",
    title: "Free Diagnosis",
    desc: "Our technician inspects your device thoroughly and explains exactly what's wrong — completely free, zero obligation.",
  },
  {
    number: "03",
    icon: Wrench,
    color: "bg-amber-500",
    lightColor: "bg-amber-50 border-amber-100 text-amber-600",
    title: "We Fix It Fast",
    desc: "Once you approve the quote, our certified techs get to work with genuine parts. Most repairs done same day.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    color: "bg-green-600",
    lightColor: "bg-green-50 border-green-100 text-green-600",
    title: "Quality Check & Pickup",
    desc: "Every device passes a full quality test before handover. You get it back working like new — with warranty.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Steps */}
          <div>
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
              Fixed in 4 easy steps.
            </h2>
            <p className="text-gray-400 text-base mb-10">
              Getting your device repaired at Memon Mobile Zone is quick, easy, and stress-free.
            </p>

            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-violet-200 via-blue-200 to-green-200 hidden sm:block" />

              <div className="space-y-8">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.number} className="flex gap-5 group relative">
                      {/* Icon circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${s.lightColor} group-hover:${s.color} transition-all duration-300`}>
                        <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-extrabold text-gray-200 tracking-widest">{s.number}</span>
                          <h3 className="text-gray-900 font-bold text-base group-hover:text-violet-700 transition-colors">
                            {s.title}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
              >
                Book a Repair
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT — Staggered images + stat badge */}
          <div className="relative">

            {/* Image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/60">
                <Image
                  src="/home/home-phone-repair.jpg"
                  alt="Technician repairing a device"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/60 mt-10">
                <Image
                  src="/home/technician-2.png"
                  alt="Expert repair at MMZ"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 px-6 py-4 flex items-center gap-4 whitespace-nowrap">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">10,000+</p>
                <p className="text-xs text-gray-400 mt-1">Devices Repaired</p>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">4.9★</p>
                <p className="text-xs text-gray-400 mt-1">Customer Rating</p>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">100%</p>
                <p className="text-xs text-gray-400 mt-1">Warranty</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
