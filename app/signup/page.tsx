import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import FormField from "@/app/Components/Auth/FormField";
import SocialButtons from "@/app/Components/Auth/SocialButtons";

export const metadata = {
  title: "Sign Up — AwaOwn",
  description: "Create your AwaOwn account.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Join thousands shopping, selling and saving with AwaOwn."
    >
      <form className="flex flex-col gap-5">
        <FormField
          label="Full name"
          type="text"
          name="name"
          icon={<User className="h-4 w-4" />}
          placeholder="Jane Doe"
          autoComplete="name"
        />
        <FormField
          label="Email address"
          type="email"
          name="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          icon={<Lock className="h-4 w-4" />}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <label className="flex items-start gap-2 text-[13px] text-shop-text">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-shop-border accent-[#6d28d9]"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-shop-accent-1 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-shop-accent-1 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
        >
          Create Account
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-shop-border" />
        <span className="text-[12px] text-shop-text/60">Or continue with</span>
        <div className="h-px flex-1 bg-shop-border" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-[14px] text-shop-text">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-shop-accent-1 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
