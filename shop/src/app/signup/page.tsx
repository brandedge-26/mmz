"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-gray-200", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${["text-gray-300","text-red-500","text-amber-500","text-blue-500","text-green-600"][score]}`}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const router   = useRouter();
  const register = useAuthStore((s) => s.register);

  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [terms, setTerms]               = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!terms) { setError("Please accept the Terms of Service to continue."); return; }

    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      await register(name, email, password);
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight">
              MMZ <span className="text-violet-600">Shop</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-400">Join MMZ Shop and start shopping today.</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Google */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?app=shop`}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full transition-all text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">First name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                placeholder="John" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Last name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all" />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all pr-11" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Confirm */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Confirm password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password" required
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all pr-11 ${
                  confirm && confirm !== password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-violet-500 focus:ring-violet-100"
                }`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirm && confirm !== password && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer flex-shrink-0" />
            <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-violet-600 hover:text-violet-700 font-medium">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-violet-600 hover:text-violet-700 font-medium">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className={`w-full font-semibold py-3.5 rounded-full transition-colors text-sm shadow-md shadow-violet-200 ${
              loading
                ? "bg-violet-400 text-white cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
