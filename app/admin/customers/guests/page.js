"use client";

import React, { useState } from "react";
import { Search, Download, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useAdminExport } from "@/lib/useAdminExport";
import { useGetAdminGuestCustomersQuery } from "@/lib/api/adminApi";

export default function AdminGuestCustomersPage() {
  const showToast = useToast();
  const { data, isLoading } = useGetAdminGuestCustomersQuery();
  const [q, setQ] = useState("");
  const { download: exportCsv, isLoading: exporting } = useAdminExport(
    "/admin/customers/guests/export",
    "awaown-guest-customers",
  );
  const handleExport = async () => {
    const ok = await exportCsv();
    showToast(ok ? "Guests exported" : "Couldn't export guests");
  };

  const allGuests = data?.items ?? [];
  const guests = allGuests.filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q.toLowerCase()) ||
      g.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Guests"
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
        People who checked out without an AwaOwn account (partner-store or main-site
        guest checkout) whose order actually went through. An attempt that was
        abandoned or auto-cancelled before payment doesn&rsquo;t appear here.
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
          <p className="text-[13px] font-semibold text-shop-heading">Guest Checkouts</p>
          <p className="text-[12px] font-medium text-shop-text/60">
            {q ? `${guests.length} of ${allGuests.length}` : `${allGuests.length} total`}
          </p>
        </div>
        {isLoading ? (
          <SkeletonRows count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            {guests.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
                    {g.name}
                    <span
                      className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10px] font-semibold text-shop-accent-1"
                      title="No AwaOwn account"
                    >
                      Guest{g.guestStoreName ? ` · ${g.guestStoreName}` : ""}
                    </span>
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">{g.email}</p>
                  {g.phone && (
                    <p className="text-[11.5px] text-shop-text/70">{g.phone}</p>
                  )}
                  {g.address && (
                    <p className="line-clamp-1 text-[11px] text-shop-text/60">{g.address}</p>
                  )}
                  <p className="text-[11px] text-shop-text/60">{g.orders} orders</p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-shop-heading">
                  {formatPrice(g.totalSpend)}
                </span>
              </div>
            ))}
            {guests.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <ShoppingBag className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
                <p className="text-[13px] font-semibold text-shop-heading">No guests found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
