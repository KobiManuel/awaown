"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import FormField from "@/app/Components/Auth/FormField";
import { login } from "@/lib/store/authSlice";
import { adminProfile } from "@/lib/admin-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const email = e.target.email?.value || adminProfile.email;
    setTimeout(() => {
      dispatch(login({ name: adminProfile.name, email, role: "admin" }));
      router.push("/admin");
    }, 900);
  };

  return (
    <AuthLayout
      eyebrow="Admin"
      title="Sign in to the admin panel"
      subtitle="Restricted access — for AwaOwn staff only."
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <FormField
          label="Email address"
          type="email"
          name="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@awaown.com"
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
    </AuthLayout>
  );
}
