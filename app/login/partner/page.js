"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import FormField from "@/app/Components/Auth/FormField";
import { login } from "@/lib/store/authSlice";
import { dummyUser } from "@/lib/dashboard-data";

export default function PartnerLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const email = e.target.email?.value || dummyUser.email;
    setTimeout(() => {
      dispatch(login({ ...dummyUser, email, role: "partner" }));
      router.push("/partner");
    }, 900);
  };

  return (
    <AuthLayout
      eyebrow="Partner"
      title="Sign in to your partner dashboard"
      subtitle="Share products with your audience and make profit from every sale."
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

      <p className="mt-8 text-center text-[14px] text-shop-text">
        Not a partner yet?{" "}
        <Link href="/login" className="font-semibold text-shop-accent-1 hover:underline">
          Back to role selection
        </Link>
      </p>
    </AuthLayout>
  );
}
