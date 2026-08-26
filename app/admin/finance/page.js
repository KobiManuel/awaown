"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Banknote, AlertTriangle, Check, X } from "lucide-react";
import { businessOverview, failedPaymentsSeed, formatPrice } from "@/lib/admin-data";
import { setRefundStatus } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function AdminFinancePage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const escrowBalance = useSelector((s) => s.merchant.escrowBalance);
  const refunds = useSelector((s) => s.admin.refunds);
  const merchantPayouts = useSelector((s) => s.merchant.payouts);
  const partnerWithdrawals = useSelector((s) => s.partner.withdrawals);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Finance" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Escrow, payouts, profit share, refunds and revenue reports.
      </p>

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-2 rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white">
          <Wallet className="h-4.5 w-4.5" strokeWidth={1.75} />
          <p className="text-[15px] font-bold">{formatPrice(escrowBalance)}</p>
          <p className="text-[11px] text-white/75">Total Escrow Balance</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
          <Banknote className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
          <p className="text-[15px] font-bold text-shop-heading">{formatPrice(businessOverview.revenueToday)}</p>
          <p className="text-[11px] text-shop-text">Revenue Today</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Refund Requests</p>
        <div className="flex flex-col gap-2">
          {refunds.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-medium text-shop-heading">{r.order}</p>
                <p className="text-[11.5px] text-shop-text/70">{r.customer} · {formatPrice(r.amount)}</p>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setRefundStatus({ id: r.id, status: "approved" }));
                      showToast(`Refund for ${r.order} approved`);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setRefundStatus({ id: r.id, status: "rejected" }));
                      showToast(`Refund for ${r.order} rejected`);
                    }}
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
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Failed Payments
        </p>
        <div className="flex flex-col gap-2">
          {failedPaymentsSeed.map((fp) => (
            <div key={fp.id} className="flex items-center justify-between rounded-[14px] border border-amber-200 bg-amber-50 p-3.5">
              <div>
                <p className="text-[13px] font-medium text-shop-heading">{fp.order}</p>
                <p className="text-[11.5px] text-amber-800">{fp.customer} · {fp.reason}</p>
              </div>
              <span className="text-[13px] font-semibold text-shop-heading">{formatPrice(fp.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Payout & Withdrawal Queue</p>
        <div className="flex flex-col gap-2">
          {merchantPayouts.filter((p) => p.status === "processing").map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[12.5px] text-shop-heading">Merchant payout {p.id}</p>
              <span className="text-[13px] font-semibold text-shop-heading">{formatPrice(p.net)}</span>
            </div>
          ))}
          {partnerWithdrawals.filter((w) => w.status === "pending").map((w) => (
            <div key={w.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[12.5px] text-shop-heading">Partner withdrawal {w.id}</p>
              <span className="text-[13px] font-semibold text-shop-heading">{formatPrice(w.amount)}</span>
            </div>
          ))}
          {merchantPayouts.filter((p) => p.status === "processing").length === 0 &&
            partnerWithdrawals.filter((w) => w.status === "pending").length === 0 && (
              <p className="py-4 text-center text-[12.5px] text-shop-text">Nothing pending right now.</p>
            )}
        </div>
      </div>
    </div>
  );
}
