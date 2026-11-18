"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Banknote, Loader2, Store } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import {
  useGetAdminFinanceQuery,
  useDecidePayoutMutation,
  useRetryAdminPayoutMutation,
  useFinalizePayoutOtpMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const STATUS_TONE = {
  PROCESSING: "bg-amber-100 text-amber-700",
  AWAITING_OTP: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-50 text-shop-accent-3",
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 border-b border-shop-border py-2.5 last:border-0">
    <p className="text-[12px] text-shop-text/70">{label}</p>
    <p className="text-[12.5px] font-medium text-shop-heading">{value}</p>
  </div>
);

export default function AdminPayoutDetailPage() {
  const { reference } = useParams();
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminFinanceQuery();
  const [decidePayout, decideState] = useDecidePayoutMutation();
  const [retryPayout, retryState] = useRetryAdminPayoutMutation();
  const [finalizePayoutOtp, otpState] = useFinalizePayoutOtpMutation();
  const [otp, setOtp] = useState("");

  const payout = (data?.payouts ?? []).find((p) => p.id === reference);

  const run = async (fn, ok) => {
    try {
      await fn();
      showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const markPaid = async () => {
    const res = await confirm({
      title: `Mark payout ${payout.id} as paid?`,
      message: `Confirms ${formatPrice(payout.net)} was sent to ${payout.merchant}.`,
      confirmLabel: "Mark paid",
    });
    if (!res) return;
    run(
      () => decidePayout({ reference: payout.id, action: "paid" }).unwrap(),
      "Payout marked paid",
    );
  };

  const markFailed = async () => {
    const res = await confirm({
      title: `Mark payout ${payout.id} as failed?`,
      message: `Returns ${formatPrice(payout.net)} to ${payout.merchant}'s wallet and notifies them.`,
      confirmLabel: "Mark failed",
      tone: "danger",
    });
    if (!res) return;
    run(
      () => decidePayout({ reference: payout.id, action: "failed" }).unwrap(),
      "Payout marked failed",
    );
  };

  const doRetry = () =>
    run(() => retryPayout(payout.id).unwrap(), `Retrying payout ${payout.id}…`);

  const submitOtp = async () => {
    const code = otp.trim();
    if (!code) return;
    const res = await confirm({
      title: `Release ₦${formatPrice(payout.net)} to ${payout.merchant}?`,
      message: "This confirms the code and sends the money - it can't be undone from here.",
      confirmLabel: "Confirm and send",
    });
    if (!res) return;
    run(
      () => finalizePayoutOtp({ reference: payout.id, otp: code }).unwrap(),
      "Code confirmed - Paystack will settle the payout shortly",
    );
    setOtp("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
        <AppHeader title="Payout" backHref="/admin/payouts" showBackOnDesktop />
        <div className="px-4 lg:px-8">
          <Skeleton className="h-64 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="flex flex-col gap-4 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
        <AppHeader title="Payout" backHref="/admin/payouts" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text lg:px-8">
          This payout couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const busy = decideState.isLoading || retryState.isLoading || otpState.isLoading;

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
      <AppHeader title={payout.id} backHref="/admin/payouts" showBackOnDesktop />

      <div className="mx-4 flex items-center justify-between gap-3 lg:mx-8">
        <p className="text-[15px] font-semibold text-shop-heading">
          {formatPrice(payout.net)} net
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${
            STATUS_TONE[payout.status] || "bg-shop-bg text-shop-text"
          }`}
        >
          {payout.status.toLowerCase().replace("_", " ")}
        </span>
      </div>

      {payout.failureReason && (
        <div className="mx-4 rounded-[12px] bg-red-50 p-3.5 text-[12.5px] text-shop-accent-3 lg:mx-8">
          {payout.failureReason}
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
            <Store className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/merchants/${payout.merchantId}`}
              className="truncate text-[13px] font-semibold text-shop-heading hover:underline"
            >
              {payout.merchant}
            </Link>
            {payout.merchantOwner && (
              <p className="truncate text-[11.5px] text-shop-text/70">
                {payout.merchantOwner}
                {payout.merchantEmail ? ` · ${payout.merchantEmail}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-4 flex flex-col rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <InfoRow label="Requested" value={formatPrice(payout.amount)} />
        <InfoRow label="Fee" value={formatPrice(payout.fee)} />
        <InfoRow label="Net" value={formatPrice(payout.net)} />
        <InfoRow label="Bank" value={payout.bankName} />
        <InfoRow
          label="Account"
          value={`${payout.accountName} · ${payout.accountNumber}`}
        />
        <InfoRow
          label="Requested on"
          value={new Date(payout.date).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        />
        {payout.settledAt && (
          <InfoRow
            label="Settled on"
            value={new Date(payout.settledAt).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
        )}
      </div>

      {payout.status === "AWAITING_OTP" && (
        <div className="mx-4 flex items-center gap-2 lg:mx-8">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP code"
            className="flex-1 rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <button
            type="button"
            onClick={submitOtp}
            disabled={busy}
            className="rounded-[8px] bg-shop-accent-1 px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            Confirm
          </button>
        </div>
      )}

      {(payout.status === "PROCESSING" || payout.status === "AWAITING_OTP") && (
        <div className="mx-4 flex flex-col gap-2 lg:mx-8">
          {payout.status === "PROCESSING" && payout.failureReason && (
            <button
              type="button"
              onClick={doRetry}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white disabled:opacity-60"
            >
              {retryState.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Banknote className="h-4 w-4" />
                  Retry payout
                </>
              )}
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={markPaid}
              disabled={busy}
              className="flex-1 rounded-[10px] bg-emerald-600 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
            >
              Mark paid
            </button>
            <button
              type="button"
              onClick={markFailed}
              disabled={busy}
              className="flex-1 rounded-[10px] border border-shop-border py-3 text-[13px] font-semibold text-shop-heading disabled:opacity-60"
            >
              Mark failed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
