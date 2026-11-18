"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Banknote, Loader2, Users2 } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import {
  useGetAdminFinanceQuery,
  useDecideWithdrawalMutation,
  useRetryAdminWithdrawalMutation,
  useFinalizeWithdrawalOtpMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const STATUS_TONE = {
  PENDING: "bg-amber-100 text-amber-700",
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

export default function AdminWithdrawalDetailPage() {
  const { reference } = useParams();
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminFinanceQuery();
  const [decideWithdrawal, decideState] = useDecideWithdrawalMutation();
  const [retryWithdrawal, retryState] = useRetryAdminWithdrawalMutation();
  const [finalizeWithdrawalOtp, otpState] = useFinalizeWithdrawalOtpMutation();
  const [otp, setOtp] = useState("");

  const withdrawal = (data?.withdrawals ?? []).find((w) => w.id === reference);

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
      title: `Mark withdrawal ${withdrawal.id} as paid?`,
      message: `Confirms ${formatPrice(withdrawal.amount)} was sent to ${withdrawal.partner}.`,
      confirmLabel: "Mark paid",
    });
    if (!res) return;
    run(
      () => decideWithdrawal({ reference: withdrawal.id, action: "paid" }).unwrap(),
      "Withdrawal marked paid",
    );
  };

  const markFailed = async () => {
    const res = await confirm({
      title: `Mark withdrawal ${withdrawal.id} as failed?`,
      message: `Returns ${formatPrice(withdrawal.amount)} to ${withdrawal.partner}'s wallet and notifies them.`,
      confirmLabel: "Mark failed",
      tone: "danger",
    });
    if (!res) return;
    run(
      () => decideWithdrawal({ reference: withdrawal.id, action: "failed" }).unwrap(),
      "Withdrawal marked failed",
    );
  };

  const doRetry = () =>
    run(
      () => retryWithdrawal(withdrawal.id).unwrap(),
      `Retrying withdrawal ${withdrawal.id}…`,
    );

  const submitOtp = async () => {
    const code = otp.trim();
    if (!code) return;
    const res = await confirm({
      title: `Release ₦${formatPrice(withdrawal.amount)} to ${withdrawal.partner}?`,
      message: "This confirms the code and sends the money - it can't be undone from here.",
      confirmLabel: "Confirm and send",
    });
    if (!res) return;
    run(
      () => finalizeWithdrawalOtp({ reference: withdrawal.id, otp: code }).unwrap(),
      "Code confirmed - Paystack will settle the withdrawal shortly",
    );
    setOtp("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
        <AppHeader title="Withdrawal" backHref="/admin/payouts" showBackOnDesktop />
        <div className="px-4 lg:px-8">
          <Skeleton className="h-64 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="flex flex-col gap-4 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
        <AppHeader title="Withdrawal" backHref="/admin/payouts" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text lg:px-8">
          This withdrawal couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const busy = decideState.isLoading || retryState.isLoading || otpState.isLoading;

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[600px]">
      <AppHeader title={withdrawal.id} backHref="/admin/payouts" showBackOnDesktop />

      <div className="mx-4 flex items-center justify-between gap-3 lg:mx-8">
        <p className="text-[15px] font-semibold text-shop-heading">
          {formatPrice(withdrawal.amount)}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${
            STATUS_TONE[withdrawal.status] || "bg-shop-bg text-shop-text"
          }`}
        >
          {withdrawal.status.toLowerCase().replace("_", " ")}
        </span>
      </div>

      {withdrawal.failureReason && (
        <div className="mx-4 rounded-[12px] bg-red-50 p-3.5 text-[12.5px] text-shop-accent-3 lg:mx-8">
          {withdrawal.failureReason}
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
            <Users2 className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/partners/${withdrawal.partnerId}`}
              className="truncate text-[13px] font-semibold text-shop-heading hover:underline"
            >
              {withdrawal.partner}
            </Link>
            {withdrawal.partnerOwner && (
              <p className="truncate text-[11.5px] text-shop-text/70">
                {withdrawal.partnerOwner}
                {withdrawal.partnerEmail ? ` · ${withdrawal.partnerEmail}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-4 flex flex-col rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <InfoRow label="Amount" value={formatPrice(withdrawal.amount)} />
        <InfoRow label="Bank" value={withdrawal.bankName} />
        <InfoRow
          label="Account"
          value={`${withdrawal.accountName} · ${withdrawal.accountNumber}`}
        />
        <InfoRow
          label="Requested on"
          value={new Date(withdrawal.date).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        />
        {withdrawal.settledAt && (
          <InfoRow
            label="Settled on"
            value={new Date(withdrawal.settledAt).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
        )}
      </div>

      {withdrawal.status === "AWAITING_OTP" && (
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

      {(withdrawal.status === "PENDING" || withdrawal.status === "AWAITING_OTP") && (
        <div className="mx-4 flex flex-col gap-2 lg:mx-8">
          {withdrawal.status === "PENDING" && withdrawal.failureReason && (
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
                  Retry withdrawal
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
