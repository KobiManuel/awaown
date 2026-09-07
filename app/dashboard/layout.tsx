"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Home, LayoutGrid, ShoppingBag, Heart, User, Package } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";
import CommerceSync from "@/app/Components/Dashboard/CommerceSync";
import GuestCommerceMerge from "@/app/Components/Dashboard/GuestCommerceMerge";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cartCount = useSelector((s: any) =>
    s.cart.items.reduce((sum: number, i: any) => sum + i.qty, 0),
  );
  const wishlistCount = useSelector((s: any) => s.wishlist.items.length);

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/dashboard/shop", label: "Shop", icon: LayoutGrid },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { href: "/dashboard/orders", label: "Orders", icon: Package },
    // Wishlist keeps a desktop sidebar tab; on mobile the bottom bar is full so
    // it lives on the Account page instead.
    {
      href: "/dashboard/wishlist",
      label: "Wishlist",
      icon: Heart,
      badge: wishlistCount,
      desktopOnly: true,
    },
    { href: "/dashboard/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame
      navItems={navItems}
      loginHref="/login/customer"
      roleLabel="Customer"
      hideThemeToggleOnMobile
    >
      <GuestCommerceMerge />
      <CommerceSync />
      {children}
    </AppFrame>
  );
}
