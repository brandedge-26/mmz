import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck, Clock, Heart, Star,
  Check, Phone, MessageCircle,
} from "lucide-react";

const stats = [
  { value: "17+", label: "Years Experience" },
  { value: "50K+", label: "Phones Repaired" },
  { value: "4.9★", label: "Rating" },
  { value: "2", label: "Branches Across Karachi" },
];

const milestones = [
  {
    year: "2007",
    title: "Founded",
    desc: "Started with a single shop in Karachi's mobile market, driven by passion for mobile technology and honest service.",
  },
  {
    year: "2012",
    title: "Expanded Services",
    desc: "Added motherboard-level repairs and water damage restoration to our expertise, serving more complex repair needs.",
  },
  {
    year: "2018",
    title: "50,000 Repairs",
    desc: "Crossed a major milestone — trusted by over 50,000 customers across Karachi through word-of-mouth alone.",
  },
  {
    year: "2024",
    title: "2nd Branch Opened",
    desc: "Opened our North Karachi branch to serve even more customers city-wide and reduce wait times.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    color: "bg-violet-50 text-violet-600",
    title: "Honesty First",
    desc: "We diagnose first and give a clear upfront price. No hidden charges, no unnecessary repairs — ever.",
  },
  {
    icon: Star,
    color: "bg-amber-50 text-amber-600",
    title: "Quality Guaranteed",
    desc: "Only high-quality OEM parts are used. Every repair comes with a written warranty card.",
  },
  {
    icon: Clock,
    color: "bg-blue-50 text-blue-600",
    title: "Fast Turnaround",
    desc: "We respect your time. Most repairs are completed while you wait — in just 30–45 minutes.",
  },
  {
    icon: Heart,
    color: "bg-rose-50 text-rose-600",
    title: "Customer First",
    desc: "Your satisfaction is our top priority. 17+ years of trust built one repair at a time.",
  },
];

const whyUs = [
  "17+ years of proven track record",
  "Certified and experienced technicians",
  "Only genuine quality parts used",
  "Transparent pricing — no hidden fees",
  "All major brands supported",
  "Warranty on every repair",
  "Fast 30–45 minute service",
  "Customer data privacy guaranteed",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* ── Hero ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Est. 2007 · Karachi
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
              Karachi&apos;s Most Trusted<br />
              <span className="text-violet-600">Mobile Repair Shop</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-14">
              From a small shop in 2007 to Karachi&apos;s most trusted repair brand — 17+ years of experience, 50,000+ phones repaired, and countless satisfied customers.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-5 hover:border-violet-100 hover:shadow-sm transition-all">
                  <p className="text-3xl font-extrabold text-gray-900 leading-none mb-1">{s.value}</p>
                  <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left — text */}
              <div>
                <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                  From 2007 to Today
                </h2>
                <div className="space-y-4 text-gray-500 text-base leading-relaxed">
                  <p>
                    In 2007, our journey began with a small shop in Karachi&apos;s mobile market. The founder&apos;s dedication, skill, and honest dealings with customers slowly built what is now one of Karachi&apos;s most trusted names in mobile repair.
                  </p>
                  <p>
                    We started with basic repairs — screens and batteries. Over time, we expanded our expertise to handle complex motherboard repairs, water damage restoration, and software-level diagnostics.
                  </p>
                  <p>
                    Today, our customers are our greatest strength. Word-of-mouth and customer loyalty have been our biggest advertisement. We proudly serve 3rd-generation customers — families who bring their children&apos;s phones to us, just like their parents did.
                  </p>
                </div>
              </div>

              {/* Right — image stack */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
                    <Image src="/home/technician-1.png" alt="Our team" fill className="object-cover object-top" />
                  </div>
                  <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg mt-10">
                    <Image src="/home/home-phone-repair.jpg" alt="Repair work" fill className="object-cover" />
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-gray-100 rounded-2xl shadow-xl px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-gray-900">2007</p>
                    <p className="text-xs text-gray-400">Year Est.</p>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-gray-900">17+ Yrs</p>
                    <p className="text-xs text-gray-400">Experience</p>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-gray-900">50K+</p>
                    <p className="text-xs text-gray-400">Phones Repaired</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Milestones ── */}
        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Journey</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Our Milestones</h2>
              <p className="text-gray-400 mt-2">17 years of growth, trust, and excellence</p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-300 via-violet-200 to-transparent hidden sm:block" />

              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-6 group">
                    {/* Year circle */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-violet-200 group-hover:border-violet-500 group-hover:bg-violet-600 transition-all duration-300 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-xs font-extrabold text-violet-600 group-hover:text-white transition-colors leading-none">{m.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 hover:border-violet-100 hover:shadow-sm transition-all">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{m.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
              {[
                { v: "17+", l: "Years in Business" },
                { v: "50K+", l: "Phones Repaired" },
                { v: "4.9★", l: "Customer Rating" },
                { v: "100%", l: "Warranty Covered" },
              ].map((s) => (
                <div key={s.l} className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-violet-100 hover:shadow-sm transition-all">
                  <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{s.v}</p>
                  <p className="text-xs text-gray-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Our Values</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">What We Stand For</h2>
              <p className="text-gray-400 mt-2">Principles we&apos;ve followed for 17+ years</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="group bg-white border border-gray-100 hover:border-violet-100 hover:shadow-lg hover:shadow-violet-50 rounded-2xl p-6 transition-all duration-200">
                    <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">{v.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div>
                <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-3">Why Choose Us</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                  Why Memon Mobile Zone?
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {whyUs.map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-violet-600" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right image */}
              <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl shadow-gray-200">
                <Image src="/home/technician-2.png" alt="Why choose us" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/60">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-900">Open Now</span>
                  </div>
                  <p className="text-xs text-gray-500">Mon–Sat 1 PM – 11 PM · Sun 10 AM – 12 AM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  Ready to Fix Your Phone?
                </h2>
                <p className="text-gray-400 text-base mb-2">Call us or WhatsApp for a free estimate.</p>
                <p className="text-gray-400 text-sm mb-8">
                  Mon–Sat: 1 PM – 11 PM &nbsp;·&nbsp; Sun: 10 AM – 12 AM
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+923152413134"
                    className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200"
                  >
                    <Phone className="w-4 h-4" strokeWidth={2} />
                    Call: 0315-2413134
                  </a>
                  <a
                    href="https://api.whatsapp.com/send/?phone=923152413134"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-violet-300 text-gray-700 hover:text-violet-600 font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={2} />
                    Send a Message
                  </Link>
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
