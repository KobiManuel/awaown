"use client";

import React from "react";
import {
  LayoutDashboard,
  Store,
  TrendingUp,
  Banknote,
  User,
} from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";
import { useGetPartnerOverviewQuery } from "@/lib/api/partnerApi";
import { STORE_CUSTOMIZATION_DEFAULTS } from "@/lib/partner-store-options";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetPartnerOverviewQuery(undefined);
  const p = data?.profile;

  const themeVars = buildPartnerThemeVars(
    p?.theme ?? STORE_CUSTOMIZATION_DEFAULTS.theme,
    p?.accent ?? STORE_CUSTOMIZATION_DEFAULTS.accent,
    p?.font ?? STORE_CUSTOMIZATION_DEFAULTS.font,
  );

  const navItems = [
    { href: "/partner", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/partner/store", label: "My Store", icon: Store },
    { href: "/partner/earnings", label: "Earnings", icon: TrendingUp },
    { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
    { href: "/partner/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame
      navItems={navItems}
      loginHref="/login/partner"
      roleLabel="Partner"
      themeVars={themeVars}
      hideThemeToggle
    >
      {children}
    </AppFrame>
  );
}
