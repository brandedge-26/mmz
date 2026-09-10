import { Package, Star, RefreshCw, BadgeDollarSign } from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    title: "Express Delivery",
    desc: "All Over Pakistan",
  },
  {
    icon: Star,
    title: "Positive Feedback",
    desc: "99% Customer Satisfaction Rate",
  },
  {
    icon: RefreshCw,
    title: "Easy Return & Refunds",
    desc: "T&Cs Apply",
  },
  {
    icon: BadgeDollarSign,
    title: "Cost Saving",
    desc: "Excellent Price & Sales",
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white border-y border-gray-100 mt-8 mb-4">
      <div className="max-w-screen-2xl mx-auto divide-x divide-gray-100 grid grid-cols-2 sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-3 px-6 py-8"
          >
            <div className="w-14 h-14 flex items-center justify-center">
              <Icon className="w-9 h-9 text-gray-800" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-sm text-violet-600 mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
