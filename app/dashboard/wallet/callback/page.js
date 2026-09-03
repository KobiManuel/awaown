"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useVerifyWalletTopUpMutation } from "@/lib/api/walletApi";
import { errorMessage } from "@/lib/api/errorMessage";

function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [verifyTopUp] = useVerifyWalletTopUpMutation();
  const [state, setState] = useState("checking"); // checking | ok | failed
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let reference = "";
    try {
      reference = sessionStorage.getItem("awaown_wallet_topup") || "";
    } catch {}
    if (!reference) {
      reference = params.get("reference") || params.get("trxref") || "";
    }

    if (!reference) {
      setState("failed");
      setMessage("We couldn't identify this top-up.");
      setTimeout(() => router.replace("/dashboard/account"), 2500);
      return;
    }

    verifyTopUp(reference)
      .unwrap()
      .then(() => {
        try {
          sessionStorage.removeItem("awaown_wallet_topup");
        } catch {}
        setState("ok");
        setTimeout(() => router.replace("/dashboard/account?funded=1"), 1200);
      })
      .catch((err) => {
        setState("failed");
        setMessage(errorMessage(err, "That top-up could not be verified."));
        setTimeout(() => router.replace("/dashboard/account"), 2800);
      });
  }, [verifyTopUp, params, router]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-8 text-center font-shop">
      {state === "checking" && (
        <>
          <Loader2 className="h-9 w-9 animate-spin text-shop-accent-1" />
          <p className="text-[14px] font-medium text-shop-heading">
            Confirming your top-up…
          </p>
        </>
      )}
      {state === "ok" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <p className="text-[14px] font-medium text-shop-heading">
            Wallet funded — taking you back…
          </p>
        </>
      )}
      {state === "failed" && (
        <>
          <XCircle className="h-10 w-10 text-red-600" />
          <p className="text-[13.5px] font-medium text-shop-heading">{message}</p>
        </>
      )}
    </div>
  );
}

export default function WalletCallbackPage() {
  return (
    <Suspense fallback={null}>
      <Callback />
    </Suspense>
  );
}
