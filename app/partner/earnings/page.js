"use client";

import React from "react";
import Image from "next/image";
import { TrendingUp, Clock, Package } from "lucide-react";
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
  const orders = data?.orders ?? [];

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
      ) : orders.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          No earnings yet — share a product link to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 px-4 lg:px-8">
          {orders.map((o) => (
            <div
              key={o.orderRef ?? o.products[0]?.id}
              className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  {o.orderRef && (
                    <p className="text-[13px] font-semibold text-shop-heading">
                      Order {o.orderRef}
                    </p>
                  )}
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(o.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {o.products.length > 1 && ` · ${o.products.length} products`}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TONE[o.status]}`}
                >
                  {LABEL[o.status]}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {o.products.map((e) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                      {e.image ? (
                        <Image
                          src={e.image}
                          alt={e.product}
                          fill
                          className="object-contain p-1"
                          sizes="44px"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-shop-text/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
                        {e.product}
                      </p>
                      <p className="text-[11px] text-shop-text/60">
                        {e.variantLabel ? `${e.variantLabel} · ` : ""}Qty {e.qty} ·
                        gross {formatPrice(e.grossProfit)} − fee{" "}
                        {formatPrice(e.platformFee)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12.5px] font-semibold text-emerald-600">
                      +{formatPrice(e.netProfit)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[12px]">
                <span className="text-shop-text/70">Your net from this order</span>
                <span className="font-semibold text-emerald-600">
                  +{formatPrice(o.netProfit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
