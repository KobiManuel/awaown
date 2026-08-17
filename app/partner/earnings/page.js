"use client";

import React from "react";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

const STATUS_TONE = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
};

export default function PartnerEarningsPage() {
  const earnings = useSelector((s) => s.partner.earnings);
  const totalProfit = earnings.reduce((sum, e) => sum + e.profit, 0);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Earnings History" />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-4 lg:mx-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-accent-1-light">
          <TrendingUp className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">
            {formatPrice(totalProfit)}
          </p>
          <p className="text-[12px] text-shop-text">Total profit from {earnings.length} sales</p>
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
              className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
            >
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
              <div className="text-right">
                <p className="text-[13px] font-semibold text-emerald-600">
                  +{formatPrice(e.profit)}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_TONE[e.status]}`}
                >
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
