import Link from "next/link";
import { ShieldCheck, Zap, BadgeDollarSign, Star } from "lucide-react";

const trust = [
  { icon: Zap,             label: "Same-Day Repairs" },
  { icon: ShieldCheck,     label: "Lifetime Warranty" },
  { icon: BadgeDollarSign, label: "Genuine Parts" },
  { icon: Star,            label: "4.9★ Rated" },
];

export default function CTASection() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 px-8 py-16 md:px-16 text-center isolate">

          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-100 rounded-full opacity-60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-100 rounded-full opacity-60 blur-3xl pointer-events-none" />

          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Open Now · Same Day Repair Available
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
              Your device deserves<br className="hidden sm:block" /> the best repair.
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Walk in today or book online. Certified technicians, genuine parts, and a lifetime warranty — every single time.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
              >
                Book a Repair
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="https://api.whatsapp.com/send/?phone=923152413134"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white border border-gray-100 text-gray-500 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                  {label}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
