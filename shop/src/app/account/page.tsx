"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Package, Heart, LogOut, ChevronRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/authStore";
import { privateAxios } from "@/lib/axios";

// ─── Shared ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400";

function Alert({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <p className={`text-sm rounded-xl px-4 py-3 font-medium ${
      type === "success"
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-red-50 text-red-600 border border-red-200"
    }`}>
      {msg}
    </p>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const user       = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name,    setName]    = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await privateAxios.patch("/users/profile", { name });
      updateUser({ name: res.data.user.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <User className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Profile</h2>
          <p className="text-xs text-gray-400">Update your display name</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
          <input value={user?.email ?? ""} disabled className={inputCls} />
        </div>
        {error && <Alert type="error"   msg={error} />}
        {saved && <Alert type="success" msg="Profile updated successfully." />}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-sm ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

function PasswordSection() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (newPw !== confirmPw) { setError("New passwords do not match."); return; }
    if (newPw.length < 6)    { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await privateAxios.patch("/users/password", { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <Lock className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-400">Keep your account secure</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <input
              type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              className={`${inputCls} ${confirmPw && confirmPw !== newPw ? "border-red-300 focus:border-red-400 focus:ring-red-200" : ""}`}
            />
          </div>
        </div>
        {error && <Alert type="error"   msg={error} />}
        {saved && <Alert type="success" msg="Password changed successfully." />}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-sm ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Updating..." : saved ? "✓ Updated!" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick links ──────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { href: "/orders",   icon: Package, label: "My Orders",  sub: "View your order history" },
  { href: "/wishlist", icon: Heart,   label: "Wishlist",   sub: "Items you saved"         },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const router        = useRouter();
  const user          = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logout        = useAuthStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  // Not initialized yet — skeleton
  if (!isInitialized) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        </main>
      </>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
            <User className="w-8 h-8 text-violet-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sign in to view your account</h2>
          <p className="mt-2 text-sm text-gray-400">You need to be logged in to manage your profile.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 px-7 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
          >
            Sign in
          </button>
        </main>
      </>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

          {/* Page header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-xl font-extrabold text-violet-600">{getInitials(user.name)}</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-0.5">Account</p>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {QUICK_LINKS.map(({ href, icon: Icon, label, sub }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 hover:border-violet-200 hover:shadow-md transition-all group">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 group-hover:bg-violet-100 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{label}</p>
                  <p className="text-xs text-gray-400 truncate">{sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <ProfileSection />
            <PasswordSection />

            {/* Sign out */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Sign Out</p>
                  <p className="text-xs text-gray-400 mt-0.5">You will be logged out of your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
