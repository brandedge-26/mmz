import Link from "next/link";
import { ShoppingBag, Zap } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="px-3 sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 px-8 sm:px-14 py-12 sm:py-16">

        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 right-1/4 w-24 h-24 rounded-full bg-violet-500/30 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">

          {/* Text */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Limited Time</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              Up to <span className="text-yellow-300">30% Off</span><br className="hidden sm:block" /> on Accessories
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Cases, chargers, screen protectors & more. Premium quality at unbeatable prices — only at MMZ Shop.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-700 font-extrabold text-sm rounded-2xl hover:bg-violet-50 transition-colors shadow-xl shadow-black/20"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop the Sale
            </Link>
            <Link
              href="/products?category=Cases"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-2xl hover:bg-white/20 transition-colors"
            >
              Browse Cases →
            </Link>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "Free",    label: "Shipping over PKR 5,000" },
            { value: "30-Day", label: "Easy Returns"       },
            { value: "100%",   label: "Genuine Products"   },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-white font-extrabold text-lg sm:text-xl">{value}</p>
              <p className="text-white/60 text-xs sm:text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
