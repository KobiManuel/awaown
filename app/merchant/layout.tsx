"use client";

import React from "react";
import { useSelector } from "react-redux";
import { LayoutDashboard, Package, ClipboardList, Banknote, User } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pendingOrders = useSelector((s: any) =>
    s.merchant.orders.filter((o: any) => o.status === "awaiting_confirmation").length,
  );

  const navItems = [
    { href: "/merchant", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/merchant/products", label: "Products", icon: Package },
    { href: "/merchant/orders", label: "Orders", icon: ClipboardList, badge: pendingOrders },
    { href: "/merchant/payouts", label: "Payouts", icon: Banknote },
    { href: "/merchant/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame navItems={navItems} loginHref="/login/merchant" roleLabel="Merchant">
      {children}
    </AppFrame>
  );
}
