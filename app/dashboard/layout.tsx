"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import BottomNav from "@/app/Components/Dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("awaown_auth");
    if (!stored || stored === "null") {
      router.replace("/login/customer");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-shop-accent-1 border-t-transparent" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen w-full bg-shop-bg">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col border-x border-shop-border bg-white font-shop">
          <div className="flex-1 pb-[92px]">{children}</div>
          <BottomNav />
        </div>
      </div>
    </ToastProvider>
  );
}
