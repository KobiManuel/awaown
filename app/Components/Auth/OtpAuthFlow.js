"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Mail,
  User,
  Lock,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import OtpInput from "@/app/Components/Auth/OtpInput";
import PasswordChecklist from "@/app/Components/Auth/PasswordChecklist";
import { setSession } from "@/lib/store/authSlice";
import { markSignedIn } from "@/lib/session-cookie";
import { passwordOk } from "@/lib/password-rules";
import { errorMessage } from "@/lib/api/errorMessage";
import {
  useRegisterMutation,
  useVerifyRegistrationMutation,
  useLoginPasswordMutation,
  useRequestLoginMutation,
  useVerifyLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendOtpMutation,
} from "@/lib/api/authApi";

const DASHBOARD_HOME = {
  customer: "/dashboard",
  merchant: "/merchant",
  partner: "/partner",
  admin: "/admin",
};

const RESEND_COOLDOWN = 60;

const fieldWrap =
  "flex items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3.5 py-3 focus-within:border-shop-accent-1 focus-within:ring-2 focus-within:ring-shop-accent-1-light";
const fieldInput =
  "w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40";
const primaryBtn =
  "flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70";

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className={fieldWrap}>
      <Lock className="h-4 w-4 shrink-0 text-shop-text/50" />
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={fieldInput}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="shrink-0 text-shop-text/50 hover:text-shop-heading"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/**
 * Auth for one dashboard. Password is the default; email-code (OTP) is offered
 * for accounts that chose it. Views: signin · signup · verify (email) · code
 * (OTP login) · forgot · reset.
 */
