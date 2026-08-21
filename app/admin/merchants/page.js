"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play, ChevronRight } from "lucide-react";
import { VERIFICATION_TONE } from "@/lib/admin-data";
import { setMerchantStatus, setMerchantVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function AdminMerchantsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const merchants = useSelector((s) => s.admin.merchants);

  const handleVerify = (merchant, verification) => {
    dispatch(setMerchantVerification({ id: merchant.id, verification }));
    if (merchant.id === "m-1") dispatch(adminSetVerificationStatus(verification));
    showToast(`${merchant.storeName} verification ${verification === "verified" ? "approved" : "rejected"}`);
  };

  const handleStatus = (merchant, status) => {
    dispatch(setMerchantStatus({ id: merchant.id, status }));
    showToast(`${merchant.storeName} ${status === "suspended" ? "suspended" : "reactivated"}`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Merchants" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, performance, payouts, products and account status.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8">
        {merchants.map((m) => (
          <div key={m.id} className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5">
            <Link href={`/admin/merchants/${m.id}`} className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-shop-heading">{m.storeName}</p>
                <p className="text-[11.5px] text-shop-text/70">{m.owner} · {m.products} products · ★ {m.rating}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                m.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
              }`}>
                {m.status}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
            </Link>
            <span className={`w-fit rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${VERIFICATION_TONE[m.verification]}`}>
              {m.verification}
            </span>
            <div className="flex flex-wrap gap-2 border-t border-shop-border pt-2.5">
              {m.verification !== "verified" && (
                <button
                  type="button"
                  onClick={() => handleVerify(m, "verified")}
                  className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approve Verification
                </button>
              )}
              {m.verification === "pending" && (
                <button
                  type="button"
                  onClick={() => handleVerify(m, "unverified")}
                  className="rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
                >
                  Reject
                </button>
              )}
              {m.status === "active" ? (
                <button
                  type="button"
                  onClick={() => handleStatus(m, "suspended")}
                  className="flex items-center gap-1.5 rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-3"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Suspend
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatus(m, "active")}
                  className="flex items-center gap-1.5 rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700"
                >
                  <Play className="h-3.5 w-3.5" />
                  Reactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
