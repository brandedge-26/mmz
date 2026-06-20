const steps = [
  {
    number: "01",
    title: "Walk In or Book Online",
    desc: "Visit our store directly or book an appointment online. No long wait times — we respect your schedule.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Free Diagnosis",
    desc: "Our technician inspects your device thoroughly and tells you exactly what's wrong — completely free, no obligation.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "We Fix It Fast",
    desc: "Once you approve the quote, our certified technicians get to work using genuine parts. Most repairs done same day.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Quality Check & Pickup",
    desc: "Before handover, every device goes through a full quality test. You get it back working like new — with warranty.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
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
        <div className="max-w-xl mb-14">
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            How it works
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Getting your device fixed at Memom Mobile Zone is quick, easy, and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.number} className="relative flex flex-col gap-5">

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(100%_-_1rem)] w-full h-px border-t-2 border-dashed border-gray-200 z-0" />
              )}

              {/* Icon box */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                {s.icon}
              </div>

              {/* Text */}
              <div>
                <span className="text-xs font-bold text-gray-300 tracking-widest">{s.number}</span>
                <h3 className="text-gray-900 font-bold text-lg mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-gray-900 font-bold text-xl">Ready to get your device fixed?</h3>
            <p className="text-gray-400 text-sm mt-1">Walk in anytime or book a slot — we&apos;ll take care of the rest.</p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap shadow-md shadow-violet-200"
          >
            Book a Repair
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
