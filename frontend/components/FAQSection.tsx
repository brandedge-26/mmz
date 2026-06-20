"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How long does a repair take?",
    a: "Most repairs like screen replacements and battery changes are done the same day, usually within 1–3 hours. Complex repairs like water damage may take up to 24 hours.",
  },
  {
    q: "Do you use genuine parts?",
    a: "Yes, we only use original manufacturer-grade parts. We never use cheap third-party replacements that could damage your device or void your warranty.",
  },
  {
    q: "Is the diagnosis really free?",
    a: "Absolutely. We inspect your device and tell you exactly what's wrong at no charge. You only pay if you decide to go ahead with the repair.",
  },
  {
    q: "What warranty do you offer on repairs?",
    a: "All our repairs come with a lifetime warranty on parts and labour. If the same issue comes back, we fix it for free — no questions asked.",
  },
  {
    q: "Which devices do you repair?",
    a: "We repair all major brands including Apple, Samsung, OnePlus, Google Pixel, Huawei, and more. This includes phones, tablets, smartwatches, and earbuds.",
  },
  {
    q: "What if my phone can't be repaired?",
    a: "If we can't fix it, you pay nothing — not even for the diagnosis. We'll also advise you on your best options going forward.",
  },
  {
    q: "Do I need to book an appointment?",
    a: "No appointment needed — you can simply walk in anytime during working hours. However, booking online helps reduce your wait time.",
  },
  {
    q: "Is my data safe during the repair?",
    a: "Your data is completely safe. Our technicians only access what's necessary for the repair and we never store or share your personal information.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — sticky header */}
          <div className="lg:sticky lg:top-24">
            <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-gray-400 mt-3 text-base leading-relaxed">
              Have a question? We&apos;ve got answers. If you don&apos;t find what you&apos;re looking for, feel free to contact us directly.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all ${open === i ? "border-violet-200 bg-violet-50/40" : "border-gray-100 bg-white hover:border-gray-200"}`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-gray-900 font-semibold text-sm">{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open === i ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <svg className={`w-3.5 h-3.5 transition-transform ${open === i ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
