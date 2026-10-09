"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import { statusMeta } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminOrdersQuery } from "@/lib/api/adminApi";

const FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
];

function AdminOrdersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") === "PENDING" ? "PENDING" : "";

  const { data, isLoading } = useGetAdminOrdersQuery(status || undefined);
  const items = data?.items ?? [];

  const setFilter = (value) => {
    router.replace(value ? `/admin/orders?status=${value}` : "/admin/orders");
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Orders" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Complete order lifecycle: payment status, escrow, delivery and refunds.
      </p>

      <div className="flex gap-2 px-4 lg:px-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
              status === f.value
                ? "bg-shop-accent-1 text-white"
                : "bg-shop-bg text-shop-text hover:bg-shop-accent-1-light"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={5} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-shop-heading">
            {status === "PENDING" ? "No pending orders" : "No orders yet"}
          </p>
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

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrdersInner />
    </Suspense>
  );
}
