"use client";

import React from "react";
import { LayoutDashboard, Package, TrendingUp, Banknote, User } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/partner", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/partner/products", label: "Products", icon: Package },
    { href: "/partner/earnings", label: "Earnings", icon: TrendingUp },
    { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
    { href: "/partner/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame navItems={navItems} loginHref="/login/partner" roleLabel="Partner">
      {children}
    </AppFrame>
  );
}
