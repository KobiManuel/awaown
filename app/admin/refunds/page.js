"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminFinanceQuery } from "@/lib/api/adminApi";

export default function AdminRefundsQueuePage() {
  const { data, isLoading } = useGetAdminFinanceQuery();
  const refunds = (data?.refunds ?? []).filter((r) => r.status === "pending");

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Refunds to Decide" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Customer refund requests waiting on a decision. Each opens the order itself, where you
        can approve or decline.
      </p>

      <div className="flex flex-col gap-2 px-4 lg:px-8">
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : refunds.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-shop-text">
            No refunds pending.
          </p>
        ) : (
          refunds.map((r) => (
            <Link
              key={r.id}
              href={`/admin/orders/${r.orderRef}`}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5 hover:border-shop-accent-1"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-shop-heading">
                    {r.orderRef}
                  </p>
                  <p className="truncate text-[11px] text-shop-text/70">
                    {formatPrice(r.amount)}
                    {r.reason ? ` · ${r.reason}` : ""}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
