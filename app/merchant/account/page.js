"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  ClipboardList,
  Banknote,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ImagePlus,
  Eye,
  MapPin,
  User,
  Check,
} from "lucide-react";
import { merchantProfile, NIGERIAN_STATES } from "@/lib/merchant-data";
import { dummyUser } from "@/lib/dashboard-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { saveStoreProfile, setStoreDetails } from "@/lib/store/merchantSlice";
import { readImageAsCompressedDataURL } from "@/lib/file-utils";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const links = [
  { href: "/merchant/products", label: "Manage Products", icon: Store },
  { href: "/merchant/orders", label: "Orders", icon: ClipboardList },
  { href: "/merchant/payouts", label: "Payouts", icon: Banknote },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "Help Centre", icon: HelpCircle },
];

const VERIFICATION_COPY = {
  unverified: { label: "Not Verified", tone: "bg-red-50 text-shop-accent-3" },
  pending: { label: "Verification Pending", tone: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified Merchant", tone: "bg-emerald-100 text-emerald-700" },
};

export default function MerchantAccountPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const user = useSelector((s) => s.auth.user) || dummyUser;
  const verification = useSelector((s) => s.merchant.verification);
  const verificationInfo = VERIFICATION_COPY[verification.status];
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const savedProfile = useSelector((s) => ({
    storeBanner: s.merchant.storeBanner,
    storeLogo: s.merchant.storeLogo,
    storeBio: s.merchant.storeBio,
  }));
  const savedDetails = useSelector((s) => s.merchant.storeDetails);

  const [profileDraft, setProfileDraft] = useState(savedProfile);
  const [detailsDraft, setDetailsDraft] = useState(savedDetails);

  useEffect(() => {
    setProfileDraft(savedProfile);
    setDetailsDraft(savedDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch) => setProfileDraft((prev) => ({ ...prev, ...patch }));
  const updateDetails = (patch) => setDetailsDraft((prev) => ({ ...prev, ...patch }));

  const isProfileDirty = Object.keys(savedProfile).some((key) => savedProfile[key] !== profileDraft[key]);
  const isDetailsDirty = JSON.stringify(savedDetails) !== JSON.stringify(detailsDraft);

  const detailsComplete = Boolean(detailsDraft.state && detailsDraft.address && detailsDraft.phone);

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update({ storeBanner: await readImageAsCompressedDataURL(file) });
    e.target.value = "";
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update({ storeLogo: await readImageAsCompressedDataURL(file) });
    e.target.value = "";
  };

  const handleSaveProfile = () => {
    dispatch(saveStoreProfile({ ...profileDraft, storeDetails: savedDetails }));
    showToast("Store changes saved");
  };

  const handleSaveDetails = () => {
    dispatch(setStoreDetails(detailsDraft));
    showToast("Store details saved");
  };

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px] lg:pb-10">
      <div className="flex items-center gap-4 px-4 pt-5 lg:px-0 lg:pt-10">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(merchantProfile.storeName || "S").charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">
            {merchantProfile.storeName}
          </p>
          <p className="text-[12.5px] text-shop-text">{user.name}</p>
          <p className="text-[12.5px] text-shop-text">{user.email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          dispatch(openModal({ modalType: MODAL_TYPES.VERIFY_IDENTITY, modalProps: { role: "merchant" } }))
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
        <p className="text-[13.5px] font-semibold text-shop-heading">Store Settings</p>

        <div
          className="relative flex h-28 items-end overflow-hidden rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 bg-cover bg-center"
          style={profileDraft.storeBanner ? { backgroundImage: `url(${profileDraft.storeBanner})` } : undefined}
        >
          <div className="absolute inset-0 bg-black/10" />
          <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="absolute left-3 bottom-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow"
          >
            {profileDraft.storeLogo ? (
              <img src={profileDraft.storeLogo} alt="Store logo" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-shop-text/50" />
            )}
          </button>
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="relative m-3 ml-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-shop-heading"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            {profileDraft.storeBanner ? "Change Banner" : "Add Banner"}
          </button>
        </div>
        <p className="text-[11px] text-shop-text/60">Tap the circle to set your store logo.</p>

        <textarea
          value={profileDraft.storeBio || ""}
          onChange={(e) => update({ storeBio: e.target.value })}
          placeholder="Write a short bio for your store..."
          rows={3}
          className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 focus:border-shop-accent-1 focus:outline-none"
        />

        <Link
          href="/shop/fashion-vault"
          target="_blank"
          className="flex items-center justify-center gap-1.5 rounded-full border border-shop-border py-2.5 text-[12.5px] font-semibold text-shop-heading"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview Store
        </Link>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={!isProfileDirty}
          className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-border disabled:text-shop-text/60"
        >
          <Check className="h-3.5 w-3.5" />
          Save Changes
        </button>
      </div>

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
