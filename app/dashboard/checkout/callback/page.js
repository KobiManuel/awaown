"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useConfirmPaymentMutation } from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";

function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [state, setState] = useState("checking"); // checking | ok | failed
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let orderRef = "";
    try {
      orderRef = sessionStorage.getItem("awaown_pending_order") || "";
    } catch {}
    // Paystack returns ?reference / ?trxref — the gateway ref is
    // "<ORDER>_<suffix>", so recover the order ref if the session was lost.
    if (!orderRef) {
      const gw = params.get("reference") || params.get("trxref") || "";
      orderRef = gw.includes("_") ? gw.split("_")[0] : gw;
    }

    if (!orderRef) {
      setState("failed");
      setMessage("We couldn't identify your order. Check your Orders page.");
      return;
    }

    confirmPayment(orderRef)
      .unwrap()
      .then(() => {
        try {
          sessionStorage.removeItem("awaown_pending_order");
        } catch {}
        setState("ok");
        router.replace(`/dashboard/orders/${orderRef}?placed=true`);
      })
      .catch((err) => {
        setState("failed");
        setMessage(errorMessage(err, "Payment could not be verified."));
        setTimeout(
          () => router.replace(`/dashboard/orders/${orderRef}`),
          2500,
        );
      });
  }, [confirmPayment, params, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-shop-bg px-8 text-center font-shop">
      {state === "checking" && (
        <>
          <Loader2 className="h-9 w-9 animate-spin text-shop-accent-1" />
          <p className="text-[14px] font-medium text-shop-heading">
            Confirming your payment…
          </p>
        </>
      )}
      {state === "ok" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <p className="text-[14px] font-medium text-shop-heading">
            Payment confirmed — taking you to your order.
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

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={null}>
      <Callback />
    </Suspense>
  );
}
