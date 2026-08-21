"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play } from "lucide-react";
import { VERIFICATION_TONE, formatPrice } from "@/lib/admin-data";
import { setPartnerStatus, setPartnerVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function AdminPartnersPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const partners = useSelector((s) => s.admin.partners);

  const handleVerify = (partner, verification) => {
    dispatch(setPartnerVerification({ id: partner.id, verification }));
    if (partner.id === "p-1") dispatch(adminSetVerificationStatus(verification));
    showToast(`${partner.name} verification ${verification === "verified" ? "approved" : "rejected"}`);
  };

  const handleStatus = (partner, status) => {
    dispatch(setPartnerStatus({ id: partner.id, status }));
    showToast(`${partner.name} ${status === "suspended" ? "suspended" : "reactivated"}`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Partners" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Onboarding, verification, profit, withdrawals, referrals and performance.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8">
        {partners.map((p) => (
          <div key={p.id} className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-shop-heading">{p.name}</p>
                <p className="text-[11.5px] text-shop-text/70">
                  {p.storeName} · {p.referrals} referrals · {formatPrice(p.netProfit)} net profit
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${
                p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
              }`}>
                {p.status}
              </span>
            </div>
            <span className={`w-fit rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${VERIFICATION_TONE[p.verification]}`}>
              {p.verification}
            </span>
            <div className="flex flex-wrap gap-2 border-t border-shop-border pt-2.5">
              {p.verification !== "verified" && (
                <button
                  type="button"
                  onClick={() => handleVerify(p, "verified")}
                  className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approve Verification
                </button>
              )}
              {p.verification === "pending" && (
                <button
                  type="button"
                  onClick={() => handleVerify(p, "unverified")}
                  className="rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
                >
                  Reject
                </button>
              )}
              {p.status === "active" ? (
                <button
                  type="button"
                  onClick={() => handleStatus(p, "suspended")}
                  className="flex items-center gap-1.5 rounded-full border border-shop-border px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-3"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Suspend
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatus(p, "active")}
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