export default function OtpAuthFlow({
  role,
  mode: initialMode = "login",
  eyebrow,
  title,
  subtitle,
  allowSignupToggle = true,
}) {
  const dispatch = useDispatch();
  const search = useSearchParams();
  const nextParam = search.get("next");
  const nextDest =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : null;

  const [view, setView] = useState(initialMode === "signup" ? "signup" : "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pendingData, setPendingData] = useState(null);
  const doneRef = useRef(false);

  const [register, registerState] = useRegisterMutation();
  const [verifyRegistration, verifyRegState] = useVerifyRegistrationMutation();
  const [loginPassword, loginPwState] = useLoginPasswordMutation();
  const [requestLogin, requestLoginState] = useRequestLoginMutation();
  const [verifyLogin, verifyLoginState] = useVerifyLoginMutation();
  const [forgotPassword, forgotState] = useForgotPasswordMutation();
  const [resetPassword, resetState] = useResetPasswordMutation();
  const [changePassword, changePwState] = useChangePasswordMutation();
  const [resendOtp, resendState] = useResendOtpMutation();

  const busy =
    registerState.isLoading ||
    loginPwState.isLoading ||
    requestLoginState.isLoading ||
    forgotState.isLoading ||
    resetState.isLoading;
  const verifying = verifyRegState.isLoading || verifyLoginState.isLoading;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const go = (v) => {
    setView(v);
    setFormError("");
    setNotice("");
    setCode("");
  };

  // Password fields keep a server-side error (e.g. "found in a data breach")
  // visible until the user acts on it — clear it as soon as they start typing
  // a new value, same as any other form validation error would.
  const updatePassword = (v) => {
    setPassword(v);
    setFormError("");
  };

  // Navigate into the app after any successful auth.
  const finish = (data) => {
    doneRef.current = true;
    dispatch(setSession({ ...data, role }));
    markSignedIn(role);
    const dest = !data.onboardingComplete
      ? nextDest
        ? `/onboarding/${role}?next=${encodeURIComponent(nextDest)}`
        : `/onboarding/${role}`
      : nextDest || DASHBOARD_HOME[role];
    window.location.assign(dest);
  };

  // ── password sign in ──────────────────────────────────────────────
  const submitSignin = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const data = await loginPassword({ role, email, password }).unwrap();
      finish(data);
    } catch (err) {
      if (err?.status === 409) {
        // account uses email codes — send one and switch to the code view
        try {
          await requestLogin({ role, email }).unwrap();
        } catch {
          /* ignore — generic anyway */
        }
        setCooldown(RESEND_COOLDOWN);
        setNotice(
          "This account signs in with an email code — we've just sent you one.",
        );
        setView("code");
        return;
      }
      setFormError(errorMessage(err, "Incorrect email or password."));
    }
  };

  // ── sign up ───────────────────────────────────────────────────────
  const submitSignup = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!passwordOk(password)) {
      setFormError("Please meet all the password requirements below.");
      return;
    }
    try {
      await register({ role, fullName, email, password }).unwrap();
      setCooldown(RESEND_COOLDOWN);
      setNotice(`We sent a 6-digit code to ${email} to confirm it's yours.`);
      setView("verify");
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  // ── forgot password ───────────────────────────────────────────────
  const submitForgot = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await forgotPassword({ role, email }).unwrap();
      setCooldown(RESEND_COOLDOWN);
      setNotice(
        `If an account exists for ${email}, we've sent a reset code to it.`,
      );
      setView("reset");
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setFormError("");
    if (code.length !== 6) return setFormError("Enter the 6-digit code.");
    if (!passwordOk(password)) {
      setFormError("Please meet all the password requirements below.");
      return;
    }
    try {
      const data = await resetPassword({
        role,
        email,
        code,
        password,
      }).unwrap();
      finish(data);
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work. Try again."));
    }
  };

  // ── code entry (signup verify / OTP login) ────────────────────────
  const handleVerify = async (submitted) => {
    const value = submitted || code;
    if (value.length !== 6 || verifying || doneRef.current) return;
    setFormError("");
    try {
      const data =
        view === "verify"
          ? await verifyRegistration({ role, email, code: value }).unwrap()
          : await verifyLogin({ role, email, code: value }).unwrap();

      // Accounts from before password sign-in existed have no password yet —
      // catch that here (only possible on an OTP login, never after signup,
      // which always sets one) and have them set one before continuing in.
      if (view === "code" && data?.user && data.user.hasPassword === false) {
        doneRef.current = true;
        dispatch(setSession({ ...data, role })); // authenticates this session
        setPendingData(data);
        setPassword("");
        go("setpw");
        return;
      }
      finish(data);
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work. Try again."));
      setCode("");
    }
  };

  const submitSetPassword = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!passwordOk(password)) {
      setFormError("Please meet all the password requirements below.");
      return;
    }
    try {
      await changePassword({ newPassword: password }).unwrap();
      finish(pendingData);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendState.isLoading) return;
    setFormError("");
    try {
      await resendOtp({
        role,
        email,
        purpose: view === "verify" ? "REGISTRATION" : "LOGIN",
      }).unwrap();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const headings = {
    signin: { t: title || "Sign in", s: subtitle },
    signup: { t: "Create your account", s: subtitle },
    verify: { t: "Confirm your email", s: notice },
    code: { t: "Enter your code", s: notice || `We sent a code to ${email}.` },
    forgot: {
      t: "Reset your password",
      s: "We'll email you a code to set a new one.",
    },
    reset: { t: "Set a new password", s: notice },
    setpw: {
      t: "Set a password",
      s: "This account doesn't have one yet — set one so you can sign in faster next time.",
    },
  };
  const h = headings[view];

  const Err = () =>
    formError ? (
      <p className="text-[13px] font-medium text-red-600">{formError}</p>
    ) : null;
  const Notice = () =>
    notice && (view === "signin" || view === "code") ? (
      <p className="rounded-[8px] bg-shop-accent-1-light px-3 py-2 text-[12.5px] text-shop-accent-1">
        {notice}
      </p>
    ) : null;

  return (
    <AuthLayout eyebrow={eyebrow} title={h.t} subtitle={h.s}>
      {/* ── sign in ── */}
      {view === "signin" && (
        <form className="flex flex-col gap-4" onSubmit={submitSignin}>
          <Notice />
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Email address</span>
            <div className={fieldWrap}>
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldInput}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-shop-heading">Password</span>
              <button
                type="button"
                onClick={() => go("forgot")}
                className="text-[12px] font-medium text-shop-accent-1 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              value={password}
              onChange={updatePassword}
              autoComplete="current-password"
              placeholder="Your password"
            />
          </label>
          <Err />
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
          {allowSignupToggle && (
            <p className="text-center text-[14px] text-shop-text">
              New to AwaOwn?{" "}
              <button
                type="button"
                onClick={() => go("signup")}
                className="font-semibold text-shop-accent-1 hover:underline"
              >
                Create an account
              </button>
            </p>
          )}
        </form>
      )}

      {/* ── sign up ── */}
      {view === "signup" && (
        <form className="flex flex-col gap-4" onSubmit={submitSignup}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Full name</span>
            <div className={fieldWrap}>
              <User className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Doe"
                className={fieldInput}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Email address</span>
            <div className={fieldWrap}>
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldInput}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Password</span>
            <PasswordInput
              value={password}
              onChange={updatePassword}
              autoComplete="new-password"
              placeholder="Create a password"
            />
            <PasswordChecklist value={password} className="mt-1" />
          </label>
          <Err />
          <button
            type="submit"
            disabled={busy || !passwordOk(password)}
            className={primaryBtn}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-center text-[14px] text-shop-text">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => go("signin")}
              className="font-semibold text-shop-accent-1 hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* ── code entry (email verify or OTP login) ── */}
      {(view === "verify" || view === "code") && (
        <div className="flex flex-col gap-5">
          <Notice />
          <OtpInput value={code} onChange={setCode} onComplete={handleVerify} disabled={verifying} />
          <Err />
          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={code.length !== 6 || verifying}
            className={primaryBtn}
          >
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify <ArrowRight className="h-4 w-4" /></>}
          </button>
          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={() => go(view === "verify" ? "signup" : "signin")}
              className="flex items-center gap-1 text-shop-text hover:text-shop-heading"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
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

      {/* ── set a password (legacy code-only accounts, on their way in) ── */}
      {view === "setpw" && (
        <form className="flex flex-col gap-4" onSubmit={submitSetPassword}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Password</span>
            <PasswordInput
              value={password}
              onChange={updatePassword}
              autoComplete="new-password"
              placeholder="Create a password"
            />
            <PasswordChecklist value={password} className="mt-1" />
          </label>
          <Err />
          <button
            type="submit"
            disabled={changePwState.isLoading || !passwordOk(password)}
            className={primaryBtn}
          >
            {changePwState.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Set password &amp; continue <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
          <button
            type="button"
            onClick={() => finish(pendingData)}
            className="text-center text-[12.5px] text-shop-text/70 hover:text-shop-heading hover:underline"
          >
            Skip for now
          </button>
        </form>
      )}

      {/* ── forgot ── */}
      {view === "forgot" && (
        <form className="flex flex-col gap-4" onSubmit={submitForgot}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Email address</span>
            <div className={fieldWrap}>
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldInput}
              />
            </div>
          </label>
          <Err />
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset code <ArrowRight className="h-4 w-4" /></>}
          </button>
          <button
            type="button"
            onClick={() => go("signin")}
            className="flex items-center justify-center gap-1 text-[13px] text-shop-text hover:text-shop-heading"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </form>
      )}

      {/* ── reset ── */}
      {view === "reset" && (
        <form className="flex flex-col gap-4" onSubmit={submitReset}>
          {notice && (
            <p className="rounded-[8px] bg-shop-accent-1-light px-3 py-2 text-[12.5px] text-shop-accent-1">
              {notice}
            </p>
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">6-digit code</span>
            <OtpInput value={code} onChange={setCode} disabled={busy} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">New password</span>
            <PasswordInput
              value={password}
              onChange={updatePassword}
              autoComplete="new-password"
              placeholder="Create a new password"
            />
            <PasswordChecklist value={password} className="mt-1" />
          </label>
          <Err />
          <button
            type="submit"
            disabled={busy || code.length !== 6 || !passwordOk(password)}
            className={primaryBtn}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Set password &amp; sign in</>}
          </button>
          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={() => go("forgot")}
              className="flex items-center gap-1 text-shop-text hover:text-shop-heading"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={async () => {
                if (cooldown > 0) return;
                await submitForgot({ preventDefault() {} });
              }}
              disabled={cooldown > 0}
              className="font-medium text-shop-accent-1 hover:underline disabled:text-shop-text/50 disabled:no-underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 text-center text-[13px] text-shop-text/70">
        <Link href="/" className="hover:underline">
          ← Back to AwaOwn
        </Link>
      </p>
    </AuthLayout>
  );
}
