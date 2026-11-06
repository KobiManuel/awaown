"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useGuestConfirmPaymentMutation } from "@/lib/api/ordersApi";
import { clearCart } from "@/lib/store/cartSlice";
import { clearBuyNow } from "@/lib/express-checkout";
import { errorMessage } from "@/lib/api/errorMessage";

// Where Paystack sends a guest back after the hosted-checkout redirect from
// CheckoutClient.js (see lib/paystack.js's CHECKOUT_MODE). No session to
// confirm payment with, so this mirrors guestConfirmPayment's phone-based
// check instead of the signed-in /dashboard/checkout/callback.
function Callback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const [guestConfirmPayment] = useGuestConfirmPaymentMutation();
  const [state, setState] = useState("checking"); // checking | ok | failed
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let reference = "";
    let phone = "";
    try {
      reference = sessionStorage.getItem("awaown_pending_order") || "";
      phone = sessionStorage.getItem("awaown_pending_phone") || "";
    } catch {}
    // Paystack returns ?reference / ?trxref. The gateway ref is
    // "<ORDER>_<suffix>", so recover the order ref if the session was lost.
    if (!reference) {
      const gw = params.get("reference") || params.get("trxref") || "";
      reference = gw.includes("_") ? gw.split("_")[0] : gw;
    }

    if (!reference || !phone) {
      setState("failed");
      setMessage(
        "We couldn't identify your order. Check your phone for a confirmation, or contact support.",
      );
      return;
    }

    guestConfirmPayment({ reference, phone })
      .unwrap()
      .then(() => {
        try {
          sessionStorage.removeItem("awaown_pending_order");
          sessionStorage.removeItem("awaown_pending_phone");
        } catch {}
        dispatch(clearCart());
        clearBuyNow();
        setState("ok");
        router.replace(
          `/orders/track/${reference}?phone=${encodeURIComponent(phone)}&placed=true`,
        );
      })
      .catch((err) => {
        setState("failed");
        setMessage(errorMessage(err, "Payment could not be verified."));
        setTimeout(
          () =>
            router.replace(
              `/orders/track/${reference}?phone=${encodeURIComponent(phone)}`,
            ),
          2500,
        );
      });
  }, [guestConfirmPayment, dispatch, params, router]);

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
            Payment confirmed. Taking you to your order.
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

export default function GuestCheckoutCallbackPage() {
  return (
    <Suspense fallback={null}>
      <Callback />
    </Suspense>
  );
}
