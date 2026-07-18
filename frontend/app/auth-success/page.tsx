"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token   = params.get("token");
    const userRaw = params.get("user");

    if (!token || !userRaw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.replace("/");
    } catch {
      router.replace("/login");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
