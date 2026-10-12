"use client";

import React, { useState } from "react";
import { Search, Download, Loader2, UserCheck } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useAdminExport } from "@/lib/useAdminExport";
import { useGetAdminPurchasingCustomersQuery } from "@/lib/api/adminApi";

export default function AdminPurchasingCustomersPage() {
  const showToast = useToast();
  const { data, isLoading } = useGetAdminPurchasingCustomersQuery();
  const [q, setQ] = useState("");
  const { download: exportCsv, isLoading: exporting } = useAdminExport(
    "/admin/customers/purchasers/export",
    "awaown-purchasing-customers",
  );
  const handleExport = async () => {
    const ok = await exportCsv();
    showToast(ok ? "Purchasers exported" : "Couldn't export purchasers");
  };

  const allPurchasers = data?.items ?? [];
  const purchasers = allPurchasers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Purchasers"
        backHref="/admin/customers"
        right={
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1 disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Export CSV
          </button>
        }
      />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Registered customer accounts that have actually completed a purchase - a
        subset of Customers.
      </p>

      <div className="mx-4 flex items-center gap-2 rounded-full bg-shop-bg px-4 py-2.5 lg:mx-8">
        <Search className="h-4 w-4 text-shop-text/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-shop-text/50"
        />
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-shop-heading">Purchasing Customers</p>
          <p className="text-[12px] font-medium text-shop-text/60">
            {q ? `${purchasers.length} of ${allPurchasers.length}` : `${allPurchasers.length} total`}
          </p>
        </div>
        {isLoading ? (
          <SkeletonRows count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            {purchasers.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
                    {c.name}
                    {c.isLegacy && (
                      <span
                        className="shrink-0 rounded-full bg-shop-bg px-2 py-0.5 text-[10px] font-semibold text-shop-text/70"
                        title="Migrated from the old WordPress/Dokan site"
                      >
                        Legacy
                      </span>
                    )}
                    {c.alsoPartner && (
                      <span
                        className="shrink-0 rounded-full bg-shop-bg px-2 py-0.5 text-[10px] font-semibold text-shop-text/70"
                        title="Also has a Partner account under this email"
                      >
                        Also Partner
                      </span>
                    )}
                    {c.alsoMerchant && (
                      <span
                        className="shrink-0 rounded-full bg-shop-bg px-2 py-0.5 text-[10px] font-semibold text-shop-text/70"
                        title="Also has a Merchant account under this email"
                      >
                        Also Merchant
                      </span>
                    )}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">{c.email}</p>
                  {c.phone && (
                    <p className="text-[11.5px] text-shop-text/70">{c.phone}</p>
                  )}
                  <p className="text-[11px] text-shop-text/60">
                    {c.orders} orders · wallet {formatPrice(c.walletBalance)}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-shop-heading">
                  {formatPrice(c.totalSpend)}
                </span>
              </div>
            ))}
            {purchasers.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <UserCheck className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
                <p className="text-[13px] font-semibold text-shop-heading">No purchasers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
