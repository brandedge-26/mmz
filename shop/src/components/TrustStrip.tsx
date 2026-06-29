import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Fast, Tracked Shipping",
    desc: "Most orders ship within one business day so you can gear up quickly.",
  },
  {
    icon: RotateCcw,
    title: "Easy 30-Day Returns",
    desc: "Changed your mind? Hassle-free returns on eligible items within 30 days.",
  },
  {
    icon: ShieldCheck,
    title: "Expert-Approved Picks",
    desc: "Curated accessories tested by repair pros for fit, finish, and durability.",
  },
];

export default function TrustStrip() {
  return (
    <section className="px-3 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl px-5 py-5 hover:border-violet-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="shrink-0 w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mt-0.5">
              <Icon className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">{title}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
