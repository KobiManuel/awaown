"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import AppFrame from "@/app/Components/Dashboard/AppFrame";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cartCount = useSelector((s: any) =>
    s.cart.items.reduce((sum: number, i: any) => sum + i.qty, 0),
  );
  const wishlistCount = useSelector((s: any) => s.wishlist.items.length);

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/dashboard/shop", label: "Shop", icon: LayoutGrid },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { href: "/dashboard/account", label: "Account", icon: User },
  ];

  return (
    <AppFrame
      navItems={navItems}
      loginHref="/login/customer"
      roleLabel="Customer"
      hideThemeToggleOnMobile
    >
      {children}
    </AppFrame>
  );
}
