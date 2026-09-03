"use client";

import React from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import { statusMeta } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminOrdersQuery } from "@/lib/api/adminApi";

export default function AdminOrdersPage() {
  const { data, isLoading } = useGetAdminOrdersQuery();
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Orders" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Complete order lifecycle: payment status, escrow, delivery and refunds.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={5} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-shop-heading">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {items.map((o) => {
            const meta = statusMeta(o.status);
            return (
              <Link
                key={o.id}
                href={`/admin/orders/${o.reference}`}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5 hover:border-shop-accent-1"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-shop-heading">{o.reference}</p>
                  <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                    {o.customer} · {o.items.map((i) => `${i.title} ×${i.qty}`).join(", ")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.tone}`}
                >
                  {meta.label}
                </span>
                <span className="shrink-0 text-[13px] font-semibold text-shop-heading">
                  {formatPrice(o.total)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
