"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const initAuth      = useAuthStore((s) => s.initAuth);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    if (!isInitialized) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
