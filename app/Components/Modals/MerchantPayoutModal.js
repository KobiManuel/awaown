"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Loader2, CheckCircle2, Info } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { PAYOUT_BANKS, MERCHANT_PAYOUT_FEE_RATE } from "@/lib/payout-banks";
import { BANK_LOGOS } from "@/app/Components/Icons/BrandLogos";
import { requestPayout } from "@/lib/store/merchantSlice";
import ModalShell from "./ModalShell";

const MerchantPayoutModal = () => {
  const dispatch = useDispatch();
  const balance = useSelector((s) => s.merchant.walletBalance);
  const [step, setStep] = useState("amount"); // amount | processing | success
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState(PAYOUT_BANKS[0].id);

  const numericAmount = amount ? Number(amount) : 0;
  const fee = Math.round(numericAmount * MERCHANT_PAYOUT_FEE_RATE);
  const net = numericAmount - fee;
  const isValid = numericAmount > 0 && numericAmount <= balance;

  const handleAmount = (value) => setAmount(value.replace(/[^0-9]/g, ""));

  const handleConfirm = () => {
    if (!isValid || step === "processing") return;
    setStep("processing");
    setTimeout(() => {
      dispatch(requestPayout({ amount: numericAmount, bank }));
      setStep("success");
    }, 1200);
  };

  return (
    <ModalShell variant="sheet">
      {(close) => (
        <>
          {step === "amount" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-shop-heading">Request Payout</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
                >
                  <X className="h-4.5 w-4.5 text-shop-heading" />
                </button>
              </div>

              <p className="mb-3 rounded-[10px] bg-shop-bg px-3.5 py-3 text-[12.5px] text-shop-text">
                Available balance:{" "}
                <span className="font-semibold text-shop-heading">{formatPrice(balance)}</span>
              </p>

              <div className="mb-4 flex items-start gap-2 rounded-[10px] bg-amber-50 px-3.5 py-3">
                <Info className="h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.75} />
                <p className="text-[11.5px] leading-[16px] text-amber-800">
                  A 2.5% processing fee applies to all merchant payouts.
                </p>
              </div>

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">Amount</p>
              <div className="mb-2 flex items-center gap-2 rounded-[10px] border border-shop-border px-3.5 py-3 focus-within:border-shop-accent-1">
                <span className="text-[14px] font-semibold text-shop-text">₦</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => handleAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
                />
              </div>
              {numericAmount > balance && (
                <p className="mb-3 text-[12px] text-shop-accent-3">
                  Amount exceeds your available balance.
                </p>
              )}
              {numericAmount > 0 && numericAmount <= balance && (
                <div className="mb-5 flex flex-col gap-1 rounded-[10px] bg-shop-bg p-3 text-[12px] text-shop-text">
                  <div className="flex justify-between">
                    <span>Processing fee (2.5%)</span>
                    <span className="font-medium text-shop-heading">-{formatPrice(fee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-shop-border pt-1 font-semibold text-shop-heading">
                    <span>You&apos;ll receive</span>
                    <span>{formatPrice(net)}</span>
                  </div>
                </div>
              )}

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">Payout To</p>
              <div className="mb-6 flex flex-col gap-2">
                {PAYOUT_BANKS.map((b) => {
                  const active = bank === b.id;
                  const BankLogo = BANK_LOGOS[b.id];
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBank(b.id)}
                      className={`flex items-center justify-between rounded-[10px] border px-3.5 py-3 text-left transition-colors ${
                        active ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[13px] font-medium text-shop-heading">
                        {BankLogo && <BankLogo className="h-6 w-6 shrink-0" />}
                        {b.label}
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          active ? "border-shop-accent-1" : "border-shop-border"
                        }`}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-shop-accent-1" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isValid}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
              >
                {numericAmount > 0 ? `Request ${formatPrice(numericAmount).replace(".00", "")}` : "Enter an amount"}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-shop-accent-1" />
              <p className="text-[14px] font-medium text-shop-heading">
                Submitting your payout request...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-shop-heading">Payout Requested</p>
                <p className="mt-1 text-[12.5px] text-shop-text">
                  {formatPrice(net)} will be sent to your bank within 2–3 business days.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-full rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark"
              >
                Done
              </button>
            </div>
          )}
        </>
      )}
    </ModalShell>
  );
};

export default MerchantPayoutModal;
