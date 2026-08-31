"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Ban, Play, Store, Package, ShoppingBag, IdCard, User as UserIcon } from "lucide-react";
import { VERIFICATION_TONE, formatPrice } from "@/lib/admin-data";
import { setMerchantStatus, setMerchantVerification } from "@/lib/store/adminSlice";
import { adminSetVerificationStatus } from "@/lib/store/merchantSlice";
import { MERCHANT_ORDER_STATUS_LABEL, MERCHANT_ORDER_STATUS_TONE } from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useUndoBuffer } from "@/app/Components/Dashboard/UndoBar";

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
  const dispatch = useDispatch();
  const showToast = useToast();
  const merchant = useSelector((s) => s.admin.merchants.find((m) => m.id === id));

  const isLive = id === "m-1";
  const liveProducts = useSelector((s) => s.merchant.products);
  const liveOrders = useSelector((s) => s.merchant.orders);
  const walletBalance = useSelector((s) => s.merchant.walletBalance);
  const escrowBalance = useSelector((s) => s.merchant.escrowBalance);
  const liveVerification = useSelector((s) => s.merchant.verification);
  const { run, bar } = useUndoBuffer();

  if (!merchant) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Merchant" backHref="/admin/merchants" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This merchant couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const handleVerify = (verification) => {
    const previous = merchant.verification;
    dispatch(setMerchantVerification({ id: merchant.id, verification }));
    if (isLive) dispatch(adminSetVerificationStatus(verification));
    const label = verification === "verified" ? "approved" : "rejected";
    showToast(`${merchant.storeName} verification ${label}`);
    run(
      `${merchant.storeName} verification ${label} — undo within 8 seconds`,
      () => {
        dispatch(setMerchantVerification({ id: merchant.id, verification: previous }));
        if (isLive) dispatch(adminSetVerificationStatus(previous));
        showToast("Undone");
      },
      () => {},
    );
  };

  const handleStatus = (status) => {
    dispatch(setMerchantStatus({ id: merchant.id, status }));
    showToast(`${merchant.storeName} ${status === "suspended" ? "suspended" : "reactivated"}`);
  };

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title={merchant.storeName} backHref="/admin/merchants" showBackOnDesktop />

      <div className="mx-4 flex items-center gap-4 lg:mx-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-shop-accent-1 text-[18px] font-semibold text-white">
          {merchant.storeName.charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-shop-heading">{merchant.storeName}</p>
          <p className="text-[12.5px] text-shop-text">{merchant.owner}</p>
          <p className="text-[11px] text-shop-text/60">
            Joined {new Date(merchant.joinedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mx-4 flex flex-wrap gap-2 lg:mx-8">
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${
            merchant.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3"
          }`}
        >
          {merchant.status}
        </span>
        <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize ${VERIFICATION_TONE[merchant.verification]}`}>
          {merchant.verification}
        </span>
      </div>

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8 lg:grid-cols-4">
        <Stat label="Products" value={isLive ? liveProducts.length : merchant.products} />
        <Stat label="Rating" value={`★ ${merchant.rating}`} />
        {isLive ? (
          <>
            <Stat label="Wallet Balance" value={formatPrice(walletBalance)} />
            <Stat label="Escrow Balance" value={formatPrice(escrowBalance)} />
          </>
        ) : (
          <p className="col-span-2 flex items-center rounded-[12px] bg-shop-bg p-3.5 text-[11px] text-shop-text/60">
            Wallet and escrow detail isn&apos;t available for this demo merchant.
          </p>
        )}
      </div>

      {merchant.verification !== "unverified" && (
        <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <IdCard className="h-4 w-4 text-shop-accent-1" />
            Verification Documents
          </p>
          {isLive ? (
            <div className="grid grid-cols-3 gap-3">
              <DocSlot label="ID Front" image={liveVerification.idImageFront} />
              <DocSlot label="ID Back" image={liveVerification.idImageBack} />
              <DocSlot label="Selfie Holding ID" image={liveVerification.selfieImage} />
            </div>
          ) : (
            <p className="flex items-center gap-2 rounded-[12px] bg-shop-bg p-3.5 text-[11px] text-shop-text/60">
              <UserIcon className="h-3.5 w-3.5 shrink-0" />
              Uploaded documents aren&apos;t available for this demo merchant record.
            </p>
          )}
        </div>
      )}

      <div className="mx-4 flex flex-wrap gap-2 border-t border-shop-border pt-4 lg:mx-8">
        {merchant.verification !== "verified" && (
          <button
            type="button"
            onClick={() => handleVerify("verified")}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white"
          >
            <BadgeCheck className="h-4 w-4" />
            Approve Verification
          </button>
        )}
        {merchant.verification === "pending" && (
          <button
            type="button"
            onClick={() => handleVerify("unverified")}
            className="rounded-full border border-shop-border px-4 py-2.5 text-[12.5px] font-semibold text-shop-heading"
          >
            Reject
          </button>
        )}
        {merchant.status === "active" ? (
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
              <Package className="h-4 w-4 text-shop-accent-1" />
              Products
            </p>
            <div className="flex flex-col gap-2">
              {liveProducts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-[12px] border border-shop-border bg-white p-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1" sizes="44px" />
                    ) : (
                      <Store className="h-4 w-4 text-shop-text/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">{p.title}</p>
                    <p className="text-[11px] text-shop-text/60">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 flex flex-col gap-2.5 lg:mx-8">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              <ShoppingBag className="h-4 w-4 text-shop-accent-1" />
              Recent Orders
            </p>
            <div className="flex flex-col gap-2">
              {liveOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-[12px] border border-shop-border bg-white p-3">
                  <div>
                    <p className="text-[12.5px] font-medium text-shop-heading">{o.id}</p>
                    <p className="text-[11px] text-shop-text/60">{o.customerName}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${MERCHANT_ORDER_STATUS_TONE[o.status]}`}>
                    {MERCHANT_ORDER_STATUS_LABEL[o.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {bar}
    </div>
  );
}
