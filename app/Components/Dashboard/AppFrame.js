"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import BottomNav from "@/app/Components/Dashboard/BottomNav";
import DesktopSidebar from "@/app/Components/Dashboard/DesktopSidebar";
import ThemeToggle from "@/app/Components/Dashboard/ThemeToggle";
import { ThemePreviewContext } from "@/app/Components/Dashboard/ThemePreviewContext";

// Shared shell for every role dashboard (customer/merchant/partner): auth guard,
// toasts, a desktop sidebar + wide content area at lg+, and the same phone-frame +
// bottom-tab app shell below that. `navItems` drives both nav renderings.
// `themeVars` (optional): CSS custom-property overrides applied to the whole shell —
// e.g. the Partner role passes its saved store accent/font here so its entire
// dashboard (not just its public storefront) reflects its own branding. A page inside
// can further override this live via ThemePreviewContext (see Partner Customize).
/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {Array<object>} props.navItems
 * @param {string} props.loginHref
 * @param {string} [props.roleLabel]
 * @param {Record<string, string> | null} [props.themeVars]
 */
const AppFrame = ({ children, navItems, loginHref, roleLabel, themeVars = null }) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(null);

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
      <div
        className="min-h-screen w-full bg-shop-bg lg:flex"
        style={{ ...themeVars, ...preview }}
        {...(themeVars ? { "data-shop-theme": "" } : {})}
      >
        <ThemePreviewContext.Provider value={{ setThemePreview: setPreview }}>
          <DesktopSidebar items={navItems} roleLabel={roleLabel} />
          <div className="w-full lg:min-w-0 lg:flex-1">
            <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col border-x border-shop-border bg-white font-shop lg:max-w-none lg:border-x-0">
              <div className="flex-1 pb-[92px] lg:pb-0">{children}</div>
              <BottomNav items={navItems} />
            </div>
          </div>
          <ThemeToggle className="fixed right-4 top-4 z-[60] shadow-md lg:right-6 lg:top-6" />
        </ThemePreviewContext.Provider>
      </div>
    </ToastProvider>
  );
};

export default AppFrame;
