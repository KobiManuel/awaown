"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// items: [{ href, label, icon, badge?, exact? }] — badge counts are computed by the
// caller (each role's layout) so this component stays role-agnostic.
const BottomNav = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] items-stretch border-t border-shop-border bg-white pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 font-shop shadow-[0_-2px_12px_rgba(0,0,0,0.05)] lg:hidden">
      {items.map(({ href, label, icon: Icon, badge = 0, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
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
