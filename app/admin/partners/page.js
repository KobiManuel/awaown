"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play, ChevronRight, Trash2 } from "lucide-react";
import { VERIFICATION_TONE, formatPrice } from "@/lib/admin-data";
import { setPartnerStatus, setPartnerVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useUndoBuffer } from "@/app/Components/Dashboard/UndoBar";

export default function AdminPartnersPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const partners = useSelector((s) => s.admin.partners);
  const { run, bar } = useUndoBuffer();

  const handleVerify = (partner, verification) => {
    const previous = partner.verification;
    dispatch(setPartnerVerification({ id: partner.id, verification }));
    if (partner.id === "p-1") dispatch(adminSetVerificationStatus(verification));
    showToast(`${partner.name} verification ${verification === "verified" ? "approved" : "rejected"}`);
    run(
      `Email to ${partner.name} sending in a few seconds...`,
      () => {
        dispatch(setPartnerVerification({ id: partner.id, verification: previous }));
        if (partner.id === "p-1") dispatch(adminSetVerificationStatus(previous));
        showToast("Undone");
      },
      () => showToast(`Email sent to ${partner.name}: verification ${verification}`),
    );
  };

  const handleStatus = (partner, status, reason) => {
    const previous = partner.status;
    dispatch(setPartnerStatus({ id: partner.id, status, reason }));
    showToast(`${partner.name} ${status === "suspended" ? "suspended" : status === "removed" ? "removed" : "reactivated"}`);
    run(
      `Email to ${partner.name} sending in a few seconds...`,
      () => {
        dispatch(setPartnerStatus({ id: partner.id, status: previous, reason: null }));
        showToast("Undone");
      },
      () => showToast(`Email sent to ${partner.name}: account ${status}`),
    );
  };

  const handleReject = (partner) => {
    const reason = window.prompt(`Reason for rejecting ${partner.name}'s verification?`);
    if (reason === null) return;
    handleVerify(partner, "unverified");
  };

  const handleSuspend = (partner) => {
    const reason = window.prompt(`Reason for suspending ${partner.name}?`);
    if (reason === null) return;
    handleStatus(partner, "suspended", reason);
  };

  const handleRemove = (partner) => {
    const reason = window.prompt(`Reason for permanently removing ${partner.name}? This cannot be undone after the buffer window.`);
    if (reason === null) return;
    handleStatus(partner, "removed", reason);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Partners" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, profit, withdrawals, referrals and performance.
      </p>

      <div className="flex flex-col gap-2 px-4 lg:px-8">
        {partners.map((p) => (
          <div key={p.id} className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:gap-4">
            <Link href={`/admin/partners/${p.id}`} className="flex flex-1 items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light text-[13px] font-semibold text-shop-accent-1">
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[13px] font-semibold text-shop-heading">{p.name}</p>
                <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                  {p.storeName} · {p.referrals} referrals · {formatPrice(p.netProfit)} net profit
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                p.status === "active" ? "bg-emerald-100 text-emerald-700" : p.status === "removed" ? "bg-red-50 text-shop-accent-3" : "bg-shop-bg text-shop-text"
              }`}>
                {p.status}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${VERIFICATION_TONE[p.verification]}`}>
                {p.verification}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {p.verification !== "verified" && (
                <button
                  type="button"
                  onClick={() => handleVerify(p, "verified")}
                  className="flex items-center gap-1 rounded-full bg-shop-accent-1 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {p.verification === "pending" && (
                <button
                  type="button"
                  onClick={() => handleReject(p)}
                  className="rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-heading"
                >
                  Reject
                </button>
              )}
              {p.status === "active" ? (
                <button
                  type="button"
                  onClick={() => handleSuspend(p)}
                  className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-shop-accent-3"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Suspend
                </button>
              ) : p.status === "suspended" ? (
                <button
                  type="button"
                  onClick={() => handleStatus(p, "active")}
                  className="flex items-center gap-1 rounded-full border border-shop-border px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700"
                >
                  <Play className="h-3.5 w-3.5" />
                  Reactivate
                </button>
              ) : null}
              {p.status !== "removed" && (
                <button
                  type="button"
                  onClick={() => handleRemove(p)}
                  aria-label="Remove partner"
                  className="flex items-center justify-center rounded-full border border-shop-border px-2.5 py-1.5 text-shop-accent-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <Link href={`/admin/partners/${p.id}`} className="flex items-center justify-center rounded-full border border-shop-border px-2 py-1.5 text-shop-text/60">
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {p.statusReason && (
              <p className="text-[10.5px] text-shop-text/60 sm:hidden">Reason: {p.statusReason}</p>
            )}
          </div>
        ))}
      </div>
      {bar}
    </div>
  );
}
