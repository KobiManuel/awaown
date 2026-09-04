"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
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
  MapPin,
  User,
  Check,
  Loader2,
} from "lucide-react";
import { NIGERIAN_STATES, SERVICE_AREA_NOTE } from "@/lib/merchant-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMerchantOverviewQuery,
  useGetMerchantStoreQuery,
  useUpdateMerchantStoreMutation,
} from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

const links = [
  { href: "/merchant/products", label: "Manage Products", icon: Store },
  { href: "/merchant/orders", label: "Orders", icon: ClipboardList },
  { href: "/merchant/payouts", label: "Payouts", icon: Banknote },
  { href: "/merchant/notifications", label: "Notifications", icon: Bell },
  { href: "/merchant/help", label: "Help Centre", icon: HelpCircle },
];

const VERIF = {
  UNVERIFIED: { label: "Not Verified", tone: "bg-red-50 text-shop-accent-3" },
  PENDING: { label: "Verification Pending", tone: "bg-amber-100 text-amber-700" },
  VERIFIED: { label: "Verified Merchant", tone: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Verification Rejected", tone: "bg-red-50 text-shop-accent-3" },
};

export default function MerchantAccountPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const { data: overview } = useGetMerchantOverviewQuery();
  const { data: store, isLoading } = useGetMerchantStoreQuery();
  const [updateStore, { isLoading: saving }] = useUpdateMerchantStoreMutation();
  const { upload: uploadStoreImage, uploading: imageUploading } =
    useMediaUpload("stores");

  const bannerRef = useRef(null);
  const logoRef = useRef(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (store && !draft) {
      setDraft({
        bio: store.bio ?? "",
        bannerUrl: store.bannerUrl ?? null,
        logoUrl: store.logoUrl ?? null,
        state: store.state ?? "",
        address: store.address ?? "",
        phone: store.phone ?? "",
      });
    }
  }, [store, draft]);

  const verif = VERIF[overview?.verification?.status ?? "UNVERIFIED"];
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const dirty =
    store &&
    draft &&
    JSON.stringify({
      bio: store.bio ?? "",
      bannerUrl: store.bannerUrl ?? null,
      logoUrl: store.logoUrl ?? null,
      state: store.state ?? "",
      address: store.address ?? "",
      phone: store.phone ?? "",
    }) !== JSON.stringify(draft);
  const detailsComplete = draft?.state && draft?.address && draft?.phone;

  const pickImage = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await uploadStoreImage(file);
    if (url) set({ [key]: url });
    else showToast("Image upload failed");
  };

  const save = async () => {
    try {
      await updateStore(draft).unwrap();
      showToast("Store changes saved");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px] lg:pb-10">
      <div className="flex items-center gap-4 px-4 pt-5 lg:px-0 lg:pt-10">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[22px] font-semibold text-white">
          {(overview?.profile?.storeName || "S").charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">
            {overview?.profile?.storeName ?? "…"}
          </p>
          {overview?.profile?.ownerName && (
            <p className="text-[12.5px] text-shop-text">
              {overview.profile.ownerName}
            </p>
          )}
          <p className="text-[12.5px] text-shop-text">
            {overview?.profile?.businessName}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          dispatch(
            openModal({
              modalType: MODAL_TYPES.VERIFY_IDENTITY,
              modalProps: { role: "merchant" },
            }),
          )
        }
        className={`mx-4 flex items-center gap-2 rounded-full px-4 py-2.5 lg:mx-0 ${verif.tone}`}
      >
        {overview?.verification?.status === "VERIFIED" ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <ShieldAlert className="h-4 w-4" />
        )}
        <span className="text-[12.5px] font-semibold">{verif.label}</span>
      </button>

      {isLoading || !draft ? (
        <Skeleton className="mx-4 h-64 rounded-[14px] lg:mx-0" />
      ) : (
        <>
          <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4 lg:mx-0">
            <p className="text-[13.5px] font-semibold text-shop-heading">
              Store Settings
            </p>
            <div
              className="relative flex h-28 items-end overflow-hidden rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 bg-cover bg-center"
              style={
                draft.bannerUrl
                  ? { backgroundImage: `url(${draft.bannerUrl})` }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-black/10" />
              <input
                ref={bannerRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickImage(e, "bannerUrl")}
              />
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickImage(e, "logoUrl")}
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  aria-label="Upload store logo"
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow"
                >
                  {draft.logoUrl ? (
                    <img
                      src={draft.logoUrl}
                      alt="Store logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-shop-accent-1" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-shop-heading"
                >
                  {draft.logoUrl ? "Change logo" : "Upload logo"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => bannerRef.current?.click()}
                disabled={imageUploading}
                className="relative m-3 ml-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-shop-heading disabled:opacity-60"
              >
                {imageUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5" />
                )}
                {draft.bannerUrl ? "Change Banner" : "Add Banner"}
              </button>
            </div>
            <p className="text-[10.5px] text-shop-text/60">
              The logo is your store&apos;s profile picture — use a square image
              of your brand mark, not a product photo.
            </p>
            <textarea
              value={draft.bio}
              onChange={(e) => set({ bio: e.target.value })}
              placeholder="Write a short bio for your store..."
              rows={3}
              className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 focus:border-shop-accent-1 focus:outline-none"
            />
          </div>

          <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4 lg:mx-0">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-shop-heading">
                <MapPin className="h-4 w-4 text-shop-accent-1" />
                Store Details
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                  detailsComplete
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {detailsComplete ? "Complete" : "Missing"}
              </span>
            </div>
            <p className="rounded-[8px] bg-shop-accent-1-light px-3 py-2 text-[11px] leading-[15px] text-shop-accent-1">
              {SERVICE_AREA_NOTE}
            </p>
            <select
              value={draft.state}
              onChange={(e) => set({ state: e.target.value })}
              className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1"
            >
              <option value="">Select location</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              value={draft.address}
              onChange={(e) => set({ address: e.target.value })}
              placeholder="Full pickup address"
              className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 outline-none focus:border-shop-accent-1"
            />
            <input
              value={draft.phone}
              onChange={(e) =>
                set({ phone: e.target.value.replace(/[^0-9+ ]/g, "") })
              }
              placeholder="Contact phone number"
              inputMode="tel"
              className="w-full rounded-[10px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading placeholder:text-shop-text/50 outline-none focus:border-shop-accent-1"
            />
          </div>

          {/* One save for both Store Settings and Store Details */}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="mx-4 flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-border disabled:text-shop-text/60 lg:mx-0"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {dirty ? "Save Changes" : "Saved"}
          </button>
        </>
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
