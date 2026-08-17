"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import BottomNav from "@/app/Components/Dashboard/BottomNav";
import DesktopSidebar from "@/app/Components/Dashboard/DesktopSidebar";

// Shared shell for every role dashboard (customer/merchant/partner): auth guard,
// toasts, a desktop sidebar + wide content area at lg+, and the same phone-frame +
// bottom-tab app shell below that. `navItems` drives both nav renderings.
const AppFrame = ({ children, navItems, loginHref, roleLabel }) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("awaown_auth");
    if (!stored || stored === "null") {
      router.replace(loginHref);
      return;
    }
    setReady(true);
  }, [router, loginHref]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-shop-accent-1 border-t-transparent" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen w-full bg-shop-bg lg:flex">
        <DesktopSidebar items={navItems} roleLabel={roleLabel} />
        <div className="w-full lg:min-w-0 lg:flex-1">
          <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col border-x border-shop-border bg-white font-shop lg:max-w-none lg:border-x-0">
            <div className="flex-1 pb-[92px] lg:pb-0">{children}</div>
            <BottomNav items={navItems} />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AppFrame;
