"use client";

import React from "react";
import { useSelector } from "react-redux";
import { History } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function AdminAuditLogPage() {
  const auditLog = useSelector((s) => s.admin.auditLog);

  return (
    <div className="flex flex-col gap-4 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Audit Log" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-0">
        A complete record of administrative actions for accountability and troubleshooting.
      </p>

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        {auditLog.map((log) => (
          <div key={log.id} className="flex items-start gap-3 rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-shop-bg">
              <History className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[12.5px] text-shop-heading">{log.action}</p>
              <p className="text-[11px] text-shop-text/60">
                {log.admin} ·{" "}
                {new Date(log.at).toLocaleString("en-NG", {
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
    </div>
  );
}
