"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2, ArrowRight } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";
import { markSignedIn } from "@/lib/session-cookie";
import { useCompleteOnboardingMutation } from "@/lib/api/authApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";

const DASHBOARD_HOME = {
  customer: "/dashboard",
  merchant: "/merchant",
  partner: "/partner",
};

// Where each role lands the first time, right after finishing onboarding. A new
// partner's first job is to customise their storefront, not stare at an empty
// dashboard (profile + payout details live in partner Account settings).
const FIRST_RUN_DEST = {
  ...DASHBOARD_HOME,
  partner: "/partner/customize",
};

const COPY = {
  customer: {
    title: "Almost there",
    subtitle: "Add a phone number so merchants can reach you about deliveries.",
  },
  merchant: {
    title: "Set up your store",
    subtitle: "A few details so customers know who they're buying from.",
  },
  partner: {
    title: "Set up your partner profile",
    subtitle: "This is the name shoppers see on your storefront.",
  },
};

function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-shop-heading">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-shop-text/70">{hint}</span>}
    </label>
  );
}

const inputCls =
  "rounded-[8px] border border-shop-border bg-white px-3.5 py-3 text-[14px] text-shop-heading outline-none focus:border-shop-accent-1 focus:ring-2 focus:ring-shop-accent-1-light";

function OnboardingForm() {
  const router = useRouter();
  const { role } = useParams();
  const nextParam = useSearchParams().get("next");
  const dest =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : FIRST_RUN_DEST[role] || "/";
  const { resolving, authed, unauth, onboardingComplete } =
    useAuthBootstrap(role);
  const userName = useSelector((s) => s.auth.user?.name);

  const [form, setForm] = useState({});
  const [formError, setFormError] = useState("");
  const [complete, completeState] = useCompleteOnboardingMutation();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (unauth) router.replace(`/login/${role}`);
  }, [unauth, role, router]);

  useEffect(() => {
    if (authed) markSignedIn(role);
  }, [authed, role]);

  useEffect(() => {
    if (authed && onboardingComplete) router.replace(dest);
  }, [authed, onboardingComplete, dest, router]);

  if (resolving || !authed || onboardingComplete || !DASHBOARD_HOME[role]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-shop-accent-1 border-t-transparent" />
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    let body;
    if (role === "customer") body = { phone: form.phone?.trim() };
    else if (role === "merchant")
      body = {
        businessName: form.businessName?.trim(),
        storeName: form.storeName?.trim(),
        phone: form.phone?.trim(),
        category: form.category || undefined,
      };
    else body = { displayName: form.displayName?.trim() };

    try {
      await complete(body).unwrap();
      markSignedIn(role);
      // Full navigation so the session cookie we just wrote is sent with the
      // request proxy.ts sees — a client replace can land back here "stuck".
      window.location.assign(dest);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const copy = COPY[role];

  return (
    <AuthLayout
      eyebrow={`Welcome${userName ? `, ${userName.split(" ")[0]}` : ""}`}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        {role === "customer" && (
          <Field label="Phone number">
            <input
              type="tel"
              required
              value={form.phone || ""}
              onChange={set("phone")}
              placeholder="+234 803 000 0000"
              className={inputCls}
            />
          </Field>
        )}

        {role === "merchant" && (
          <>
            <Field label="Business name" hint="Your registered / trading name.">
              <input
                type="text"
                required
                value={form.businessName || ""}
                onChange={set("businessName")}
                placeholder="Bola Ventures Ltd"
                className={inputCls}
              />
            </Field>
            <Field label="Store name" hint="What shoppers see on your storefront.">
              <input
                type="text"
                required
                value={form.storeName || ""}
                onChange={set("storeName")}
                placeholder="Bola Stores"
                className={inputCls}
              />
            </Field>
            <Field label="Phone number">
              <input
                type="tel"
                required
                value={form.phone || ""}
                onChange={set("phone")}
                placeholder="+234 803 000 0000"
                className={inputCls}
              />
            </Field>
            <Field label="Primary category">
              <select
                value={form.category || ""}
                onChange={set("category")}
                className={inputCls}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <p className="text-[12px] text-shop-text/70">
              You can add your pickup address and location later in Account
              settings.
            </p>
          </>
        )}

        {role === "partner" && (
          <>
            <Field
              label="Display name"
              hint="Shown on your storefront and referral links."
            >
              <input
                type="text"
                required
                value={form.displayName || ""}
                onChange={set("displayName")}
                placeholder="Ada Recommends"
                className={inputCls}
              />
            </Field>
            <p className="text-[12px] text-shop-text/70">
              Next you&apos;ll customise your storefront. You can add payout
              details any time from Account settings.
            </p>
          </>
        )}

        {formError && (
          <p className="text-[13px] font-medium text-red-600">{formError}</p>
        )}

        <button
          type="submit"
          disabled={completeState.isLoading}
          className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {completeState.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Finishing up…
            </>
          ) : (
            <>
              Enter dashboard <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingForm />
    </Suspense>
  );
}
