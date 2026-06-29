import { ShieldCheck, Truck, RotateCcw, Headphones, Star, BadgeCheck } from "lucide-react";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "100% Genuine Products",
    desc: "Every item is sourced directly from authorised distributors. No fakes, no replicas — ever.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "We deliver to every city across Pakistan. Fast, tracked, and right to your doorstep.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Easy Returns",
    desc: "Not satisfied? Return or exchange within 30 days — no questions asked.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our team is available 7 days a week to help you with any query or concern.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Shop with confidence. All transactions are encrypted and fully protected.",
  },
  {
    icon: Star,
    title: "Top Rated Brands",
    desc: "We stock only the best — Apple, Samsung, Anker, JBL, Spigen, and many more.",
  },
];

export default function WhyMMZ() {
  return (
    <section className="px-3 sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 p-px">
        {/* Inner container with border effect via p-px + inner bg */}
        <div className="relative rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 px-6 sm:px-10 py-10 sm:py-14 overflow-hidden">

          {/* Subtle glow blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-800/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 mb-10 text-center sm:text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400 mb-2">
              Why choose us
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              The MMZ Difference
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-md mx-auto sm:mx-0">
              Everything you need from a phone accessories store — quality, speed, and trust built in.
            </p>
          </div>

          {/* Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-white/[0.06] sm:divide-y-0 sm:border sm:border-white/[0.07] sm:rounded-2xl overflow-hidden">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`flex items-start gap-4 px-6 py-6 sm:border-white/[0.07]
                    ${i % 3 !== 2 ? "lg:border-r" : ""}
                    ${i < 3 ? "sm:border-b" : ""}
                    ${i % 2 === 0 ? "sm:border-r lg:border-r-0" : ""}
                    ${i % 2 === 0 && i % 3 !== 2 ? "lg:border-r" : ""}
                  `}
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-snug">{f.title}</p>
                    <p className="text-xs text-white/45 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
