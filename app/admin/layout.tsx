"use client";

import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  Users2,
  Wallet,
} from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";
import { ConfirmProvider } from "@/app/Components/Admin/ConfirmDialog";
import { useGetAdminOverviewQuery } from "@/lib/api/adminApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetAdminOverviewQuery(undefined);
  const a = data?.actionRequired;
  const badge = a
    ? a.pendingVerifications +
      a.pendingRefunds +
      a.openComplaints +
      a.pendingProducts
    : 0;

  const navItems = [
    {
      href: "/admin",
      label: "Home",
      icon: LayoutDashboard,
      exact: true,
      badge,
    },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/merchants", label: "Merchants", icon: Store },
    { href: "/admin/partners", label: "Partners", icon: Users2 },
    { href: "/admin/finance", label: "Finance", icon: Wallet },
  ];

  return (
    <AppFrame navItems={navItems} loginHref="/login/admin" roleLabel="Admin">
      <ConfirmProvider>{children}</ConfirmProvider>
    </AppFrame>
  );
}
