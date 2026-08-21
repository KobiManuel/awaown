"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play, Store, TrendingUp } from "lucide-react";
import { VERIFICATION_TONE, formatPrice } from "@/lib/admin-data";
import { setPartnerStatus, setPartnerVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const Stat = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-[12px] border border-shop-border bg-white p-3.5">
    <p className="text-[15px] font-bold text-shop-heading">{value}</p>
    <p className="text-[11px] text-shop-text/70">{label}</p>
  </div>
);

export default function AdminPartnerDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const showToast = useToast();
  const partner = useSelector((s) => s.admin.partners.find((p) => p.id === id));

  const isLive = id === "p-1";
  const walletBalance = useSelector((s) => s.partner.walletBalance);
  const earnings = useSelector((s) => s.partner.earnings);
  const withdrawals = useSelector((s) => s.partner.withdrawals);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const ownProducts = useSelector((s) => s.partner.ownProducts);

  if (!partner) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Partner" backHref="/admin/partners" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This partner couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const handleVerify = (verification) => {
    dispatch(setPartnerVerification({ id: partner.id, verification }));
    if (isLive) dispatch(adminSetVerificationStatus(verification));
    showToast(`${partner.name} verification ${verification === "verified" ? "approved" : "rejected"}`);
  };

  const handleStatus = (status) => {
    dispatch(setPartnerStatus({ id: partner.id, status }));
    showToast(`${partner.name} ${status === "suspended" ? "suspended" : "reactivated"}`);
  };

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title={partner.name} backHref="/admin/partners" showBackOnDesktop />

      <div className="mx-4 flex items-center gap-4 lg:mx-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[18px] font-semibold text-white">
          {partner.name.charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{partner.name}</p>
          <p className="text-[12.5px] text-shop-text">{partner.storeName}</p>
          <p className="text-[11px] text-shop-text/60">
            Joined {new Date(partner.joinedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mx-4 flex flex-wrap gap-2 lg:mx-8">
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${
            partner.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
          }`}
        >
          {partner.status}
        </span>
        <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${VERIFICATION_TONE[partner.verification]}`}>
          {partner.verification}
        </span>
      </div>

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8 lg:grid-cols-4">
        <Stat label="Referrals" value={partner.referrals} />
        <Stat label="Net Profit" value={formatPrice(partner.netProfit)} />
        {isLive ? (
          <>
            <Stat label="Wallet Balance" value={formatPrice(walletBalance)} />
            <Stat label="Store Items" value={storeProductIds.length + ownProducts.length} />
          </>
        ) : (
          <p className="col-span-2 flex items-center rounded-[12px] bg-shop-bg p-3.5 text-[11px] text-shop-text/60">
            Wallet and store detail isn&apos;t available for this demo partner.
          </p>
        )}
      </div>

      <div className="mx-4 flex flex-wrap gap-2 border-t border-shop-border pt-4 lg:mx-8">
        {partner.verification !== "verified" && (
          <button
            type="button"
            onClick={() => handleVerify("verified")}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white"
          >
            <BadgeCheck className="h-4 w-4" />
            Approve Verification
          </button>
        )}
        {partner.verification === "pending" && (
          <button
            type="button"
            onClick={() => handleVerify("unverified")}
            className="rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-shop-heading"
          >
            Reject
          </button>
        )}
        {partner.status === "active" ? (
          <button
            type="button"
            onClick={() => handleStatus("suspended")}
            className="flex items-center gap-1.5 rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-shop-accent-3"
          >
            <Ban className="h-4 w-4" />
            Suspend
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleStatus("active")}
            className="flex items-center gap-1.5 rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-emerald-700"
          >
            <Play className="h-4 w-4" />
            Reactivate
          </button>
        )}
      </div>

      {isLive && (
        <>
          <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              <TrendingUp className="h-4 w-4 text-shop-accent-1" />
              Recent Earnings
            </p>
            <div className="flex flex-col gap-2">
              {earnings.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3">
                  <div>
                    <p className="text-[12.5px] font-medium text-shop-heading">{e.product}</p>
                    <p className="text-[11px] text-shop-text/60 capitalize">{e.status}</p>
                  </div>
                  <span className="text-[12.5px] font-semibold text-emerald-600">{formatPrice(e.netProfit)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              <Store className="h-4 w-4 text-shop-accent-1" />
              Withdrawals
            </p>
            {withdrawals.length === 0 ? (
              <p className="rounded-[12px] bg-shop-bg p-3.5 text-[11.5px] text-shop-text/60">
                No withdrawals requested yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {withdrawals.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3">
                    <div>
                      <p className="text-[12.5px] font-medium text-shop-heading">{w.id}</p>
                      <p className="text-[11px] text-shop-text/60 capitalize">{w.status}</p>
                    </div>
                    <span className="text-[12.5px] font-semibold text-shop-heading">{formatPrice(w.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
