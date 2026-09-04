"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import OtpInput from "@/app/Components/Auth/OtpInput";
import { setSession } from "@/lib/store/authSlice";
import { markSignedIn } from "@/lib/session-cookie";
import { errorMessage } from "@/lib/api/errorMessage";
import {
  useAdminRequestLoginMutation,
  useAdminVerifyLoginMutation,
} from "@/lib/api/authApi";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const doneRef = useRef(false);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [requestLogin, requestState] = useAdminRequestLoginMutation();
  const [verifyLogin, verifyState] = useAdminVerifyLoginMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendCode = async (e) => {
    e?.preventDefault();
    setFormError("");
    try {
      const res = await requestLogin({ email }).unwrap();
      if (res && res.exists === false) {
        setFormError(
          "That email isn't authorised for the admin panel. Ask a Super Admin to add you to the team.",
        );
        return;
      }
      setStep("code");
      setCooldown(60);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const verify = async (submitted) => {
    const value = submitted || code;
    if (value.length !== 6 || verifyState.isLoading || doneRef.current) return;
    setFormError("");
    try {
      const data = await verifyLogin({ email, code: value }).unwrap();
      doneRef.current = true;
      dispatch(setSession({ ...data, role: "admin" }));
      // Let proxy.ts know this browser is signed into the admin dashboard
      // (the API session cookie is on another domain), then do a full
      // navigation so that cookie is sent with the request the guard sees.
      markSignedIn("admin");
      window.location.assign("/admin");
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work."));
      setCode("");
    }
  };

  return (
    <AuthLayout
      eyebrow="Admin"
      title={step === "code" ? "Enter your code" : "Sign in to the admin panel"}
      subtitle={
        step === "code"
          ? `We sent a 6-digit code to ${email}.`
          : "Restricted access — AwaOwn staff only. Accounts are provisioned, not self-registered."
      }
    >
      {step === "email" ? (
        <form className="flex flex-col gap-5" onSubmit={sendCode}>
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
                placeholder="you@awaown.com"
                className="w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40"
              />
            </div>
          </label>
          {formError && (
            <p className="text-[13px] font-medium text-red-600">{formError}</p>
          )}
          <button
            type="submit"
            disabled={requestState.isLoading}
            className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {requestState.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-5">
          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={verify}
            disabled={verifyState.isLoading}
          />
          {formError && (
            <p className="text-[13px] font-medium text-red-600">{formError}</p>
          )}
          <button
            type="button"
            onClick={() => verify()}
            disabled={code.length !== 6 || verifyState.isLoading}
            className="flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {verifyState.isLoading ? (
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
              onClick={() => {
                setStep("email");
                setCode("");
                setFormError("");
              }}
              className="flex items-center gap-1 text-shop-text hover:text-shop-heading"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change email
            </button>
            <button
              type="button"
              onClick={sendCode}
              disabled={cooldown > 0 || requestState.isLoading}
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
