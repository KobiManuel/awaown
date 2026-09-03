"use client";

import React from "react";
import { History } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useGetAuditLogQuery } from "@/lib/api/adminApi";

export default function AdminAuditLogPage() {
  const { data, isLoading } = useGetAuditLogQuery();
  const rows = data ?? [];

  return (
    <div className="flex flex-col gap-4 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Audit Log" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        A complete record of administrative actions for accountability and troubleshooting.
      </p>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={8} />
        </div>
      ) : rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          No admin actions recorded yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-shop-bg">
                <History className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] capitalize text-shop-heading">
                  {r.action.replace(/^admin\./, "").replace(/[._]/g, " ")}
                </p>
                <p className="text-[11px] text-shop-text/60">
                  {new Date(r.createdAt).toLocaleString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
