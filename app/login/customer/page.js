"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import FormField from "@/app/Components/Auth/FormField";
import SocialButtons from "@/app/Components/Auth/SocialButtons";
import { login } from "@/lib/store/authSlice";
import { dummyUser } from "@/lib/dashboard-data";

export default function CustomerLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const email = e.target.email?.value || dummyUser.email;
    setTimeout(() => {
      dispatch(login({ ...dummyUser, email }));
      router.push("/dashboard");
    }, 900);
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your details to pick up right where you left off."
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 text-shop-text">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-shop-border accent-[#6d28d9]"
            />
            Remember me
          </label>
          <a href="#" className="font-medium text-shop-accent-1 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-shop-border" />
        <span className="text-[12px] text-shop-text/60">Or continue with</span>
        <div className="h-px flex-1 bg-shop-border" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-[14px] text-shop-text">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-shop-accent-1 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
