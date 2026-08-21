"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import { customersDirectory, formatPrice } from "@/lib/admin-data";
import { resolveComplaint } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function AdminCustomersPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const complaints = useSelector((s) => s.admin.complaints);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Customers" />

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Customer Profiles</p>
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          {customersDirectory.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-semibold text-shop-heading">{c.name}</p>
                <p className="text-[11.5px] text-shop-text/70">{c.email}</p>
                <p className="text-[11px] text-shop-text/60">{c.orders} orders · wallet {formatPrice(c.wallet)}</p>
              </div>
              <span className="text-[13px] font-semibold text-shop-heading">{formatPrice(c.totalSpend)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Complaints & Support History</p>
        <div className="flex flex-col gap-2">
          {complaints.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-medium text-shop-heading">{c.subject}</p>
                <p className="text-[11.5px] text-shop-text/70">{c.customer} · {c.order}</p>
              </div>
              {c.status === "open" ? (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(resolveComplaint(c.id));
                    showToast("Complaint marked resolved");
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Resolve
                </button>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700">
                  Resolved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
