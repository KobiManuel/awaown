"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Store, Package, ShoppingBag, IdCard } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import { statusMeta } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminMerchantQuery } from "@/lib/api/adminApi";
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

export default function AdminMerchantDetailPage() {
  const { id } = useParams();
  const { data: m, isLoading, isError } = useGetAdminMerchantQuery(id);

  if (isLoading)
    return (
      <div className="p-4 lg:p-8">
        <Skeleton className="h-64 w-full rounded-[14px]" />
      </div>
    );
  if (isError || !m)
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Merchant" backHref="/admin/merchants" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This merchant couldn&apos;t be found.
        </p>
      </div>
    );

  const v = m.verification;
  const verificationStatus = v?.status ?? "UNVERIFIED";

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title={m.storeName} backHref="/admin/merchants" showBackOnDesktop />

      <div className="mx-4 flex items-center gap-4 lg:mx-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[18px] font-semibold text-white">
          {m.storeName.charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{m.storeName}</p>
          <p className="text-[12.5px] text-shop-text">
            {m.user.fullName} · {m.user.email}
          </p>
          <p className="text-[11px] text-shop-text/60">
            Joined{" "}
            {new Date(m.createdAt).toLocaleDateString("en-NG", {
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
            m.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
          }`}
        >
          {m.status}
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
        <Stat label="Products" value={m.products.length} />
        <Stat label="Wallet Balance" value={formatPrice(m.walletBalance)} />
        <Stat label="Escrow Balance" value={formatPrice(m.escrowBalance)} />
        <Stat
          label="Business"
          value={<span className="text-[12.5px]">{m.businessName || "—"}</span>}
        />
      </div>

      {(m.phone || m.state || m.address) && (
        <p className="mx-4 text-[12px] text-shop-text lg:mx-8">
          {[m.phone, m.state, m.address].filter(Boolean).join(" · ")}
        </p>
      )}

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
        kind="merchant"
        id={m.id}
        status={m.status}
        verification={verificationStatus}
        name={m.storeName}
      />

      <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Package className="h-4 w-4 text-shop-accent-1" />
          Products ({m.products.length})
        </p>
        <div className="flex flex-col gap-2">
          {m.products.slice(0, 8).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-[12px] border border-shop-border bg-white p-3"
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    className="object-contain p-1"
                    sizes="44px"
                  />
                ) : (
                  <Store className="h-4 w-4 text-shop-text/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">{p.title}</p>
                <p className="text-[11px] text-shop-text/60">
                  {formatPrice(p.price)} · {p.approvalStatus}
                </p>
              </div>
            </div>
          ))}
          {m.products.length === 0 && (
            <p className="text-[12px] text-shop-text/60">No products yet.</p>
          )}
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <ShoppingBag className="h-4 w-4 text-shop-accent-1" />
          Recent Orders
        </p>
        <div className="flex flex-col gap-2">
          {m.orders.slice(0, 6).map((o) => {
            const meta = statusMeta(o.status);
            return (
              <div
                key={o.reference}
                className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3"
              >
                <p className="text-[12.5px] font-medium text-shop-heading">{o.reference}</p>
                <span className="flex items-center gap-2">
                  <span className="text-[11.5px] text-shop-text/70">{formatPrice(o.total)}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${meta.tone}`}
                  >
                    {meta.label}
                  </span>
                </span>
              </div>
            );
          })}
          {m.orders.length === 0 && (
            <p className="text-[12px] text-shop-text/60">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
