"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate submit — wire to real API later
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <section className="px-3 sm:px-6 py-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-violet-950 to-gray-900 px-6 sm:px-14 py-12 sm:py-14">

        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-violet-800/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Text */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/25 rounded-full px-3 py-1 mb-4">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-300 text-xs font-bold uppercase tracking-widest">Newsletter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
              Stay in the Loop
            </h2>
            <p className="text-sm text-white/45 leading-relaxed">
              Get notified about new arrivals, exclusive deals, and the latest in phone accessories — straight to your inbox.
            </p>
          </div>

          {/* Form */}
          <div className="w-full lg:max-w-sm shrink-0">
            {submitted ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">You&apos;re subscribed!</p>
                  <p className="text-white/40 text-xs mt-0.5">We&apos;ll be in touch with the best updates.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/8 border border-white/12 text-white placeholder-white/30 text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            <p className="text-white/25 text-xs mt-3">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
