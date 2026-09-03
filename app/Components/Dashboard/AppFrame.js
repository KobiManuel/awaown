"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import BottomNav from "@/app/Components/Dashboard/BottomNav";
import DesktopSidebar from "@/app/Components/Dashboard/DesktopSidebar";
import ThemeToggle from "@/app/Components/Dashboard/ThemeToggle";
import { ThemePreviewContext } from "@/app/Components/Dashboard/ThemePreviewContext";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";

// Shared shell for every role dashboard (customer/merchant/partner/admin): it
// re-establishes the session from the refresh cookie, gates on auth +
// onboarding, then renders the desktop sidebar / mobile bottom-tab chrome.
// `navItems` drives both nav renderings. `loginHref` doubles as the role source
// (its last segment — /login/customer -> "customer").
/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {Array<{href:string,label:string,icon:any,badge?:number,exact?:boolean}>} props.navItems
 * @param {string} props.loginHref
 * @param {string} props.roleLabel
 * @param {Record<string, string> | null} [props.themeVars] CSS custom-property overrides
 * @param {boolean} [props.hideThemeToggle]
 * @param {boolean} [props.hideThemeToggleOnMobile]
 */
const AppFrame = ({
  children,
  navItems,
  loginHref,
  roleLabel,
  themeVars = null,
  hideThemeToggle = false,
  hideThemeToggleOnMobile = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [preview, setPreview] = React.useState(null);

  const role = loginHref.split("/").filter(Boolean).pop();
  const { resolving, authed, unauth, onboardingComplete } =
    useAuthBootstrap(role);

  const onOnboardingRoute = pathname?.startsWith("/onboarding");

  useEffect(() => {
    if (unauth) router.replace(loginHref);
  }, [unauth, router, loginHref]);

  useEffect(() => {
    if (authed && !onboardingComplete && !onOnboardingRoute) {
      router.replace(`/onboarding/${role}`);
    }
  }, [authed, onboardingComplete, onOnboardingRoute, role, router]);

  if (resolving || unauth || (authed && !onboardingComplete && !onOnboardingRoute)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-shop-accent-1 border-t-transparent" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div
        className="app-frame min-h-screen w-full bg-shop-bg lg:flex"
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
          {!hideThemeToggle && (
            <ThemeToggle
              className={`fixed right-4 top-4 z-[60] shadow-md lg:right-6 lg:top-6 ${
                hideThemeToggleOnMobile ? "hidden lg:flex" : ""
              }`}
            />
          )}
        </ThemePreviewContext.Provider>
      </div>
    </ToastProvider>
  );
};

export default AppFrame;
