import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked OLED display replaced with OEM-grade panel — touch & Face Unlock preserved.", price: "From Rs. 4,000", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life on any Pixel model.", price: "From Rs. 2,200", time: "30 min" },
  { name: "Charging Port Repair", desc: "USB-C port repair for fast charging and data transfer.", price: "From Rs. 1,600", time: "1 hr" },
  { name: "Back Glass Repair", desc: "Cracked rear glass replaced — original finish restored.", price: "From Rs. 2,800", time: "2 hrs" },
  { name: "Camera Repair", desc: "Pixel's legendary camera — front or rear — fixed fast.", price: "From Rs. 2,500", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Board-level cleaning and repair for liquid-damaged Pixel phones.", price: "From Rs. 2,000", time: "Same day" },
];

const features = [
  { label: "Free Diagnosis", image: "/repairs/features/free-diagnostics.webp", desc: "No charge to assess your device" },
  { label: "Same Day Service", image: "/repairs/features/same-day-service.webp", desc: "Most repairs done in hours" },
  { label: "Limited Warranty", image: "/repairs/features/limited-warranty.webp", desc: "Every repair backed by warranty" },
  { label: "Low Price Guarantee", image: "/repairs/features/low-price-guarantee.webp", desc: "Best price — always" },
];

const models = [
  "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro",
  "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
  "Pixel 6 Pro", "Pixel 6", "Pixel 6a", "Pixel 5",
  "Pixel 4a 5G", "Pixel 4a", "Pixel 4 XL", "Pixel 4",
];

export default function GooglePixelRepairPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* Hero */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <Image src="/header-images/phone-repair/google.png" alt="Google Pixel" width={28} height={28} className="object-contain" />
                  </div>
                  <span className="text-violet-600 text-sm font-semibold uppercase tracking-widest">Google Pixel Repair</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Pixel repairs — precision you can count on.
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  From smashed screens to dead batteries — we repair all Google Pixel models using quality parts and back every fix with a warranty.
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/contact" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200">
                    Book a Repair
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a href="https://api.whatsapp.com/send/?phone=923152413134&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold px-7 py-3.5 rounded-full transition-colors text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  {["Free Diagnosis", "Warranty Included", "Same Day"].map((b) => (
                    <div key={b} className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                  <Image src="/home/phone-repair/google-pixel.png" alt="Google Pixel Repair" fill className="object-contain p-6" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100">
                    <Image src="/repairs/google-badge.png" alt="Google" width={36} height={36} className="object-contain" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Google Service Provider</p>
                      <p className="text-xs text-gray-400">OEM-grade Pixel parts used</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repairs Grid */}
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Fix</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Common Google Pixel repairs</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repairs.map((r) => (
                <div key={r.name} className="border border-gray-100 rounded-2xl p-5 hover:border-violet-200 hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{r.name}</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">{r.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{r.desc}</p>
                  <p className="text-sm font-bold text-violet-600">{r.price}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">* Prices vary by model. Final quote given after free diagnosis.</p>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-14 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src={f.image} alt={f.label} width={36} height={36} className="object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{f.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Models */}
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Supported Devices</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">All Pixel models covered</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {models.map((m) => (
                <span key={m} className="text-sm text-gray-600 font-medium bg-gray-50 border border-gray-100 px-4 py-2 rounded-full hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-colors cursor-default">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-200 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-violet-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-50 rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="relative z-10 max-w-xl mx-auto space-y-5">
                <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-medium px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  Same Day Pixel Repair Available
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ready to fix your Pixel?</h2>
                <p className="text-gray-400">Walk in today or reach out on WhatsApp. Free diagnosis — no obligation.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm shadow-md shadow-violet-200">
                    Book a Repair
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a href="tel:+923152413134" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-violet-400 text-gray-700 hover:text-violet-600 font-semibold px-8 py-4 rounded-full transition-colors text-sm">
                    Call Us Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
