"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OtpAuthFlow from "@/app/Components/Auth/OtpAuthFlow";

function CustomerLogin() {
  const params = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  return (
    <OtpAuthFlow
      role="customer"
      mode={mode}
      eyebrow="Welcome"
      title="Sign in to your account"
      subtitle="Enter your email and we'll send you a one-time code."
    />
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={null}>
      <CustomerLogin />
    </Suspense>
  );
}
