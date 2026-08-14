import Link from "next/link";
import { Users2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";

export const metadata = {
  title: "Member Login — AwaOwn",
  description: "The AwaOwn Member programme is coming soon.",
};

export default function MemberLoginPage() {
  return (
    <AuthLayout
      eyebrow="Member"
      title="The Member programme is on the way"
      subtitle="Soon you'll be able to share products with your audience and make profit from every sale — no commission jargon, just clear payouts."
    >
      <div className="flex flex-col items-center gap-5 rounded-[16px] border border-shop-border bg-shop-bg p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light">
          <Users2 className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] leading-[22px] text-shop-text">
          Member registration, referral links and the profit dashboard will be available
          soon. In the meantime, keep shopping as a customer.
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
