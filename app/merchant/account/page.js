"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeCheck,
  Store,
  ClipboardList,
  Banknote,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { merchantProfile } from "@/lib/merchant-data";
import { dummyUser } from "@/lib/dashboard-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";

const links = [
  { href: "/merchant/products", label: "Manage Products", icon: Store },
  { href: "/merchant/orders", label: "Orders", icon: ClipboardList },
  { href: "/merchant/payouts", label: "Payouts", icon: Banknote },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "Help Centre", icon: HelpCircle },
  { href: "#", label: "Store Settings", icon: Settings },
];

export default function MerchantAccountPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user) || dummyUser;

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px] lg:pb-10">
      <div className="flex items-center gap-4 px-4 pt-5 lg:px-0 lg:pt-10">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(merchantProfile.storeName || "S").charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[16px] font-semibold text-shop-heading">
              {merchantProfile.storeName}
            </p>
            {merchantProfile.verified && (
              <BadgeCheck className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
            )}
          </div>
          <p className="text-[12.5px] text-shop-text">{user.name}</p>
          <p className="text-[12.5px] text-shop-text">{user.email}</p>
        </div>
      </div>

      <div className="mx-4 flex items-center gap-2 rounded-full bg-shop-accent-1-light px-4 py-2.5 lg:mx-0">
        <BadgeCheck className="h-4 w-4 text-shop-accent-1" />
        <span className="text-[12.5px] font-semibold text-shop-accent-1">
          {merchantProfile.verified ? "Verified Merchant" : "Verification Pending"}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-4 lg:px-0">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-[12px] px-2 py-3 hover:bg-shop-bg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-bg">
              <Icon className="h-4.5 w-4.5 text-shop-heading" strokeWidth={1.75} />
            </span>
            <span className="flex-1 text-[13.5px] font-medium text-shop-heading">{label}</span>
            <ChevronRight className="h-4 w-4 text-shop-text/40" />
          </Link>
        ))}

        <button
          type="button"
          onClick={() => dispatch(openModal({ modalType: MODAL_TYPES.LOGOUT }))}
          className="mt-2 flex items-center gap-3 rounded-[12px] px-2 py-3 text-left hover:bg-shop-bg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
            <LogOut className="h-4.5 w-4.5 text-shop-accent-3" strokeWidth={1.75} />
          </span>
          <span className="flex-1 text-[13.5px] font-medium text-shop-accent-3">Log Out</span>
        </button>
      </div>
    </div>
  );
}
