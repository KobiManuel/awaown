"use client";

import React from "react";
import { useSelector } from "react-redux";
import { LayoutDashboard, ClipboardList, Store, Users2, Wallet } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const actionRequiredCount = useSelector((s: any) => {
    const pendingMerchantVerifications = s.merchant.verification.status === "pending" ? 1 : 0;
    const pendingPartnerVerifications = s.partner.verification.status === "pending" ? 1 : 0;
    const pendingRefunds = s.admin.refunds.filter((r: any) => r.status === "pending").length;
    const openComplaints = s.admin.complaints.filter((c: any) => c.status === "open").length;
    return pendingMerchantVerifications + pendingPartnerVerifications + pendingRefunds + openComplaints;
  });

  const navItems = [
    { href: "/admin", label: "Home", icon: LayoutDashboard, exact: true, badge: actionRequiredCount },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/merchants", label: "Merchants", icon: Store },
    { href: "/admin/partners", label: "Partners", icon: Users2 },
    { href: "/admin/finance", label: "Finance", icon: Wallet },
  ];

  return (
    <AppFrame navItems={navItems} loginHref="/login/admin" roleLabel="Admin">
      {children}
    </AppFrame>
  );
}
