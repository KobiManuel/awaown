"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Banknote, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import { openModal, MODAL_TYPES } from "@/lib/store/modalSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

const STATUS_TONE = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
};

export default function PartnerWithdrawPage() {
  const dispatch = useDispatch();
  const balance = useSelector((s) => s.partner.walletBalance);
  const withdrawals = useSelector((s) => s.partner.withdrawals);

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Withdraw" />

      <div className="mx-4 flex flex-col gap-4 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-5 text-white lg:mx-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-white/75">Available Balance</p>
            <p className="text-[18px] font-semibold">{formatPrice(balance)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => dispatch(openModal({ modalType: MODAL_TYPES.WITHDRAW }))}
          className="flex items-center justify-center gap-2 rounded-[10px] bg-white py-3 text-[13.5px] font-semibold text-shop-accent-1"
        >
          <ArrowUpRight className="h-4 w-4" />
          Withdraw Funds
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading">Withdrawal History</p>
        {withdrawals.length === 0 ? (
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
                  <Banknote className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-shop-heading">{w.id}</p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(w.date).toLocaleDateString("en-NG", {
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
                    {w.status}
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
