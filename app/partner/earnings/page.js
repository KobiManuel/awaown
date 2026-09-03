"use client";

import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows, Skeleton } from "@/components/ui/skeleton";
import { useGetPartnerEarningsQuery } from "@/lib/api/partnerApi";

const TONE = {
  ESCROW: "bg-amber-100 text-amber-700",
  CLEARED: "bg-emerald-100 text-emerald-700",
  REVERSED: "bg-red-50 text-shop-accent-3",
};
const LABEL = { ESCROW: "In Escrow", CLEARED: "Cleared", REVERSED: "Reversed" };

export default function PartnerEarningsPage() {
  const { data, isLoading, isError } = useGetPartnerEarningsQuery();
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Earnings History" backHref="/partner" />

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8">
        <div className="flex items-center gap-3 rounded-[14px] bg-shop-bg p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
            <TrendingUp
              className="h-5 w-5 text-shop-accent-1"
              strokeWidth={1.75}
            />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-[15px] font-semibold text-shop-heading">
                {formatPrice(data?.cleared ?? 0)}
              </p>
            )}
            <p className="text-[11px] text-shop-text">Cleared (net)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[14px] bg-shop-bg p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-5 w-5 text-amber-700" strokeWidth={1.75} />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-[15px] font-semibold text-shop-heading">
                {formatPrice(data?.pending ?? 0)}
              </p>
            )}
            <p className="text-[11px] text-shop-text">In Escrow (net)</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load your earnings.
        </p>
      ) : items.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          No earnings yet — share a product link to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {items.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-shop-heading">
                    {e.product}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(e.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TONE[e.status]}`}
                >
                  {LABEL[e.status]}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[11.5px] text-shop-text">
                <span>
                  Gross {formatPrice(e.grossProfit)} · Platform fee (20%) −
                  {formatPrice(e.platformFee)}
                </span>
                <span className="text-right">
                  <span className="block font-semibold text-emerald-600">
                    +{formatPrice(e.netProfit)}
                  </span>
                  <span className="block text-[9.5px] uppercase tracking-wide text-shop-text/50">
                    Net
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
