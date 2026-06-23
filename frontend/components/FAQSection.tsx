"use client";

import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";

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
    a: "We repair all major brands including Apple, Samsung, OnePlus, Google Pixel, Oppo, Vivo and more — phones, tablets, smartwatches, and earbuds.",
  },
  {
    q: "What if my phone can't be repaired?",
    a: "If we can't fix it, you pay nothing — not even for the diagnosis. We'll also advise you on the best options going forward.",
  },
  {
    q: "Do I need to book an appointment?",
    a: "No appointment needed — walk in anytime during working hours. Booking online simply helps reduce your wait time.",
  },
  {
    q: "Is my data safe during the repair?",
    a: "Your data is completely safe. Our technicians only access what's necessary and never store or share your personal information.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — centered */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Frequently asked questions
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Have a question? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="text-violet-600 hover:underline font-medium">Contact us.</a>
          </p>
        </div>

        {/* Two-column accordion — independent columns to avoid row-stretch */}
        <div className="max-w-5xl mx-auto mb-12 grid lg:grid-cols-2 gap-3 items-start">
          {[faqs.filter((_, i) => i % 2 === 0), faqs.filter((_, i) => i % 2 !== 0)].map((col, colIdx) => (
            <div key={colIdx} className="space-y-3">
              {col.map((faq) => {
                const i = faqs.indexOf(faq);
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-violet-200 bg-white shadow-md shadow-violet-50"
                        : "border-gray-200 bg-white hover:border-violet-100 hover:shadow-sm"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className={`font-semibold text-sm transition-colors ${isOpen ? "text-violet-700" : "text-gray-800"}`}>
                        {faq.q}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen ? "bg-violet-600 rotate-45" : "bg-gray-100"
                      }`}>
                        <Plus className={`w-4 h-4 transition-colors ${isOpen ? "text-white" : "text-gray-400"}`} strokeWidth={2.5} />
                      </div>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48" : "max-h-0"}`}>
                      <div className="px-5 pb-5">
                        <div className="h-px bg-violet-100 mb-4" />
                        <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="max-w-5xl mx-auto bg-white border border-gray-100 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-violet-600" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Still have questions?</p>
              <p className="text-xs text-gray-400">Our team is ready to help — reach out any time.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="https://api.whatsapp.com/send/?phone=923152413134"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-md shadow-violet-200"
            >
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
