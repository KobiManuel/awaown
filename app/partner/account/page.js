"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  TrendingUp,
  Banknote,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { partnerProfile, formatPrice } from "@/lib/partner-data";
import { dummyUser } from "@/lib/dashboard-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";

const links = [
  { href: "/partner/products", label: "Products to Resell", icon: Package },
  { href: "/partner/earnings", label: "Earnings History", icon: TrendingUp },
  { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "Help Centre", icon: HelpCircle },
  { href: "#", label: "Settings", icon: Settings },
];

export default function PartnerAccountPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user) || dummyUser;
  const walletBalance = useSelector((s) => s.partner.walletBalance);

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px] lg:pb-10">
      <div className="flex items-center gap-4 px-4 pt-5 lg:px-0 lg:pt-10">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(user.name || "A").charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{user.name}</p>
          <p className="text-[12.5px] text-shop-text">{user.email}</p>
          <p className="text-[12.5px] text-shop-text">Referral code: {partnerProfile.referralCode}</p>
        </div>
      </div>

      <div className="mx-4 flex items-center justify-between rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white lg:mx-0">
        <div>
          <p className="text-[11.5px] text-white/75">Wallet Balance</p>
          <p className="text-[16px] font-semibold">{formatPrice(walletBalance)}</p>
        </div>
        <Link
          href="/partner/withdraw"
          className="rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-shop-accent-1"
        >
          Withdraw
        </Link>
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
