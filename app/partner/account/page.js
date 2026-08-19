"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  TrendingUp,
  Banknote,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Pencil,
  Check,
} from "lucide-react";
import { partnerProfile, formatPrice } from "@/lib/partner-data";
import { dummyUser } from "@/lib/dashboard-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { setStoreName } from "@/lib/store/partnerSlice";

const links = [
  { href: "/partner/store", label: "My Store", icon: Store },
  { href: "/partner/earnings", label: "Earnings History", icon: TrendingUp },
  { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "Help Centre", icon: HelpCircle },
  { href: "#", label: "Settings", icon: Settings },
];

const VERIFICATION_COPY = {
  unverified: { label: "Not Verified", tone: "bg-red-50 text-shop-accent-3" },
  pending: { label: "Verification Pending", tone: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified", tone: "bg-emerald-100 text-emerald-700" },
};

export default function PartnerAccountPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user) || dummyUser;
  const walletBalance = useSelector((s) => s.partner.walletBalance);
  const storeName = useSelector((s) => s.partner.storeName);
  const verification = useSelector((s) => s.partner.verification);
  const [editingStore, setEditingStore] = useState(false);
  const [storeNameDraft, setStoreNameDraft] = useState(storeName);

  const verificationInfo = VERIFICATION_COPY[verification.status];

  const saveStoreName = () => {
    if (storeNameDraft.trim()) dispatch(setStoreName(storeNameDraft.trim()));
    setEditingStore(false);
  };

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

      <div className="mx-4 flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5 lg:mx-0">
        {editingStore ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={storeNameDraft}
              onChange={(e) => setStoreNameDraft(e.target.value)}
              className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              autoFocus
            />
            <button
              type="button"
              onClick={saveStoreName}
              aria-label="Save store name"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-white"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-shop-text/60">Store Name</p>
              <p className="text-[14px] font-semibold text-shop-heading">{storeName}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStoreNameDraft(storeName);
                setEditingStore(true);
              }}
              aria-label="Edit store name"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg"
            >
              <Pencil className="h-4 w-4 text-shop-text/60" />
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          dispatch(openModal({ modalType: MODAL_TYPES.VERIFY_IDENTITY, modalProps: { role: "partner" } }))
        }
        className={`mx-4 flex items-center gap-2 rounded-full px-4 py-2.5 lg:mx-0 ${verificationInfo.tone}`}
      >
        {verification.status === "verified" ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <ShieldAlert className="h-4 w-4" />
        )}
        <span className="text-[12.5px] font-semibold">{verificationInfo.label}</span>
      </button>

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
