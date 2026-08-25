"use client";

import React from "react";
import { useSelector } from "react-redux";
import { LayoutDashboard, Store, TrendingUp, Banknote, User } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/partner", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/partner/store", label: "My Store", icon: Store },
    { href: "/partner/earnings", label: "Earnings", icon: TrendingUp },
    { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
    { href: "/partner/account", label: "Account", icon: User },
  ];

  // The partner's saved store branding reskins their whole dashboard, not just
  // their public storefront — Customize temporarily overrides this live via
  // ThemePreviewContext while editing, before it's saved.
  const storeTheme = useSelector((s: any) => s.partner.storeTheme);
  const storeAccent = useSelector((s: any) => s.partner.storeAccent);
  const storeFont = useSelector((s: any) => s.partner.storeFont);
  const themeVars = buildPartnerThemeVars(storeTheme, storeAccent, storeFont);

  return (
    <AppFrame navItems={navItems} loginHref="/login/partner" roleLabel="Partner" themeVars={themeVars}>
      {children}
    </AppFrame>
  );
}
