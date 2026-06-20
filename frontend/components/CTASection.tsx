import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-violet-600 rounded-3xl px-8 py-16 md:px-16 overflow-hidden text-center">

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Same Day Repair Available
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Your device deserves the best repair.
            </h2>

            <p className="text-white/70 text-lg leading-relaxed">
              Walk in today or book online. Our certified technicians are ready to fix your device fast — with genuine parts and a lifetime warranty.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-violet-600 font-bold px-8 py-4 rounded-full transition-colors text-sm"
              >
                Book a Repair
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-colors text-sm"
              >
                Call Us Now
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              {["Free Diagnosis", "Lifetime Warranty", "Genuine Parts", "4.9★ Rated"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
