"use client";

import React from "react";
import { Wallet, Banknote, AlertTriangle, Check, X } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminFinanceQuery,
  useDecideRefundMutation,
  useDecidePayoutMutation,
  useDecideWithdrawalMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function AdminFinancePage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminFinanceQuery();
  const [decide] = useDecideRefundMutation();
  const [decidePayout] = useDecidePayoutMutation();
  const [decideWithdrawal] = useDecideWithdrawalMutation();

  const run = async (fn, ok) => {
    try {
      await fn();
      showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const decideRefund = async (r, approve) => {
    const res = await confirm({
      title: approve ? `Approve refund for ${r.orderRef}?` : `Decline refund for ${r.orderRef}?`,
      message: approve
        ? `${formatPrice(r.amount)} goes back to the customer (card or wallet) and escrow is released.`
        : "The customer is notified and escrow proceeds as normal.",
      confirmLabel: approve ? "Approve refund" : "Decline",
      tone: approve ? undefined : "danger",
    });
    if (!res) return;
    run(
      () => decide({ id: r.id, approve }).unwrap(),
      approve ? "Refund approved & customer credited" : "Refund declined",
    );
  };

  const markPayout = async (p, action) => {
    const res = await confirm({
      title: action === "paid" ? `Mark payout ${p.id} as paid?` : `Mark payout ${p.id} as failed?`,
      message:
        action === "paid"
          ? `Confirms ${formatPrice(p.net)} was sent to ${p.merchant}.`
          : `Returns ${formatPrice(p.net)} to ${p.merchant}'s wallet and notifies them.`,
      confirmLabel: action === "paid" ? "Mark paid" : "Mark failed",
      tone: action === "paid" ? undefined : "danger",
    });
    if (!res) return;
    run(
      () => decidePayout({ reference: p.id, action }).unwrap(),
      action === "paid" ? "Payout marked paid" : "Payout marked failed",
    );
  };

  const markWithdrawal = async (w, action) => {
    const res = await confirm({
      title: action === "paid" ? `Mark withdrawal ${w.id} as paid?` : `Mark withdrawal ${w.id} as failed?`,
      message:
        action === "paid"
          ? `Confirms ${formatPrice(w.amount)} was sent to ${w.partner}.`
          : `Returns ${formatPrice(w.amount)} to ${w.partner}'s wallet and notifies them.`,
      confirmLabel: action === "paid" ? "Mark paid" : "Mark failed",
      tone: action === "paid" ? undefined : "danger",
    });
    if (!res) return;
    run(
      () => decideWithdrawal({ reference: w.id, action }).unwrap(),
      action === "paid" ? "Withdrawal marked paid" : "Withdrawal marked failed",
    );
  };

  const refunds = data?.refunds ?? [];
  const payouts = data?.payouts ?? [];
  const withdrawals = data?.withdrawals ?? [];
  const failedPayments = data?.failedPayments ?? [];

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Finance" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Escrow, payouts, profit share, refunds and revenue reports.
      </p>

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-2 rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white">
          <Wallet className="h-4.5 w-4.5" strokeWidth={1.75} />
          {isLoading ? (
            <Skeleton className="h-5 w-24 bg-white/30" />
          ) : (
            <p className="text-[15px] font-bold">{formatPrice(data?.escrowBalance ?? 0)}</p>
          )}
          <p className="text-[11px] text-white/75">Total Escrow Balance</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
          <Banknote className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <p className="text-[15px] font-bold text-shop-heading">
              {formatPrice(data?.merchantWallets ?? 0)}
            </p>
          )}
          <p className="text-[11px] text-shop-text">Merchant Wallets</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600" strokeWidth={1.75} />
          {isLoading ? (
            <Skeleton className="h-5 w-10" />
          ) : (
            <p className="text-[15px] font-bold text-shop-heading">{failedPayments.length}</p>
          )}
          <p className="text-[11px] text-shop-text">Failed Payments</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
          <Wallet className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
          {isLoading ? (
            <Skeleton className="h-5 w-10" />
          ) : (
            <p className="text-[15px] font-bold text-shop-heading">
              {refunds.filter((r) => r.status === "pending").length}
            </p>
          )}
          <p className="text-[11px] text-shop-text">Refunds Pending</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Refund Requests</p>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <SkeletonRows count={2} />
          ) : refunds.length === 0 ? (
            <p className="py-3 text-center text-[12px] text-shop-text/60">No refund requests.</p>
          ) : (
            refunds.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-shop-heading">{r.orderRef}</p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {formatPrice(r.amount)}
                    {r.reason ? ` · ${r.reason}` : ""}
                  </p>
                </div>
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => decideRefund(r, true)}
                      aria-label="Approve refund"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => decideRefund(r, false)}
                      aria-label="Decline refund"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-shop-accent-3"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="rounded-full bg-shop-bg px-2.5 py-1 text-[10.5px] font-semibold capitalize text-shop-heading">
                    {r.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Failed Payments
        </p>
        <div className="flex flex-col gap-2">
          {failedPayments.length === 0 ? (
            <p className="py-3 text-center text-[12px] text-shop-text/60">
              No failed payments.
            </p>
          ) : (
            failedPayments.map((fp) => (
              <div
                key={fp.reference}
                className="flex items-center justify-between rounded-[14px] border border-amber-200 bg-amber-50 p-3.5"
              >
                <div>
                  <p className="text-[13px] font-medium text-shop-heading">{fp.reference}</p>
                  <p className="text-[11.5px] text-amber-800">
                    {new Date(fp.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span className="text-[13px] font-semibold text-shop-heading">
                  {formatPrice(fp.total)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Merchant Payouts</p>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <SkeletonRows count={2} />
          ) : payouts.length === 0 ? (
            <p className="py-3 text-center text-[12px] text-shop-text/60">No payouts yet.</p>
          ) : (
            payouts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-shop-heading">{p.merchant}</p>
                  <p className="text-[11px] text-shop-text/70">
                    {p.id} · {formatPrice(p.net)} net
                  </p>
                </div>
                {p.status === "PROCESSING" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => markPayout(p, "paid")}
                      className="rounded-[6px] bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Mark paid
                    </button>
                    <button
                      type="button"
                      onClick={() => markPayout(p, "failed")}
                      className="rounded-[6px] border border-shop-border px-2.5 py-1 text-[11px] font-semibold text-shop-heading"
                    >
                      Failed
                    </button>
                  </div>
                ) : (
                  <span className="text-[10.5px] font-medium capitalize text-shop-text/60">
                    {p.status.toLowerCase()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Partner Withdrawals</p>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <SkeletonRows count={2} />
          ) : withdrawals.length === 0 ? (
            <p className="py-3 text-center text-[12px] text-shop-text/60">No withdrawals yet.</p>
          ) : (
            withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-shop-heading">{w.partner}</p>
                  <p className="text-[11px] text-shop-text/70">
                    {w.id} · {formatPrice(w.amount)}
                  </p>
                </div>
                {w.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => markWithdrawal(w, "paid")}
                      className="rounded-[6px] bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Mark paid
                    </button>
                    <button
                      type="button"
                      onClick={() => markWithdrawal(w, "failed")}
                      className="rounded-[6px] border border-shop-border px-2.5 py-1 text-[11px] font-semibold text-shop-heading"
                    >
                      Failed
                    </button>
                  </div>
                ) : (
                  <span className="text-[10.5px] font-medium capitalize text-shop-text/60">
                    {w.status.toLowerCase()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
