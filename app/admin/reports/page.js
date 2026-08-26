"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { salesReportSeed, businessOverview, formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Reports" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Sales, merchants, partners, customers, products and business performance.
      </p>

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
