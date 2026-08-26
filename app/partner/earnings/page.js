"use client";

import React from "react";
import { useSelector } from "react-redux";
import { TrendingUp, Clock } from "lucide-react";
import { formatPrice, EARNING_STATUS_LABEL, EARNING_STATUS_TONE } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function PartnerEarningsPage() {
  const earnings = useSelector((s) => s.partner.earnings);
  const cleared = earnings.filter((e) => e.status === "cleared").reduce((sum, e) => sum + e.netProfit, 0);
  const inEscrow = earnings.filter((e) => e.status === "escrow").reduce((sum, e) => sum + e.netProfit, 0);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Earnings History" backHref="/partner" />

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8">
        <div className="flex items-center gap-3 rounded-[14px] bg-shop-bg p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
            <TrendingUp className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-shop-heading">{formatPrice(cleared)}</p>
            <p className="text-[11px] text-shop-text">Cleared (net)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[14px] bg-shop-bg p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-5 w-5 text-amber-700" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-shop-heading">{formatPrice(inEscrow)}</p>
            <p className="text-[11px] text-shop-text">In Escrow (net)</p>
          </div>
        </div>
      </div>

      {earnings.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          No earnings yet — share a product link to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {earnings.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-shop-heading">{e.product}</p>
                  <p className="text-[11.5px] text-shop-text/70">
                    Sale: {formatPrice(e.saleAmount)} ·{" "}
                    {new Date(e.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${EARNING_STATUS_TONE[e.status]}`}
                >
                  {EARNING_STATUS_LABEL[e.status]}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[11.5px] text-shop-text">
                <span>
                  Gross profit {formatPrice(e.grossProfit)} · Platform fee (20%) -
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
