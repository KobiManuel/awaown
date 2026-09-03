"use client";

import React from "react";
import { useDispatch } from "react-redux";
import {
  Wallet,
  Banknote,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetPartnerWithdrawalsQuery,
  useGetPartnerEarningsQuery,
} from "@/lib/api/partnerApi";

const STATUS_TONE = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-50 text-shop-accent-3",
};

export default function PartnerWithdrawPage() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetPartnerWithdrawalsQuery();
  const { data: earnings } = useGetPartnerEarningsQuery();

  const verified = data?.verification === "VERIFIED";
  const pending = data?.verification === "PENDING";
  const withdrawals = data?.history ?? [];

  const handleWithdrawClick = () => {
    if (!verified) {
      dispatch(
        openModal({
          modalType: MODAL_TYPES.VERIFY_IDENTITY,
          modalProps: { role: "partner" },
        }),
      );
      return;
    }
    dispatch(openModal({ modalType: MODAL_TYPES.WITHDRAW }));
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Withdraw" backHref="/partner" />

      {!verified && (
        <button
          type="button"
          onClick={handleWithdrawClick}
          className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 text-left lg:mx-8"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-amber-700"
            strokeWidth={1.75}
          />
          <span className="text-[12.5px] leading-[18px] text-amber-800">
            {pending
              ? "Your identity verification is under review."
              : "Verify your identity to unlock payouts."}
          </span>
        </button>
      )}

      <div className="mx-4 grid grid-cols-2 gap-3 lg:mx-8">
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-4.5 w-4.5 text-amber-700" strokeWidth={1.75} />
          </div>
          <p className="text-[16px] font-semibold text-shop-heading">
            {formatPrice(earnings?.pending ?? 0)}
          </p>
          <p className="text-[11.5px] text-shop-text">Pending in Escrow</p>
        </div>
      </div>

      <div className="mx-4 lg:mx-8">
        <button
          type="button"
          onClick={handleWithdrawClick}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white hover:bg-shop-accent-1-dark"
        >
          {verified ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {verified ? "Withdraw Funds" : "Verify to Withdraw"}
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">
          Withdrawal History
        </p>
        {isLoading ? (
          <SkeletonRows count={3} />
        ) : withdrawals.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-shop-text">
            No withdrawals yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
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
                    {w.reference}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(w.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {formatPrice(w.amount)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_TONE[w.status]}`}
                  >
                    {w.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
