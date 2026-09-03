"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Store, TrendingUp, IdCard } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminPartnerQuery } from "@/lib/api/adminApi";
import ModerationActions from "@/app/Components/Admin/ModerationActions";

const VERIFICATION_TONE = {
  VERIFIED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-50 text-shop-accent-3",
  UNVERIFIED: "bg-shop-bg text-shop-text",
};

const DocSlot = ({ label, image }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold text-shop-text/60">{label}</span>
    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg">
      {image ? (
        <Image src={image} alt={label} fill className="object-cover" sizes="200px" />
      ) : (
        <span className="text-[11px] text-shop-text/40">Not submitted</span>
      )}
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-[12px] border border-shop-border bg-white p-3.5">
    <p className="text-[15px] font-bold text-shop-heading">{value}</p>
    <p className="text-[11px] text-shop-text/70">{label}</p>
  </div>
);

export default function AdminPartnerDetailPage() {
  const { id } = useParams();
  const { data: p, isLoading, isError } = useGetAdminPartnerQuery(id);

  if (isLoading)
    return (
      <div className="p-4 lg:p-8">
        <Skeleton className="h-64 w-full rounded-[14px]" />
      </div>
    );
  if (isError || !p)
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Partner" backHref="/admin/partners" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This partner couldn&apos;t be found.
        </p>
      </div>
    );

  const v = p.verification;
  const verificationStatus = v?.status ?? "UNVERIFIED";

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title={p.displayName} backHref="/admin/partners" showBackOnDesktop />

      <div className="mx-4 flex items-center gap-4 lg:mx-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[18px] font-semibold text-white">
          {p.displayName.charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{p.displayName}</p>
          <p className="text-[12.5px] text-shop-text">
            {p.storeName ? `${p.storeName} · ` : ""}
            {p.user.fullName} · {p.user.email}
          </p>
          <p className="text-[11px] text-shop-text/60">
            Code {p.referralCode} · Joined{" "}
            {new Date(p.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mx-4 flex flex-wrap gap-2 lg:mx-8">
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${
            p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
          }`}
        >
          {p.status}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${
            VERIFICATION_TONE[verificationStatus] || "bg-shop-bg text-shop-text"
          }`}
        >
          {verificationStatus.toLowerCase()}
        </span>
      </div>

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8 lg:grid-cols-4">
        <Stat label="Referrals" value={p.referrals} />
        <Stat label="Net Profit" value={formatPrice(p.netProfit)} />
        <Stat label="Wallet Balance" value={formatPrice(p.walletBalance)} />
        <Stat label="Store Items" value={p.storeItems} />
      </div>

      {v && (
        <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <IdCard className="h-4 w-4 text-shop-accent-1" />
            Verification Documents — {v.status}
          </p>
          {(v.idType || v.idNumber) && (
            <p className="text-[12px] text-shop-text">
              {[v.idType, v.idNumber].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="grid grid-cols-3 gap-3">
            <DocSlot label="ID Front" image={v.idFrontUrl} />
            <DocSlot label="ID Back" image={v.idBackUrl} />
            <DocSlot label="Selfie Holding ID" image={v.selfieUrl} />
          </div>
          {v.reviewNote && (
            <p className="text-[11.5px] text-shop-accent-3">Review note: {v.reviewNote}</p>
          )}
        </div>
      )}

      <ModerationActions
        kind="partner"
        id={p.id}
        status={p.status}
        verification={verificationStatus}
        name={p.displayName}
      />

      <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <TrendingUp className="h-4 w-4 text-shop-accent-1" />
          Recent Earnings
        </p>
        <div className="flex flex-col gap-2">
          {p.earnings.slice(0, 6).map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3"
            >
              <div>
                <p className="text-[12.5px] font-medium text-shop-heading">{e.productTitle}</p>
                <p className="text-[11px] capitalize text-shop-text/60">{e.status.toLowerCase()}</p>
              </div>
              <span className="text-[12.5px] font-semibold text-emerald-600">
                {formatPrice(e.netProfit)}
              </span>
            </div>
          ))}
          {p.earnings.length === 0 && (
            <p className="text-[12px] text-shop-text/60">No earnings yet.</p>
          )}
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Store className="h-4 w-4 text-shop-accent-1" />
          Withdrawals
        </p>
        {p.withdrawals.length === 0 ? (
          <p className="rounded-[12px] bg-shop-bg p-3.5 text-[11.5px] text-shop-text/60">
            No withdrawals requested yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {p.withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3"
              >
                <div>
                  <p className="text-[12.5px] font-medium text-shop-heading">{w.reference}</p>
                  <p className="text-[11px] capitalize text-shop-text/60">
                    {String(w.status).toLowerCase()}
                  </p>
                </div>
                <span className="text-[12.5px] font-semibold text-shop-heading">
                  {formatPrice(w.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
