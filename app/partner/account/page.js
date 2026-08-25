"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  TrendingUp,
  Banknote,
  Bell,
  HelpCircle,
  Palette,
  Eye,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Pencil,
  Check,
  MapPin,
} from "lucide-react";
import { partnerProfile, formatPrice } from "@/lib/partner-data";
import { dummyUser } from "@/lib/dashboard-data";
import { NIGERIAN_STATES } from "@/lib/merchant-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { setStoreName, setStoreDetails } from "@/lib/store/partnerSlice";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const links = [
  { href: "/partner/store", label: "My Store", icon: Store },
  { href: "/partner/customize", label: "Customize My Store", icon: Palette },
  {
    href: partnerProfile.referralLink.replace("https://awaown.com", ""),
    label: "Preview My Store",
    icon: Eye,
    external: true,
  },
  { href: "/partner/earnings", label: "Earnings History", icon: TrendingUp },
  { href: "/partner/withdraw", label: "Withdraw", icon: Banknote },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "Help Centre", icon: HelpCircle },
];

const VERIFICATION_COPY = {
  unverified: { label: "Not Verified", tone: "bg-red-50 text-shop-accent-3" },
  pending: { label: "Verification Pending", tone: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified", tone: "bg-emerald-100 text-emerald-700" },
};

export default function PartnerAccountPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const user = useSelector((s) => s.auth.user) || dummyUser;
  const walletBalance = useSelector((s) => s.partner.walletBalance);
  const storeName = useSelector((s) => s.partner.storeName);
  const verification = useSelector((s) => s.partner.verification);
  const savedDetails = useSelector((s) => s.partner.storeDetails);
  const [editingStore, setEditingStore] = useState(false);
  const [storeNameDraft, setStoreNameDraft] = useState(storeName);
  const [detailsDraft, setDetailsDraft] = useState(savedDetails);

  useEffect(() => {
    setDetailsDraft(savedDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verificationInfo = VERIFICATION_COPY[verification.status];
  const isDetailsDirty = JSON.stringify(savedDetails) !== JSON.stringify(detailsDraft);
  const detailsComplete = Boolean(detailsDraft.state && detailsDraft.address && detailsDraft.phone);

  const saveStoreName = () => {
    if (storeNameDraft.trim()) dispatch(setStoreName(storeNameDraft.trim()));
    setEditingStore(false);
  };

  const updateDetails = (patch) => setDetailsDraft((prev) => ({ ...prev, ...patch }));

  const handleSaveDetails = () => {
    dispatch(setStoreDetails(detailsDraft));
    showToast("Store details saved");
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

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4 lg:mx-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-shop-heading">
            <MapPin className="h-4 w-4 text-shop-accent-1" />
            Store Details
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
              detailsComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {detailsComplete ? "Complete" : "Missing"}
          </span>
        </div>
        <p className="text-[11.5px] text-shop-text">
          Needed for delivery — couriers use this to plan pickup and shipping.
        </p>
        <select
          value={detailsDraft.state || ""}
          onChange={(e) => updateDetails({ state: e.target.value })}
          className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1"
        >
          <option value="" disabled>
            Select state
          </option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={detailsDraft.address || ""}
          onChange={(e) => updateDetails({ address: e.target.value })}
          placeholder="Full pickup address"
          className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 outline-none focus:border-shop-accent-1"
        />
        <input
          value={detailsDraft.phone || ""}
          onChange={(e) => updateDetails({ phone: e.target.value.replace(/[^0-9+]/g, "") })}
          placeholder="Contact phone number"
          inputMode="tel"
          className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 outline-none focus:border-shop-accent-1"
        />
        <button
          type="button"
          onClick={handleSaveDetails}
          disabled={!isDetailsDirty}
          className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-border disabled:text-shop-text/60"
        >
          <Check className="h-3.5 w-3.5" />
          Save Changes
        </button>
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
        {links.map(({ href, label, icon: Icon, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
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
