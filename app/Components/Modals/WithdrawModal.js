"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, CalendarClock, ShieldAlert } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import {
  useGetPartnerWithdrawalsQuery,
  useRequestWithdrawalMutation,
} from "@/lib/api/partnerApi";
import { errorMessage } from "@/lib/api/errorMessage";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import BankAccountFields, {
  useBankAccountFields,
} from "@/app/Components/Payments/BankAccountFields";
import ModalShell from "./ModalShell";

const MIN_WITHDRAWAL = 1000;

const WithdrawModal = () => {
  const { data } = useGetPartnerWithdrawalsQuery();
  const [requestWithdrawal] = useRequestWithdrawalMutation();
  const balance = data?.balance ?? 0;
  const verified = data?.verification === "VERIFIED";

  const [step, setStep] = useState("amount"); // amount | processing | success
  const [amount, setAmount] = useState("");
  const bankFields = useBankAccountFields();
  const [error, setError] = useState("");

  const numericAmount = amount ? Number(amount) : 0;
  const isValid =
    numericAmount >= MIN_WITHDRAWAL &&
    numericAmount <= balance &&
    bankFields.ready;

  if (!verified) {
    return (
      <ModalShell variant="sheet">
        {(close) => (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <ShieldAlert className="h-6 w-6 text-amber-700" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-shop-heading">Verify to Withdraw</p>
              <p className="mt-1 text-[12.5px] text-shop-text">
                Only verified partners can request a withdrawal. Verify your identity from
                your account page first.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white hover:bg-shop-accent-1-dark"
            >
              Got it
            </button>
          </div>
        )}
      </ModalShell>
    );
  }

  const handleAmount = (digits) => {
    setAmount(digits);
  };

  const handleConfirm = async () => {
    if (!isValid || step === "processing") return;
    setError("");
    setStep("processing");
    try {
      await requestWithdrawal({
        amount: numericAmount,
        bankName: bankFields.bankName,
        bankCode: bankFields.bankCode,
        accountNumber: bankFields.accountNumber,
        accountName: bankFields.resolvedName,
      }).unwrap();
      setStep("success");
    } catch (err) {
      setError(errorMessage(err));
      setStep("amount");
    }
  };

  return (
    <ModalShell variant="sheet">
      {(close) => (
        <>
          {step === "amount" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-shop-heading">Withdraw Profit</p>
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
                <CalendarClock className="h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.75} />
                <p className="text-[11.5px] leading-[16px] text-amber-800">
                  Withdrawals reach your bank in 2-3 business days. Minimum withdrawal is{" "}
                  {formatPrice(MIN_WITHDRAWAL)}.
                </p>
              </div>

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">Amount</p>
              <div className="mb-2 flex items-center gap-2 rounded-[10px] border border-shop-border px-3.5 py-3 focus-within:border-shop-accent-1">
                <span className="text-[14px] font-semibold text-shop-text">₦</span>
                <MoneyInput
                  value={amount}
                  onChange={handleAmount}
                  placeholder="0"
                  className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
                />
              </div>
              {numericAmount > balance && (
                <p className="mb-4 text-[12px] text-shop-accent-3">
                  Amount exceeds your available balance.
                </p>
              )}
              {numericAmount > 0 && numericAmount < MIN_WITHDRAWAL && (
                <p className="mb-4 text-[12px] text-shop-accent-3">
                  Minimum withdrawal is {formatPrice(MIN_WITHDRAWAL)}.
                </p>
              )}

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">
                Withdraw To
              </p>
              <BankAccountFields fields={bankFields} />

              {error && (
                <p className="mb-3 text-[12.5px] font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isValid}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
              >
                {numericAmount > 0
                  ? `Withdraw ${formatPrice(numericAmount)}`
                  : "Enter an amount"}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-shop-accent-1" />
              <p className="text-[14px] font-medium text-shop-heading">
                Submitting your withdrawal request...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-shop-heading">
                  Withdrawal Requested
                </p>
                <p className="mt-1 text-[12.5px] text-shop-text">
                  {formatPrice(numericAmount)} will reach your bank in 2-3 business days.
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

export default WithdrawModal;
