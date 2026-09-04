"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OtpAuthFlow from "@/app/Components/Auth/OtpAuthFlow";

function MerchantLogin() {
  const params = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  return (
    <OtpAuthFlow
      role="merchant"
      mode={mode}
      eyebrow="Merchant"
      title="Sign in to your store"
      subtitle="Manage products, fulfil orders and track payouts from your merchant dashboard."
    />
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense fallback={null}>
      <MerchantLogin />
    </Suspense>
  );
}
