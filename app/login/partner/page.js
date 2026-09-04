"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OtpAuthFlow from "@/app/Components/Auth/OtpAuthFlow";

function PartnerLogin() {
  const params = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  return (
    <OtpAuthFlow
      role="partner"
      mode={mode}
      eyebrow="Partner"
      title="Sign in to your partner dashboard"
      subtitle="Share products with your audience and make profit from every sale."
    />
  );
}

export default function PartnerLoginPage() {
  return (
    <Suspense fallback={null}>
      <PartnerLogin />
    </Suspense>
  );
}
