"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminFinanceQuery } from "@/lib/api/adminApi";

export default function AdminFailedPaymentsPage() {
  const { data, isLoading } = useGetAdminFinanceQuery();
  const failedPayments = data?.failedPayments ?? [];

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Failed Payments" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Orders whose payment never went through. Each opens the order itself.
      </p>

      <div className="flex flex-col gap-2 px-4 lg:px-8">
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : failedPayments.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-shop-text">
            No failed payments.
          </p>
        ) : (
          failedPayments.map((fp) => (
            <Link
              key={fp.reference}
              href={`/admin/orders/${fp.reference}`}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-amber-200 bg-amber-50 p-3.5 hover:border-amber-400"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <CreditCard className="h-4 w-4 text-amber-700" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-shop-heading">
                    {fp.reference}
                  </p>
                  <p className="truncate text-[11.5px] text-amber-800">
                    {new Date(fp.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[13px] font-semibold text-shop-heading">
                {formatPrice(fp.total)}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
