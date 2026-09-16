"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminCustomersQuery,
  useGetAdminComplaintsQuery,
} from "@/lib/api/adminApi";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "registered", label: "Registered" },
  { id: "guest", label: "Partner Store Guests" },
];

export default function AdminCustomersPage() {
  const { data, isLoading } = useGetAdminCustomersQuery();
  const { data: complaintsData } = useGetAdminComplaintsQuery();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const allCustomers = data?.items ?? [];
  const byFilter =
    filter === "all"
      ? allCustomers
      : allCustomers.filter((c) => (filter === "guest" ? c.isGuest : !c.isGuest));
  const customers = byFilter.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()),
  );
  const guestCount = allCustomers.filter((c) => c.isGuest).length;
  const complaints = (complaintsData?.items ?? []).slice(0, 6);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Customers" backHref="/admin" />

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
          <p className="text-[13px] font-semibold text-shop-heading">Customer Profiles</p>
          <p className="text-[12px] font-medium text-shop-text/60">
            {q ? `${customers.length} of ${byFilter.length}` : `${byFilter.length} total`}
          </p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                filter === f.id
                  ? "bg-shop-accent-1 text-white"
                  : "bg-shop-bg text-shop-text hover:bg-shop-border"
              }`}
            >
              {f.label}
              {f.id === "guest" && guestCount > 0 ? ` (${guestCount})` : ""}
            </button>
          ))}
        </div>
        {isLoading ? (
          <SkeletonRows count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            {customers.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
                    {c.name}
                    {c.isGuest && (
                      <span
                        className="shrink-0 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10px] font-semibold text-shop-accent-1"
                        title="No AwaOwn account - checked out as a guest through a partner store"
                      >
                        Guest{c.guestStoreName ? ` · ${c.guestStoreName}` : ""}
                      </span>
                    )}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">{c.email}</p>
                  {c.phone && (
                    <p className="text-[11.5px] text-shop-text/70">{c.phone}</p>
                  )}
                  {c.isGuest && c.address && (
                    <p className="line-clamp-1 text-[11px] text-shop-text/60">{c.address}</p>
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
            {customers.length === 0 && (
              <p className="py-6 text-center text-[12.5px] text-shop-text/60">
                No customers found.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-shop-heading">
            Complaints &amp; Support
          </p>
          <Link
            href="/admin/support"
            className="text-[12px] font-semibold text-shop-accent-1"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {complaints.length === 0 ? (
            <p className="py-4 text-center text-[12.5px] text-shop-text/60">
              No complaints logged.
            </p>
          ) : (
            complaints.map((c) => (
              <Link
                key={c.id}
                href={`/admin/support/${c.id}`}
                className="flex items-center gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-shop-heading">
                    {c.subject}
                    {c.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-shop-accent-3" />
                    )}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {c.customer}
                    {c.orderRef ? ` · ${c.orderRef}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                    c.status === "resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.status}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
