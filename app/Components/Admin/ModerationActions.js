"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Play } from "lucide-react";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import {
  useSetAdminMerchantStatusMutation,
  useReviewAdminMerchantKycMutation,
  useSetAdminPartnerStatusMutation,
  useReviewAdminPartnerKycMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

/**
 * Approve/reject KYC + suspend/reinstate for a merchant or partner.
 * Shown on the admin detail pages, next to the verification documents.
 * Every action goes through a confirm dialog (proceed / cancel).
 */
export default function ModerationActions({ kind, id, status, verification, name }) {
  const showToast = useToast();
  const confirm = useConfirm();
  const [setMerchantStatus] = useSetAdminMerchantStatusMutation();
  const [reviewMerchantKyc] = useReviewAdminMerchantKycMutation();
  const [setPartnerStatus] = useSetAdminPartnerStatusMutation();
  const [reviewPartnerKyc] = useReviewAdminPartnerKycMutation();

  const setStatus = kind === "partner" ? setPartnerStatus : setMerchantStatus;
  const reviewKyc = kind === "partner" ? reviewPartnerKyc : reviewMerchantKyc;
  const noun = kind === "partner" ? "partner" : "merchant";
  const who = name || `this ${noun}`;

  const act = async (fn, ok) => {
    try {
      await fn();
      showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const approve = async () => {
    const res = await confirm({
      title: `Approve ${who}'s verification?`,
      message: `They'll be able to ${
        kind === "partner" ? "resell products and withdraw profit" : "receive orders and payouts"
      }. They get an email.`,
      confirmLabel: "Approve verification",
    });
    if (!res) return;
    act(() => reviewKyc({ id, approve: true }).unwrap(), "Verification approved");
  };

  const reject = async () => {
    const res = await confirm({
      title: `Reject ${who}'s verification?`,
      confirmLabel: "Reject",
      tone: "danger",
      reason: { label: "Reason (emailed to them)", required: true },
    });
    if (!res) return;
    act(
      () => reviewKyc({ id, approve: false, note: res.reason }).unwrap(),
      "Verification rejected",
    );
  };

  const suspend = async () => {
    const res = await confirm({
      title: `Suspend ${who}?`,
      message: "Their storefront goes offline until reinstated.",
      confirmLabel: "Suspend",
      tone: "danger",
      reason: { label: "Reason (emailed to them)", required: true },
    });
    if (!res) return;
    act(
      () => setStatus({ id, status: "suspended", reason: res.reason }).unwrap(),
      `${noun[0].toUpperCase() + noun.slice(1)} suspended`,
    );
  };

  const reinstate = async () => {
    const res = await confirm({ title: `Reinstate ${who}?`, confirmLabel: "Reinstate" });
    if (!res) return;
    act(
      () => setStatus({ id, status: "active" }).unwrap(),
      `${noun[0].toUpperCase() + noun.slice(1)} reinstated`,
    );
  };

  const isActive = status === "active";

  return (
    <div className="mx-4 flex flex-wrap gap-2 border-t border-shop-border pt-4 lg:mx-8">
      {verification !== "VERIFIED" && (
        <button
          type="button"
          onClick={approve}
          className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white"
        >
          <ShieldCheck className="h-4 w-4" /> Approve Verification
        </button>
      )}
      {verification === "PENDING" && (
        <button
          type="button"
          onClick={reject}
          className="flex items-center gap-1.5 rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-shop-heading"
        >
          <ShieldX className="h-4 w-4" /> Reject
        </button>
      )}
      {isActive ? (
        <button
          type="button"
          onClick={suspend}
          className="flex items-center gap-1.5 rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-shop-accent-3"
        >
          <ShieldAlert className="h-4 w-4" /> Suspend
        </button>
      ) : (
        <button
          type="button"
          onClick={reinstate}
          className="flex items-center gap-1.5 rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-emerald-700"
        >
          <Play className="h-4 w-4" /> Reactivate
        </button>
      )}
    </div>
  );
}
