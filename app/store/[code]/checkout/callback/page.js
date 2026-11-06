"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useGuestConfirmPaymentMutation } from "@/lib/api/ordersApi";
import { usePartnerCart } from "@/lib/usePartnerCart";
import { errorMessage } from "@/lib/api/errorMessage";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

// Where Paystack sends a guest back after the hosted-checkout redirect from
// store/[code]/checkout/page.js (see lib/paystack.js's CHECKOUT_MODE) - same
// shape as /checkout/callback, plus clearing this store's own cart instead
// of the main site's.
function Callback() {
  const { code } = useParams();
  const router = useRouter();
  const params = useSearchParams();
  const cart = usePartnerCart(code);
  const [guestConfirmPayment] = useGuestConfirmPaymentMutation();
  const [state, setState] = useState("checking"); // checking | ok | failed
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let reference = "";
    let phone = "";
    let onlyItemId = "";
    try {
      reference = sessionStorage.getItem("awaown_pending_order") || "";
      phone = sessionStorage.getItem("awaown_pending_phone") || "";
      onlyItemId = sessionStorage.getItem("awaown_pending_item") || "";
    } catch {}
    if (!reference) {
      const gw = params.get("reference") || params.get("trxref") || "";
      reference = gw.includes("_") ? gw.split("_")[0] : gw;
    }

    if (!reference || !phone) {
      setState("failed");
      setMessage(
        "We couldn't identify your order. Check your phone for a confirmation, or contact the store.",
      );
      return;
    }

    guestConfirmPayment({ reference, phone })
      .unwrap()
      .then(() => {
        try {
          sessionStorage.removeItem("awaown_pending_order");
          sessionStorage.removeItem("awaown_pending_phone");
          sessionStorage.removeItem("awaown_pending_item");
        } catch {}
        // Same rule as finishOrder() on the checkout page - "Buy Now" only
        // clears the one item it checked out.
        if (onlyItemId) cart.remove(onlyItemId);
        else cart.clear();
        setState("ok");
        router.replace(
          `/store/${code}/orders/${reference}?phone=${encodeURIComponent(phone)}&placed=true`,
        );
      })
      .catch((err) => {
        setState("failed");
        setMessage(errorMessage(err, "Payment could not be verified."));
        setTimeout(
          () =>
            router.replace(
              `/store/${code}/orders/${reference}?phone=${encodeURIComponent(phone)}`,
            ),
          2500,
        );
      });
    // cart's methods are stable per `code` (see usePartnerCart), and `ran`
    // guards this effect to run once regardless.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestConfirmPayment, params, router, code]);

  return (
    <StoreThemeShell cartButton={false}>
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
            <p className="text-[13.5px] font-medium text-shop-heading">
              {message}
            </p>
          </>
        )}
      </div>
    </StoreThemeShell>
  );
}

export default function StoreCheckoutCallbackPage() {
  return (
    <Suspense fallback={null}>
      <Callback />
    </Suspense>
  );
}
