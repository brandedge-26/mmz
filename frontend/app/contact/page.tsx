"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* Header */}
        <div className="border-b border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Contact Us</p>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get in touch</h1>
            <p className="mt-2 text-gray-400 text-base max-w-md">
              Call, WhatsApp, or fill in the form below. Walk-ins are always welcome at both branches.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* LEFT — Form */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Muhammad Ahmed"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone / WhatsApp <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    placeholder="+92-300-0000000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone / Device Model</label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 14 Pro, Samsung Galaxy S23"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Describe the Issue <span className="text-red-400">*</span></label>
                <textarea
                  rows={5}
                  placeholder="Tell us what's wrong with your device — cracked screen, battery problem, water damage, etc."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all resize-none"
                />
              </div>

              <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200">
                Send Message
              </button>
            </div>

            {/* RIGHT — Info */}
            <div className="lg:col-span-2 space-y-8">

              {/* Direct contact */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Reach us directly</h2>
                <div className="space-y-4">

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Call / WhatsApp</p>
                      <a href="tel:+923152413134" className="text-gray-900 font-bold text-base hover:text-violet-600 transition-colors">0315-2413134</a>
                      <p className="text-gray-400 text-xs mt-0.5">Instant response during working hours</p>
                      <div className="flex gap-2 mt-3">
                        <a
                          href="tel:+923152413134"
                          className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Now
                        </a>
                        <a
                          href="https://api.whatsapp.com/send/?phone=923152413134&text&type=phone_number&app_absent=0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Email</p>
                      <a href="mailto:info@memonmobilezone.pk" className="text-gray-900 font-semibold text-sm hover:text-violet-600 transition-colors">info@memonmobilezone.pk</a>
                      <p className="text-gray-400 text-xs mt-0.5">Reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Working Hours</p>
                      <p className="text-gray-900 font-semibold text-sm">Mon–Sat: 1:00 PM – 11:00 PM</p>
                      <p className="text-gray-900 font-semibold text-sm">Sunday: 10:00 AM – 12:00 AM</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Branches — 2-col grid below */}
          <div className="mt-14 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Our Branches</h2>
            <div className="grid sm:grid-cols-2 gap-5">

              {/* Branch 1 */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=City+Star+Mall+Saddar+Karachi&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Branch 1 - Saddar"
                />
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                    <p className="text-gray-900 font-bold text-sm">Branch 1 — Saddar</p>
                  </div>
                  <p className="text-gray-500 text-sm pl-4">Shop No LB-41, City Star Mall, Saddar, Karachi</p>
                  <p className="text-gray-400 text-xs pl-4">Mon–Sat: 1:00 PM – 11:00 PM &nbsp;·&nbsp; Sun: 10:00 AM – 12:00 AM</p>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Geo+Mobile+Market+North+Karachi&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Branch 2 - North Karachi"
                />
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                    <p className="text-gray-900 font-bold text-sm">Branch 2 — North Karachi</p>
                  </div>
                  <p className="text-gray-500 text-sm pl-4">Shop No 122, 1st Floor, Geo Mobile Market, North Karachi</p>
                  <p className="text-gray-400 text-xs pl-4">Mon–Sat: 1:00 PM – 11:00 PM &nbsp;·&nbsp; Sun: 10:00 AM – 12:00 AM</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
