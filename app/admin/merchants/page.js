"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play, ChevronRight, Trash2, MapPin } from "lucide-react";
import { VERIFICATION_TONE } from "@/lib/admin-data";
import { setMerchantStatus, setMerchantVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useUndoBuffer } from "@/app/Components/Dashboard/UndoBar";

export default function AdminMerchantsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const merchants = useSelector((s) => s.admin.merchants);
  const liveStoreDetails = useSelector((s) => s.merchant.storeDetails);
  const { run, bar } = useUndoBuffer();

  const detailsUploaded = (merchant) =>
    merchant.id === "m-1"
      ? Boolean(liveStoreDetails.state && liveStoreDetails.address && liveStoreDetails.phone)
      : merchant.verification === "verified";

  const handleVerify = (merchant, verification) => {
    const previous = merchant.verification;
    dispatch(setMerchantVerification({ id: merchant.id, verification }));
    if (merchant.id === "m-1") dispatch(adminSetVerificationStatus(verification));
    showToast(`${merchant.storeName} verification ${verification === "verified" ? "approved" : "rejected"}`);
    run(
      `Email to ${merchant.owner} sending in a few seconds...`,
      () => {
        dispatch(setMerchantVerification({ id: merchant.id, verification: previous }));
        if (merchant.id === "m-1") dispatch(adminSetVerificationStatus(previous));
        showToast("Undone");
      },
      () => showToast(`Email sent to ${merchant.owner}: verification ${verification}`),
    );
  };

  const handleStatus = (merchant, status, reason) => {
    const previous = merchant.status;
    dispatch(setMerchantStatus({ id: merchant.id, status, reason }));
    showToast(`${merchant.storeName} ${status === "suspended" ? "suspended" : status === "removed" ? "removed" : "reactivated"}`);
    run(
      `Email to ${merchant.owner} sending in a few seconds...`,
      () => {
        dispatch(setMerchantStatus({ id: merchant.id, status: previous, reason: null }));
        showToast("Undone");
      },
      () => showToast(`Email sent to ${merchant.owner}: account ${status}`),
    );
  };

  const handleReject = (merchant) => {
    const reason = window.prompt(`Reason for rejecting ${merchant.storeName}'s verification?`);
    if (reason === null) return;
    handleVerify(merchant, "unverified");
  };

  const handleSuspend = (merchant) => {
    const reason = window.prompt(`Reason for suspending ${merchant.storeName}?`);
    if (reason === null) return;
    handleStatus(merchant, "suspended", reason);
  };

  const handleRemove = (merchant) => {
    const reason = window.prompt(`Reason for permanently removing ${merchant.storeName}? This cannot be undone after the buffer window.`);
    if (reason === null) return;
    handleStatus(merchant, "removed", reason);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Merchants" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, performance, payouts, products and account status.
      </p>

      <div className="flex flex-col gap-2 px-4 lg:px-8">
        {merchants.map((m) => (
          <div key={m.id} className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:gap-4">
            <Link href={`/admin/merchants/${m.id}`} className="flex flex-1 items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light text-[13px] font-semibold text-shop-accent-1">
                {m.storeName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[13px] font-semibold text-shop-heading">{m.storeName}</p>
                <p className="line-clamp-1 text-[11.5px] text-shop-text/70">{m.owner} · {m.products} products · ★ {m.rating}</p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                m.status === "active" ? "bg-emerald-100 text-emerald-700" : m.status === "removed" ? "bg-red-50 text-shop-accent-3" : "bg-shop-bg text-shop-text"
              }`}>
                {m.status}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${VERIFICATION_TONE[m.verification]}`}>
                {m.verification}
              </span>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                detailsUploaded(m) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                <MapPin className="h-3 w-3" />
                {detailsUploaded(m) ? "Details on file" : "Details missing"}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {m.verification !== "verified" && (
                <button
                  type="button"
                  onClick={() => handleVerify(m, "verified")}
                  className="flex items-center gap-1 rounded-full bg-shop-accent-1 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {m.verification === "pending" && (
                <button
                  type="button"
                  onClick={() => handleReject(m)}
                  className="rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-heading"
                >
                  Reject
                </button>
              )}
              {m.status === "active" ? (
                <button
                  type="button"
                  onClick={() => handleSuspend(m)}
                  className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-accent-3"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Suspend
                </button>
              ) : m.status === "suspended" ? (
                <button
                  type="button"
                  onClick={() => handleStatus(m, "active")}
                  className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700"
                >
                  <Play className="h-3.5 w-3.5" />
                  Reactivate
                </button>
              ) : null}
              {m.status !== "removed" && (
                <button
                  type="button"
                  onClick={() => handleRemove(m)}
                  aria-label="Remove merchant"
                  className="flex items-center justify-center rounded-full border border-shop-border px-2.5 py-1.5 text-shop-accent-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <Link href={`/admin/merchants/${m.id}`} className="flex items-center justify-center rounded-full border border-shop-border px-2 py-1.5 text-shop-text/60">
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {m.statusReason && (
              <p className="text-[10.5px] text-shop-text/60 sm:hidden">Reason: {m.statusReason}</p>
            )}
          </div>
        ))}
      </div>
      {bar}
    </div>
  );
}
