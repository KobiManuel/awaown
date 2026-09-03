"use client";

import React from "react";
import Link from "next/link";
import { LifeBuoy, ChevronRight } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAdminComplaintsQuery } from "@/lib/api/adminApi";

export default function AdminSupportPage() {
  const { data, isLoading } = useGetAdminComplaintsQuery();
  const items = data?.items ?? [];
  const open = items.filter((c) => c.status !== "resolved");
  const resolved = items.filter((c) => c.status === "resolved");

  const Row = (c) => (
    <Link
      key={c.id}
      href={`/admin/support/${c.id}`}
      className="flex items-center gap-3 rounded-[12px] border border-shop-border bg-white p-3.5"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-shop-heading">
          {c.subject}
          {c.unread && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-shop-accent-3" />
          )}
        </p>
        <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
          {c.customer}
          {c.orderRef ? ` · ${c.orderRef}` : ""} — {c.lastMessage}
        </p>
      </div>
      <span className="shrink-0 text-[10.5px] text-shop-text/50">
        {new Date(c.lastMessageAt).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
        })}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
    </Link>
  );

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1000px]">
      <AppHeader title="Support" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Customer support conversations. A red dot means the customer is waiting on a reply.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={5} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <LifeBuoy className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-shop-heading">No conversations yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-shop-heading">
              Open ({open.length})
            </p>
            {open.length === 0 ? (
              <p className="py-3 text-center text-[12px] text-shop-text/60">
                Nothing open.
              </p>
            ) : (
              open.map(Row)
            )}
          </div>
          {resolved.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-shop-heading">
                Resolved ({resolved.length})
              </p>
              {resolved.map(Row)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
