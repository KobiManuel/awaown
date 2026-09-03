"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Mail, User, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import FormField from "@/app/Components/Auth/FormField";
import OtpInput from "@/app/Components/Auth/OtpInput";
import { setSession } from "@/lib/store/authSlice";
import { markSignedIn } from "@/lib/session-cookie";
import { errorMessage } from "@/lib/api/errorMessage";
import {
  useRegisterMutation,
  useVerifyRegistrationMutation,
  useRequestLoginMutation,
  useVerifyLoginMutation,
  useResendOtpMutation,
} from "@/lib/api/authApi";

const DASHBOARD_HOME = {
  customer: "/dashboard",
  merchant: "/merchant",
  partner: "/partner",
  admin: "/admin",
};

const RESEND_COOLDOWN = 60;

/**
 * The whole passwordless flow for one dashboard:
 *   signup:  name + email -> code -> onboarding
 *   login:   email -> code -> dashboard (or onboarding if unfinished)
 */
export default function OtpAuthFlow({
  role,
  mode: initialMode = "login",
  eyebrow,
  title,
  subtitle,
  allowSignupToggle = true,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const search = useSearchParams();
  // Where to land after a successful login — a partner/product link that hit the
  // auth wall passes ?next=. Only honour same-origin paths.
  const nextParam = search.get("next");
  const nextDest =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : null;

  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [step, setStep] = useState("details"); // "details" | "code"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [register, registerState] = useRegisterMutation();
  const [verifyRegistration, verifyRegState] = useVerifyRegistrationMutation();
  const [requestLogin, requestLoginState] = useRequestLoginMutation();
  const [verifyLogin, verifyLoginState] = useVerifyLoginMutation();
  const [resendOtp, resendState] = useResendOtpMutation();

  const sending = registerState.isLoading || requestLoginState.isLoading;
  const verifying = verifyRegState.isLoading || verifyLoginState.isLoading;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resetToDetails = () => {
    setStep("details");
    setCode("");
    setFormError("");
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      if (mode === "signup") {
        await register({ role, fullName, email }).unwrap();
      } else {
        const res = await requestLogin({ role, email }).unwrap();
        if (res && res.exists === false) {
          setFormError(
            allowSignupToggle
              ? "We couldn't find an account for that email. Switch to sign up to create one."
              : "We couldn't find an account for that email.",
          );
          return;
        }
      }
      setStep("code");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const handleVerify = async (submitted) => {
    const value = submitted || code;
    if (value.length !== 6 || verifying) return;
    setFormError("");
    try {
      const data =
        mode === "signup"
          ? await verifyRegistration({ role, email, code: value }).unwrap()
          : await verifyLogin({ role, email, code: value }).unwrap();

      dispatch(setSession({ ...data, role }));
      // Tell the route guard (proxy.ts) this browser is signed into `role`
      // before navigating into a guarded shell — the API's own session cookie
      // is on a different domain and invisible to the middleware.
      markSignedIn(role);
      if (!data.onboardingComplete) {
        router.replace(
          nextDest
            ? `/onboarding/${role}?next=${encodeURIComponent(nextDest)}`
            : `/onboarding/${role}`,
        );
      } else {
        router.replace(nextDest || DASHBOARD_HOME[role]);
      }
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work. Try again."));
      setCode("");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendState.isLoading) return;
    setFormError("");
    try {
      await resendOtp({
        role,
        email,
        purpose: mode === "signup" ? "REGISTRATION" : "LOGIN",
      }).unwrap();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const isSignup = mode === "signup";

  return (
    <AuthLayout
      eyebrow={eyebrow}
      title={
        step === "code"
          ? "Enter your code"
          : title || (isSignup ? "Create your account" : "Sign in")
      }
      subtitle={
        step === "code"
          ? `We sent a 6-digit code to ${email}.`
          : subtitle
      }
    >
      {step === "details" ? (
        <form className="flex flex-col gap-5" onSubmit={handleSendCode}>
          {isSignup && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-shop-heading">
                Full name
              </span>
              <div className="flex items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3.5 py-3 focus-within:border-shop-accent-1 focus-within:ring-2 focus-within:ring-shop-accent-1-light">
                <User className="h-4 w-4 shrink-0 text-shop-text/50" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
                />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">
              Email address
            </span>
            <div className="flex items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3.5 py-3 focus-within:border-shop-accent-1 focus-within:ring-2 focus-within:ring-shop-accent-1-light">
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
              />
            </div>
          </label>

          {formError && (
            <p className="text-[13px] font-medium text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
              </>
            ) : (
              <>
                Continue with email <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {allowSignupToggle && (
            <p className="text-center text-[14px] text-shop-text">
              {isSignup ? "Already have an account? " : "New to AwaOwn? "}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignup ? "login" : "signup");
                  setFormError("");
                }}
                className="font-semibold text-shop-accent-1 hover:underline"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-5">
          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={handleVerify}
            disabled={verifying}
          />

          {formError && (
            <p className="text-[13px] font-medium text-red-600">{formError}</p>
          )}

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={code.length !== 6 || verifying}
            className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
              </>
            ) : (
              <>
                Verify <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={resetToDetails}
              className="flex items-center gap-1 text-shop-text hover:text-shop-heading"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendState.isLoading}
              className="font-medium text-shop-accent-1 hover:underline disabled:text-shop-text/50 disabled:no-underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-[13px] text-shop-text/70">
        <Link href="/" className="hover:underline">
          ← Back to AwaOwn
        </Link>
      </p>
    </AuthLayout>
  );
}
