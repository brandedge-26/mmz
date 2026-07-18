"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { syncCartOnLogin } from "@/store/cartStore";
import { Loader2 } from "lucide-react";

function AuthSuccessContent() {
  const router         = useRouter();
  const params         = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const token   = params.get("token");
    const userRaw = params.get("user");

    if (!token || !userRaw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      useAuthStore.setState({ user, accessToken: token, isAuthenticated: true });
      setAccessToken(token);
      syncCartOnLogin();
      router.replace("/");
    } catch {
      router.replace("/login");
    }
  }, [params, router, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
