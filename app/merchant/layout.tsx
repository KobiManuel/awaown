"use client";

import React from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Banknote,
  User,
} from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";
import { useGetMerchantOverviewQuery } from "@/lib/api/merchantApi";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetMerchantOverviewQuery(undefined);
  const pending = data?.stats?.pendingOrders ?? 0;

  const navItems = [
    { href: "/merchant", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/merchant/products", label: "Products", icon: Package },
    {
      href: "/merchant/orders",
      label: "Orders",
      icon: ClipboardList,
      badge: pending,
    },
    { href: "/merchant/payouts", label: "Payouts", icon: Banknote },
    { href: "/merchant/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame navItems={navItems} loginHref="/login/merchant" roleLabel="Merchant">
      {children}
    </AppFrame>
  );
}
