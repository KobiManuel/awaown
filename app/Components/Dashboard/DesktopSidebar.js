"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { dummyUser } from "@/lib/dashboard-data";

// items: same shape as BottomNav's items. roleLabel is a small eyebrow under the logo
// (e.g. "Merchant", "Partner") so the same shell reads correctly per dashboard.
const DesktopSidebar = ({ items, roleLabel }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user) || dummyUser;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-shop-border bg-white font-shop lg:flex">
      <Link href="/" className="flex items-center px-6 pt-6">
        <div className="relative h-9 w-[130px]">
          <Image
            src="/v2/images/awa-logo.webp"
            alt="AwaOwn"
            fill
            sizes="130px"
            className="object-contain object-left"
          />
        </div>
      </Link>
      {roleLabel && (
        <p className="px-6 pb-5 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-shop-accent-1">
          {roleLabel}
        </p>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map(({ href, label, icon: Icon, badge = 0, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                active
                  ? "bg-shop-accent-1-light text-shop-accent-1"
                  : "text-shop-heading hover:bg-shop-bg"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="rounded-full bg-shop-accent-3 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-shop-border px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[13px] font-semibold text-white">
          {(user.name || "A").charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-shop-heading">
            {user.name}
          </p>
          <p className="truncate text-[11px] text-shop-text/70">{user.email}</p>
        </div>
        <button
          type="button"
          aria-label="Log out"
          onClick={() => dispatch(openModal({ modalType: MODAL_TYPES.LOGOUT }))}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg"
        >
          <LogOut className="h-4 w-4 text-shop-accent-3" strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
