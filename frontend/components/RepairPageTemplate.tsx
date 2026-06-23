import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Stethoscope, Zap, ShieldCheck, BadgeDollarSign } from "lucide-react";

type RepairPageProps = {
  brand: string;
  brandIcon: string;
  heroImage: string;
  badgeText: string;
  badgeSubtext: string;
  badgeIcon: string | null;
  headline: string;
  subtext: string;
  repairs: { name: string; desc: string; price: string; time: string }[];
  repairsHeading: string;
  models: string[];
  modelsHeading: string;
  ctaBadge: string;
  ctaHeading: string;
};

const features = [
  {
    label: "Free Diagnosis",
    desc: "No charge to assess your device",
    Icon: Stethoscope,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Same Day Service",
    desc: "Most repairs done in hours",
    Icon: Zap,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Limited Warranty",
    desc: "Every repair backed by warranty",
    Icon: ShieldCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Low Price Guarantee",
    desc: "Best price — always",
    Icon: BadgeDollarSign,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function RepairPageTemplate({
  brand,
  brandIcon,
  heroImage,
  badgeText,
  badgeSubtext,
  badgeIcon,
  headline,
  subtext,
  repairs,
  repairsHeading,
  models,
  modelsHeading,
  ctaBadge,
  ctaHeading,
}: RepairPageProps) {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* Left */}
              <div className="space-y-7">

                {/* Brand label badge */}
                <div className="inline-flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-full px-4 py-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-violet-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                    <Image src={brandIcon} alt={brand} width={22} height={22} className="object-contain" />
                  </div>
                  <span className="text-violet-700 text-sm font-semibold">{brand} Repair</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  {headline}
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  {subtext}
                </p>

                {/* Trust checkmarks */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {["Free Diagnosis", "Warranty Included", "Same Day"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-gray-500 text-sm">
                      <Check className="w-4 h-4 text-violet-600 flex-shrink-0" strokeWidth={2.5} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
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
                    className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold px-7 py-3.5 rounded-full transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Right — Device image card */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <Image src={heroImage} alt={`${brand} Repair`} fill className="object-contain p-8" />

                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100 shadow-sm">
                    {badgeIcon ? (
                      <Image src={badgeIcon} alt={brand} width={36} height={36} className="object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image src={brandIcon} alt={brand} width={24} height={24} className="object-contain" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{badgeText}</p>
                      <p className="text-xs text-gray-400">{badgeSubtext}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Repair Cards ─────────────────────────────────── */}
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Fix</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{repairsHeading}</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repairs.map((r) => (
                <div
                  key={r.name}
                  className="bg-white border border-gray-100 hover:border-violet-200 hover:shadow-md rounded-2xl p-6 transition-all group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-violet-700 transition-colors leading-snug">
                      {r.name}
                    </h3>
                    <span className="bg-violet-50 text-violet-600 text-xs rounded-full px-2.5 py-1 whitespace-nowrap ml-2 flex-shrink-0">
                      {r.time}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{r.desc}</p>

                  {/* Bottom */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-violet-600">{r.price}</p>
                    <span className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
                      Get Quote →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">* Prices vary by model. Final quote given after free diagnosis.</p>
          </div>
        </section>

        {/* ── Features Strip ───────────────────────────────── */}
        <section className="py-14 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map(({ label, desc, Icon, iconBg, iconColor }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Models Section ───────────────────────────────── */}
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Supported Devices</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{modelsHeading}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {models.map((m) => (
                <span
                  key={m}
                  className="bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-violet-100/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/40 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

              <div className="relative z-10 max-w-xl mx-auto space-y-5">
                {/* Violet badge pill */}
                <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-medium px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  {ctaBadge}
                </span>

                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{ctaHeading}</h2>

                <p className="text-gray-400">Walk in today or reach out on WhatsApp. Free diagnosis — no obligation.</p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
                  >
                    Book a Repair
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a
                    href="tel:+923152413134"
                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-violet-400 text-gray-700 hover:text-violet-600 font-semibold px-8 py-4 rounded-full transition-colors text-sm"
                  >
                    Call: 0315-2413134
                  </a>
                </div>

                {/* Trust checkmarks */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
                  {["Free Diagnosis", "Warranty Included", "Same Day"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-violet-500 flex-shrink-0" strokeWidth={2.5} />
                      {item}
                    </div>
                  ))}
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
