"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/shop", label: "Shop", icon: LayoutGrid },
  { href: "/dashboard/cart", label: "Cart", icon: ShoppingBag, badgeKey: "cart" },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart, badgeKey: "wishlist" },
  { href: "/dashboard/account", label: "Account", icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.qty, 0),
  );
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const badges = { cart: cartCount, wishlist: wishlistCount };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] items-stretch border-t border-shop-border bg-white pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 font-shop shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      {tabs.map(({ href, label, icon: Icon, badgeKey }) => {
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        const badge = badgeKey ? badges[badgeKey] : 0;
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            <span className="relative">
              <Icon
                className={`h-5 w-5 transition-colors ${
                  active ? "text-shop-accent-1" : "text-shop-text/50"
                }`}
                strokeWidth={active ? 2 : 1.75}
              />
              {badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-shop-accent-3 px-1 text-[9px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </span>
            <span
              className={`text-[10.5px] font-medium transition-colors ${
                active ? "text-shop-accent-1" : "text-shop-text/60"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
