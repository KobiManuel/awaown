"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import {
  useTopUpWalletMutation,
  useVerifyWalletTopUpMutation,
} from "@/lib/api/walletApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { openPaystackPopup } from "@/lib/paystack";
import ModalShell from "./ModalShell";

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000];
const FUNDING_METHODS = [
  { id: "card", label: "Debit / Credit Card" },
  { id: "transfer", label: "Bank Transfer" },
];

const TopUpModal = () => {
  const [step, setStep] = useState("amount"); // amount | processing | success
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState(FUNDING_METHODS[0].id);
  const [error, setError] = useState("");
  const [topUp] = useTopUpWalletMutation();
  const [verifyTopUp] = useVerifyWalletTopUpMutation();

  const handleCustomAmount = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    setCustomAmount(digits);
    setAmount(digits ? Number(digits) : 0);
  };

  const handleConfirm = async () => {
    if (amount <= 0 || step === "processing") return;
    setError("");
    setStep("processing");
    try {
      const res = await topUp(amount).unwrap();

      // Live gateway → inline popup (desktop) with hosted-page fallback.
      if (res?.provider === "paystack" && res.accessCode) {
        try {
          sessionStorage.setItem("awaown_wallet_topup", res.reference);
        } catch {}
        const outcome = await openPaystackPopup({
          accessCode: res.accessCode,
          fallbackUrl: res.authorizationUrl,
          onSuccess: async () => {
            try {
              await verifyTopUp(res.reference).unwrap();
            } catch {
              // webhook will still settle it; the wallet refreshes on next view
            }
            setStep("success");
          },
          onCancel: () => {
            setError("Payment cancelled.");
            setStep("amount");
          },
          onError: (e) => {
            setError(e?.message || "Payment could not be completed.");
            setStep("amount");
          },
        });
        if (outcome === "redirected") return;
        return;
      }

      // Older redirect-only response, or non-Paystack
      if (res?.authorizationUrl) {
        try {
          sessionStorage.setItem("awaown_wallet_topup", res.reference);
        } catch {}
        window.location.href = res.authorizationUrl;
        return;
      }

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
                <p className="text-[16px] font-semibold text-shop-heading">Top Up Wallet</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
                >
                  <X className="h-4.5 w-4.5 text-shop-heading" />
                </button>
              </div>

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">Quick Amount</p>
              <div className="mb-4 grid grid-cols-2 gap-2.5">
                {QUICK_AMOUNTS.map((value) => {
                  const active = amount === value && customAmount === "";
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setAmount(value);
                        setCustomAmount("");
                      }}
                      className={`rounded-[10px] border py-2.5 text-[13.5px] font-semibold transition-colors ${
                        active
                          ? "border-shop-accent-1 bg-shop-accent-1-light text-shop-accent-1"
                          : "border-shop-border text-shop-heading"
                      }`}
                    >
                      {formatPrice(value).replace(".00", "")}
                    </button>
                  );
                })}
              </div>

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">
                Or Enter Amount
              </p>
              <div className="mb-5 flex items-center gap-2 rounded-[10px] border border-shop-border px-3.5 py-3 focus-within:border-shop-accent-1">
                <span className="text-[14px] font-semibold text-shop-text">₦</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
                />
              </div>

              <p className="mb-2 text-[12.5px] font-semibold text-shop-heading">Fund With</p>
              <div className="mb-6 flex flex-col gap-2">
                {FUNDING_METHODS.map((m) => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center justify-between rounded-[10px] border px-3.5 py-3 text-left transition-colors ${
                        active ? "border-shop-accent-1 bg-shop-accent-1-light" : "border-shop-border"
                      }`}
                    >
                      <span className="text-[13px] font-medium text-shop-heading">{m.label}</span>
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

              {error && (
                <p className="mb-3 text-[12.5px] font-medium text-red-600">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={amount <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
              >
                {amount > 0
                  ? `Top Up ${formatPrice(amount).replace(".00", "")}`
                  : "Enter an amount"}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-shop-accent-1" />
              <p className="text-[14px] font-medium text-shop-heading">
                Processing your payment...
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
                  {formatPrice(amount)} Added!
                </p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-[12.5px] text-shop-text">
                  <Wallet className="h-3.5 w-3.5" />
                  Your wallet has been topped up successfully.
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

export default TopUpModal;
