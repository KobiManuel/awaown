"use client";

import React from "react";
import Link from "next/link";
import { Banknote, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminFinanceQuery } from "@/lib/api/adminApi";

const STATUS_TONE = {
  PROCESSING: "bg-amber-100 text-amber-700",
  PENDING: "bg-amber-100 text-amber-700",
  AWAITING_OTP: "bg-amber-100 text-amber-700",
};

function Row({ href, name, id, amountLabel, status, failureReason }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5 hover:border-shop-accent-1"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
          <Banknote className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-medium text-shop-heading">{name}</p>
          <p className="truncate text-[11px] text-shop-text/70">
            {id} · {amountLabel}
          </p>
          {failureReason && (
            <p className="mt-1 truncate text-[11px] text-shop-accent-3">{failureReason}</p>
          )}
        </div>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
          STATUS_TONE[status] || "bg-shop-bg text-shop-text"
        }`}
      >
        {status.toLowerCase().replace("_", " ")}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
    </Link>
  );
}

export default function AdminPayoutsQueuePage() {
  const { data, isLoading } = useGetAdminFinanceQuery();

  const payouts = (data?.payouts ?? []).filter(
    (p) => p.status === "PROCESSING" || p.status === "AWAITING_OTP",
  );
  const withdrawals = (data?.withdrawals ?? []).filter(
    (w) => w.status === "PENDING" || w.status === "AWAITING_OTP",
  );

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Payouts & Withdrawals" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Merchant payouts and partner withdrawals waiting to be sent, retried, or settled.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">
          Merchant Payouts {!isLoading && `(${payouts.length})`}
        </p>
        {isLoading ? (
          <SkeletonRows count={2} />
        ) : payouts.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-shop-text/60">
            Nothing to process.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {payouts.map((p) => (
              <Row
                key={p.id}
                href={`/admin/payouts/${p.id}`}
                name={p.merchant}
                id={p.id}
                amountLabel={`${formatPrice(p.net)} net`}
                status={p.status}
                failureReason={p.failureReason}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">
          Partner Withdrawals {!isLoading && `(${withdrawals.length})`}
        </p>
        {isLoading ? (
          <SkeletonRows count={2} />
        ) : withdrawals.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-shop-text/60">
            Nothing to process.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {withdrawals.map((w) => (
              <Row
                key={w.id}
                href={`/admin/withdrawals/${w.id}`}
                name={w.partner}
                id={w.id}
                amountLabel={formatPrice(w.amount)}
                status={w.status}
                failureReason={w.failureReason}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
