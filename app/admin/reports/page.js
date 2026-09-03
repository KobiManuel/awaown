"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Trophy, Store, Users2, User } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminReportsQuery } from "@/lib/api/adminApi";

const PerformerCard = ({ icon: Icon, label, name, sub, value, valueLabel, href }) => (
  <Link
    href={href}
    className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-4 hover:border-shop-accent-1"
  >
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-shop-text/60">
      <Trophy className="h-3.5 w-3.5 text-amber-500" />
      {label}
    </span>
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
        <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-shop-heading">{name}</p>
        {sub && <p className="truncate text-[11.5px] text-shop-text/70">{sub}</p>}
      </div>
    </div>
    <div>
      <p className="text-[16px] font-bold text-shop-heading">{value}</p>
      <p className="text-[10.5px] text-shop-text/60">{valueLabel}</p>
    </div>
  </Link>
);

export default function AdminReportsPage() {
  const { data, isLoading } = useGetAdminReportsQuery();

  const t = data?.totals;
  const topMerchant = data?.topMerchants?.[0];
  const topPartner = data?.topPartners?.[0];
  const topCustomer = data?.topCustomers?.[0];
  // last 10 days for a compact table
  const recentDays = (data?.salesByDay ?? []).slice(-10).reverse();
  const maxRev = Math.max(1, ...recentDays.map((d) => d.revenue));

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Reports" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Sales, merchants, partners, customers, products and business performance.
      </p>

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-5 lg:px-8">
        {isLoading || !t ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-[14px]" />
          ))
        ) : (
          <>
            <Stat label="Revenue (30d)" value={formatPrice(t.revenue30d)} />
            <Stat label="Orders (30d)" value={t.orders30d} />
            <Stat label="Active Merchants" value={t.merchants} />
            <Stat label="Active Partners" value={t.partners} />
            <Stat label="Total Customers" value={t.customers} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Performers
        </p>
        <p className="text-[11px] text-shop-text/60">
          Good candidates for Merchant of the Week and other spotlight content.
        </p>
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {topMerchant && (
              <PerformerCard
                icon={Store}
                label="Top Merchant"
                name={topMerchant.name}
                sub={topMerchant.rating ? `★ ${topMerchant.rating}` : undefined}
                value={formatPrice(topMerchant.value)}
                valueLabel="wallet earnings"
                href="/admin/merchants"
              />
            )}
            {topPartner && (
              <PerformerCard
                icon={Users2}
                label="Top Partner"
                name={topPartner.name}
                value={formatPrice(topPartner.value)}
                valueLabel="wallet balance"
                href="/admin/partners"
              />
            )}
            {topCustomer && (
              <PerformerCard
                icon={User}
                label="Top Customer"
                name={topCustomer.name}
                value={formatPrice(topCustomer.value)}
                valueLabel="total spend"
                href="/admin/customers"
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <BarChart3 className="h-4 w-4 text-shop-accent-1" />
          Sales — last 10 days
        </p>
        {isLoading ? (
          <SkeletonRows count={5} />
        ) : (
          <div className="flex flex-col gap-1.5">
            {recentDays.map((row) => (
              <div
                key={row.date}
                className="flex items-center gap-3 rounded-[12px] border border-shop-border bg-white p-3"
              >
                <p className="w-16 shrink-0 text-[11.5px] text-shop-text/70">
                  {new Date(row.date).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-shop-bg">
                  <div
                    className="h-full rounded-full bg-shop-accent-1"
                    style={{ width: `${(row.revenue / maxRev) * 100}%` }}
                  />
                </div>
                <p className="w-24 shrink-0 text-right text-[12px] font-semibold text-shop-heading">
                  {formatPrice(row.revenue)}
                </p>
                <p className="w-12 shrink-0 text-right text-[11px] text-shop-text/60">
                  {row.orders}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-[14px] border border-shop-border bg-white p-4">
    <p className="text-[15px] font-bold text-shop-heading">{value}</p>
    <p className="text-[11.5px] text-shop-text">{label}</p>
  </div>
);
