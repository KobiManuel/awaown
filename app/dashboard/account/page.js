"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Heart,
  MapPin,
  Wallet,
  HelpCircle,
  LifeBuoy,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWalletQuery } from "@/lib/api/walletApi";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/api/notificationsApi";

const links = [
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/help", label: "Help Centre", icon: HelpCircle },
];

export default function AccountPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { data: wallet, isLoading: walletLoading } = useGetWalletQuery();
  const { data: notifications } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllNotificationsReadMutation();

  const balance = wallet?.balance ?? user?.walletBalance ?? 0;
  // Only unread activity shows here, capped at 2 — reading one makes it drop off.
  const unread = (notifications?.items ?? []).filter((n) => !n.readAt);
  const recent = unread.slice(0, 2);

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px] lg:pb-10">
      <div className="flex items-center gap-4 px-4 pt-5 lg:px-0 lg:pt-10">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(user?.name || "A").charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">
            {user?.name}
          </p>
          <p className="text-[12.5px] text-shop-text">{user?.email}</p>
          {user?.phone && (
            <p className="text-[12.5px] text-shop-text">{user.phone}</p>
          )}
        </div>
      </div>

      <div className="mx-4 flex items-center justify-between rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white lg:mx-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-white/75">Wallet Balance</p>
            {walletLoading ? (
              <Skeleton className="mt-1 h-5 w-24 bg-white/20" />
            ) : (
              <p className="text-[16px] font-semibold">{formatPrice(balance)}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => dispatch(openModal({ modalType: MODAL_TYPES.TOP_UP }))}
          className="rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-shop-accent-1"
        >
          Top Up
        </button>
      </div>

      {recent.length > 0 && (
        <div className="mx-4 flex flex-col gap-2.5 rounded-[14px] border border-shop-border p-4 lg:mx-0">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-shop-heading">
              Recent activity
            </p>
            <div className="flex items-center gap-3">
              {unread.length > 1 && (
                <button
                  type="button"
                  onClick={() => markAll()}
                  className="text-[11.5px] font-medium text-shop-accent-1"
                >
                  Mark all read
                </button>
              )}
              <Link
                href="/dashboard/notifications"
                className="text-[11.5px] font-semibold text-shop-accent-1"
              >
                View all
              </Link>
            </div>
          </div>
          {recent.map((n) => (
            <Link
              key={n.id}
              href={n.href || "/dashboard/notifications"}
              onClick={() => markRead(n.id)}
              className="flex items-start gap-2"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-shop-accent-1" />
              <div>
                <p className="text-[12.5px] font-medium text-shop-heading">
                  {n.title}
                </p>
                {n.body && (
                  <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                    {n.body}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 px-4 lg:px-0">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-[12px] px-2 py-3 hover:bg-shop-bg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-bg">
              <Icon
                className="h-4.5 w-4.5 text-shop-heading"
                strokeWidth={1.75}
              />
            </span>
            <span className="flex-1 text-[13.5px] font-medium text-shop-heading">
              {label}
            </span>
            <ChevronRight className="h-4 w-4 text-shop-text/40" />
          </Link>
        ))}

        <button
          type="button"
          onClick={() => dispatch(openModal({ modalType: MODAL_TYPES.LOGOUT }))}
          className="mt-2 flex items-center gap-3 rounded-[12px] px-2 py-3 text-left hover:bg-shop-bg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
            <LogOut
              className="h-4.5 w-4.5 text-shop-accent-3"
              strokeWidth={1.75}
            />
          </span>
          <span className="flex-1 text-[13.5px] font-medium text-shop-accent-3">
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}
