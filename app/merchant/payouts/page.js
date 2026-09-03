"use client";

import React from "react";
import { useDispatch } from "react-redux";
import {
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Banknote,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import { useGetMerchantPayoutsQuery } from "@/lib/api/merchantApi";

const STATUS_TONE = {
  PROCESSING: "text-amber-600",
  PAID: "text-emerald-600",
  FAILED: "text-shop-accent-3",
};

export default function MerchantPayoutsPage() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMerchantPayoutsQuery();

  const verified = data?.verification === "VERIFIED";
  const pending = data?.verification === "PENDING";
  const payouts = data?.history ?? [];

  const handlePayoutClick = () => {
    if (!verified) {
      dispatch(
        openModal({
          modalType: MODAL_TYPES.VERIFY_IDENTITY,
          modalProps: { role: "merchant" },
        }),
      );
      return;
    }
    dispatch(openModal({ modalType: MODAL_TYPES.MERCHANT_PAYOUT }));
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Payouts" backHref="/merchant" />

      {!verified && (
        <button
          type="button"
          onClick={handlePayoutClick}
          className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 text-left lg:mx-8"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-amber-700"
            strokeWidth={1.75}
          />
          <span className="text-[12.5px] leading-[18px] text-amber-800">
            {pending
              ? "Your identity verification is under review."
              : "Verify your identity to request a payout."}
          </span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 lg:px-8">
        <div className="flex flex-col gap-2 rounded-[14px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-4.5 w-4.5" strokeWidth={1.75} />
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24 bg-white/20" />
          ) : (
            <p className="text-[16px] font-semibold">
              {formatPrice(data?.balance ?? 0)}
            </p>
          )}
          <p className="text-[11.5px] text-white/75">Available Balance</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
            <ShieldCheck
              className="h-4.5 w-4.5 text-shop-accent-1"
              strokeWidth={1.75}
            />
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <p className="text-[16px] font-semibold text-shop-heading">
              {formatPrice(data?.escrow ?? 0)}
            </p>
          )}
          <p className="text-[11.5px] text-shop-text">In Escrow</p>
        </div>
      </div>

      <div className="mx-4 flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5 lg:mx-8">
        <ShieldCheck
          className="h-5 w-5 shrink-0 text-shop-accent-1"
          strokeWidth={1.75}
        />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Escrow funds are released to your available balance once a customer
          confirms delivery.
        </p>
      </div>

      <div className="mx-4 flex items-start gap-3 rounded-[12px] bg-amber-50 p-3.5 lg:mx-8">
        <Info className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-amber-800">
          A 2.5% processing fee is charged on all withdrawals.
        </p>
      </div>

      <div className="px-4 lg:px-8">
        <button
          type="button"
          onClick={handlePayoutClick}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white hover:bg-shop-accent-1-dark"
        >
          {verified ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {verified ? "Request Payout" : "Verify to Request Payout"}
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">
          Payout History
        </p>
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : payouts.length === 0 ? (
          <p className="py-4 text-center text-[12.5px] text-shop-text/70">
            No payouts yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
                  <Banknote
                    className="h-4 w-4 text-shop-heading"
                    strokeWidth={1.75}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-shop-heading">
                    {payout.reference}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(payout.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · requested {formatPrice(payout.amount)} · fee{" "}
                    {formatPrice(payout.fee)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {formatPrice(payout.net)}
                  </p>
                  <p className="text-[9.5px] uppercase tracking-wide text-shop-text/50">
                    Net
                  </p>
                  <p
                    className={`text-[10.5px] font-medium capitalize ${STATUS_TONE[payout.status] || "text-shop-text"}`}
                  >
                    {payout.status.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
