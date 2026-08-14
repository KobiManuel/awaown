"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Heart,
  MapPin,
  Wallet,
  Store,
  Users2,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { formatPrice, dummyUser } from "@/lib/dashboard-data";
import { logout } from "@/lib/store/authSlice";
import TopUpSheet from "@/app/Components/Dashboard/TopUpSheet";

const links = [
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "#", label: "Saved Addresses", icon: MapPin },
  { href: "/login/merchant", label: "Become a Merchant", icon: Store },
  { href: "/login/member", label: "Become a Member", icon: Users2 },
  { href: "#", label: "Help Centre", icon: HelpCircle },
  { href: "#", label: "Settings", icon: Settings },
];

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user) || dummyUser;
  const [topUpOpen, setTopUpOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop">
      <div className="flex items-center gap-4 px-4 pt-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(user.name || "A").charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{user.name}</p>
          <p className="text-[12.5px] text-shop-text">{user.email}</p>
          <p className="text-[12.5px] text-shop-text">{user.phone}</p>
        </div>
      </div>

      <div className="mx-4 flex items-center justify-between rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-white/75">Wallet Balance</p>
            <p className="text-[16px] font-semibold">
              {formatPrice(user.walletBalance ?? dummyUser.walletBalance)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTopUpOpen(true)}
          className="rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-shop-accent-1"
        >
          Top Up
        </button>
      </div>

      <TopUpSheet open={topUpOpen} onClose={() => setTopUpOpen(false)} />

      <div className="flex flex-col gap-1 px-4">
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
          onClick={handleLogout}
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
