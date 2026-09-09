"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import AuthLayout from "@/app/Components/Auth/AuthLayout";
import OtpInput from "@/app/Components/Auth/OtpInput";
import PasswordChecklist from "@/app/Components/Auth/PasswordChecklist";
import { setSession } from "@/lib/store/authSlice";
import { markSignedIn } from "@/lib/session-cookie";
import { passwordOk } from "@/lib/password-rules";
import { errorMessage } from "@/lib/api/errorMessage";
import {
  useAdminLoginPasswordMutation,
  useAdminForgotPasswordMutation,
  useAdminCheckResetCodeMutation,
  useAdminResetPasswordMutation,
} from "@/lib/api/authApi";

const wrap =
  "flex items-center gap-2 rounded-[8px] border border-shop-border bg-white px-3.5 py-3 focus-within:border-shop-accent-1 focus-within:ring-2 focus-within:ring-shop-accent-1-light";
const inputCls =
  "w-full bg-transparent text-[14px] text-shop-heading outline-none placeholder:text-shop-text/40";
const btn =
  "flex items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-70";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const doneRef = useRef(false);
  const [view, setView] = useState("signin"); // signin | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [codeVerified, setCodeVerified] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [login, loginState] = useAdminLoginPasswordMutation();
  const [forgot, forgotState] = useAdminForgotPasswordMutation();
  const [checkCode, checkCodeState] = useAdminCheckResetCodeMutation();
  const [reset, resetState] = useAdminResetPasswordMutation();
  const busy = loginState.isLoading || forgotState.isLoading || resetState.isLoading;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const finish = (data) => {
    doneRef.current = true;
    dispatch(setSession({ ...data, role: "admin" }));
    markSignedIn("admin");
    window.location.assign("/admin");
  };

  // Clear a lingering server-side error (e.g. "found in a data breach") as
  // soon as the admin starts typing a new password, instead of leaving it
  // stuck on screen until the next submit.
  const updatePassword = (e) => {
    setPassword(e.target.value);
    setFormError("");
  };

  const signin = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      finish(await login({ email, password, rememberMe }).unwrap());
    } catch (err) {
      setFormError(errorMessage(err, "Incorrect email or password."));
    }
  };

  const sendCode = async (e) => {
    e?.preventDefault?.();
    setFormError("");
    try {
      await forgot({ email }).unwrap();
      setCooldown(60);
      setCodeVerified(false);
      setNotice(`If ${email} is an admin account, a code is on its way.`);
      setView("reset");
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  const updateResetCode = (v) => {
    setCode(v);
    if (codeVerified) setCodeVerified(false);
    setFormError("");
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setFormError("");
    if (code.length !== 6) return setFormError("Enter the 6-digit code.");
    try {
      await checkCode({ email, code }).unwrap();
      setCodeVerified(true);
      setNotice("Code confirmed - now set your password.");
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work."));
    }
  };

  const doReset = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!codeVerified || code.length !== 6)
      return setFormError("Confirm your code first.");
    if (!passwordOk(password))
      return setFormError("Meet all the password requirements below.");
    try {
      finish(await reset({ email, code, password }).unwrap());
    } catch (err) {
      setFormError(errorMessage(err, "That code didn't work."));
    }
  };

  const heading =
    view === "signin"
      ? { t: "Sign in to the admin panel", s: "Restricted access. AwaOwn staff only." }
      : view === "forgot"
        ? { t: "Set / reset your password", s: "Enter your admin email and we'll send a code." }
        : { t: "Set your password", s: notice };

  return (
    <AuthLayout eyebrow="Admin" title={heading.t} subtitle={heading.s}>
      {view === "signin" && (
        <form className="flex flex-col gap-4" onSubmit={signin}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Email address</span>
            <div className={wrap}>
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                className={inputCls}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Password</span>
            <div className={wrap}>
              <Lock className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={updatePassword}
                autoComplete="current-password"
                placeholder="Your password"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="shrink-0 text-shop-text/50 hover:text-shop-heading"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-shop-text">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#6d28d9]"
            />
            Keep me signed in on this device
          </label>
          {formError && <p className="text-[13px] font-medium text-red-600">{formError}</p>}
          <button type="submit" disabled={busy} className={btn}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
          <button
            type="button"
            onClick={() => {
              setView("forgot");
              setFormError("");
            }}
            className="text-center text-[13px] font-medium text-shop-accent-1 hover:underline"
          >
            First time here, or forgot your password? Set / reset it
          </button>
        </form>
      )}

      {view === "forgot" && (
        <form className="flex flex-col gap-4" onSubmit={sendCode}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">Admin email</span>
            <div className={wrap}>
              <Mail className="h-4 w-4 shrink-0 text-shop-text/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                className={inputCls}
              />
            </div>
          </label>
          {formError && <p className="text-[13px] font-medium text-red-600">{formError}</p>}
          <button type="submit" disabled={busy} className={btn}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send code <ArrowRight className="h-4 w-4" /></>}
          </button>
          <button
            type="button"
            onClick={() => setView("signin")}
            className="flex items-center justify-center gap-1 text-[13px] text-shop-text hover:text-shop-heading"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </form>
      )}

      {view === "reset" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={codeVerified ? doReset : verifyCode}
        >
          <p className="rounded-[8px] bg-shop-accent-1-light px-3 py-2 text-[12.5px] text-shop-accent-1">
            {notice}
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-shop-heading">6-digit code</span>
            <OtpInput
              value={code}
              onChange={updateResetCode}
              disabled={busy || checkCodeState.isLoading}
            />
          </label>

          {!codeVerified ? (
            <button
              type="submit"
              disabled={checkCodeState.isLoading || code.length !== 6}
              className={btn}
            >
              {checkCodeState.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Confirm code <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          ) : (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-shop-heading">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3 w-3" />
                  </span>
                  New password
                </span>
                <div className={wrap}>
                  <Lock className="h-4 w-4 shrink-0 text-shop-text/50" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={updatePassword}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="shrink-0 text-shop-text/50 hover:text-shop-heading"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordChecklist value={password} className="mt-1" />
              </label>
              <button
                type="submit"
                disabled={busy || !passwordOk(password)}
                className={btn}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set password & sign in"}
              </button>
            </>
          )}
          {formError && <p className="text-[13px] font-medium text-red-600">{formError}</p>}
          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="flex items-center gap-1 text-shop-text hover:text-shop-heading"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={sendCode}
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
