"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { BarChart3, Trophy, Store, Users2, User } from "lucide-react";
import { salesReportSeed, businessOverview, customersDirectory, formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

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
        <p className="truncate text-[11.5px] text-shop-text/70">{sub}</p>
      </div>
    </div>
    <div>
      <p className="text-[16px] font-bold text-shop-heading">{value}</p>
      <p className="text-[10.5px] text-shop-text/60">{valueLabel}</p>
    </div>
  </Link>
);

export default function AdminReportsPage() {
  const merchants = useSelector((s) => s.admin.merchants);
  const partners = useSelector((s) => s.admin.partners);

  const topMerchant = useMemo(
    () => [...merchants].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0],
    [merchants],
  );
  const topPartner = useMemo(
    () => [...partners].sort((a, b) => (b.netProfit || 0) - (a.netProfit || 0))[0],
    [partners],
  );
  const topCustomer = useMemo(
    () => [...customersDirectory].sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))[0],
    [],
  );

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Reports" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Sales, merchants, partners, customers, products and business performance.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Performers
        </p>
        <p className="text-[11px] text-shop-text/60">
          Good candidates for Merchant of the Week/Month and other spotlight content.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topMerchant && (
            <PerformerCard
              icon={Store}
              label="Top Merchant"
              name={topMerchant.storeName}
              sub={topMerchant.owner}
              value={formatPrice(topMerchant.revenue || 0)}
              valueLabel="total revenue"
              href={`/admin/merchants/${topMerchant.id}`}
            />
          )}
          {topPartner && (
            <PerformerCard
              icon={Users2}
              label="Top Partner"
              name={topPartner.name}
              sub={topPartner.storeName}
              value={formatPrice(topPartner.netProfit || 0)}
              valueLabel="net profit earned"
              href={`/admin/partners/${topPartner.id}`}
            />
          )}
          {topCustomer && (
            <PerformerCard
              icon={User}
              label="Top Customer"
              name={topCustomer.name}
              sub={topCustomer.email}
              value={formatPrice(topCustomer.totalSpend || 0)}
              valueLabel="total spend"
              href="/admin/customers"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <BarChart3 className="h-4 w-4 text-shop-accent-1" />
          Sales Report
        </p>
        <div className="flex flex-col gap-2">
          {salesReportSeed.map((row) => (
            <div key={row.period} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[13px] font-medium text-shop-heading">{row.period}</p>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-shop-heading">{formatPrice(row.revenue)}</p>
                <p className="text-[11px] text-shop-text/60">{row.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-4 lg:grid-cols-3 lg:px-8">
        <div className="rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[15px] font-bold text-shop-heading">{businessOverview.merchants}</p>
          <p className="text-[11.5px] text-shop-text">Active Merchants</p>
        </div>
        <div className="rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[15px] font-bold text-shop-heading">{businessOverview.partners}</p>
          <p className="text-[11.5px] text-shop-text">Active Partners</p>
        </div>
        <div className="rounded-[14px] border border-shop-border bg-white p-4">
          <p className="text-[15px] font-bold text-shop-heading">{businessOverview.customers.toLocaleString()}</p>
          <p className="text-[11.5px] text-shop-text">Total Customers</p>
        </div>
      </div>
    </div>
  );
}
