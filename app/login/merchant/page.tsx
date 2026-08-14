import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";

export const metadata = {
  title: "Merchant Login — AwaOwn",
  description: "Merchant tools are coming soon to AwaOwn.",
};

export default function MerchantLoginPage() {
  return (
    <AuthLayout
      eyebrow="Merchant"
      title="Merchant tools are on the way"
      subtitle="We're putting the finishing touches on store setup, product uploads and payouts for merchants."
    >
      <div className="flex flex-col items-center gap-5 rounded-[16px] border border-shop-border bg-shop-bg p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light">
          <Store className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] leading-[22px] text-shop-text">
          Merchant registration and the store dashboard will be available soon. In the
          meantime, keep shopping as a customer.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-2 text-[13px] font-semibold text-shop-accent-1 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to role selection
        </Link>
      </div>
    </AuthLayout>
  );
}
