import { Stethoscope, BadgeDollarSign, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Free Diagnostics",
    desc: "We'll inspect your device at no charge. If the fix needs more work, we'll walk you through every option before touching anything.",
  },
  {
    icon: BadgeDollarSign,
    title: "Low Price Guarantee",
    desc: "We offer honest, upfront pricing with no hidden fees. Quality repairs that don't break the bank — every single time.",
  },
  {
    icon: Zap,
    title: "Same-Day Service",
    desc: "Most repairs are completed within hours. Drop it off in the morning, pick it up good as new before evening.",
  },
  {
    icon: ShieldCheck,
    title: "Limited Warranty",
    desc: "Every repair comes backed by our service warranty. If something's not right, we make it right — no questions asked.",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-gray-50/60 px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex flex-col gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-violet-600" strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
