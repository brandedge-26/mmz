import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Walk In or Book Online",
    desc: "Visit our store directly or book an appointment online. No long wait times — we respect your schedule.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Free Diagnosis",
    desc: "Our technician inspects your device thoroughly and tells you exactly what's wrong — completely free, no obligation.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "We Fix It Fast",
    desc: "Once you approve the quote, our certified technicians get to work using genuine parts. Most repairs done same day.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Quality Check & Pickup",
    desc: "Before handover, every device goes through a full quality test. You get it back working like new — with warranty.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">How it works</h2>
          <p className="text-gray-400 mt-3 text-base">
            Getting your device fixed at Memom Mobile Zone is quick, easy, and stress-free.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Steps */}
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.number} className="flex gap-5 group">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  {s.icon}
                </div>
                {/* Text */}
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-300 tracking-widest">{s.number}</span>
                    <h3 className="text-gray-900 font-bold text-base">{s.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
              >
                Book a Repair
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT — Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/home/home-phone-repair.jpg"
                alt="Technician repairing device"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-md mt-8">
              <Image
                src="/home/technician-2.png"
                alt="Expert device repair"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
