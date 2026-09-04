"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, Loader2, Check, Eye, EyeOff } from "lucide-react";
import PasswordChecklist from "@/app/Components/Auth/PasswordChecklist";
import { passwordOk } from "@/lib/password-rules";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import {
  useChangePasswordMutation,
  useSetLoginMethodMutation,
} from "@/lib/api/authApi";
import { errorMessage } from "@/lib/api/errorMessage";

const field =
  "w-full rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";

function PwInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${field} pr-9`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-shop-text/50 hover:text-shop-heading"
        aria-label={show ? "Hide" : "Show"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/**
 * "Login & security" — shown on every customer/merchant/partner account page.
 * Choose password vs email-code sign-in, and set/change the password.
 */
export default function LoginSecurityCard() {
  const showToast = useToast();
  const authMethod = useSelector((s) => s.auth.user?.authMethod ?? "otp");
  const hasPassword = useSelector((s) => !!s.auth.user?.hasPassword);

  const [changePassword, changeState] = useChangePasswordMutation();
  const [setLoginMethod, methodState] = useSetLoginMethodMutation();

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const usingPassword = authMethod === "password";

  const savePassword = async () => {
    if (!passwordOk(next)) {
      showToast("The new password doesn't meet the requirements");
      return;
    }
    try {
      await changePassword({
        ...(hasPassword ? { currentPassword: current } : {}),
        newPassword: next,
      }).unwrap();
      showToast(hasPassword ? "Password updated" : "Password set");
      setOpen(false);
      setCurrent("");
      setNext("");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const switchMethod = async (method) => {
    if (method === "password" && !hasPassword) {
      setOpen(true);
      showToast("Set a password first");
      return;
    }
    try {
      await setLoginMethod({ method }).unwrap();
      showToast(
        method === "password"
          ? "You'll sign in with your password from now on"
          : "You'll sign in with an emailed code from now on",
      );
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-4 lg:mx-0">
      <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-shop-heading">
        <ShieldCheck className="h-4 w-4 text-shop-accent-1" />
        Login &amp; security
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-[11.5px] text-shop-text/70">How you sign in</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => switchMethod("password")}
            disabled={methodState.isLoading}
            className={`flex flex-col items-start gap-0.5 rounded-[10px] border p-2.5 text-left text-[12px] transition-colors ${
              usingPassword
                ? "border-shop-accent-1 bg-shop-accent-1-light"
                : "border-shop-border"
            }`}
          >
            <span className="flex items-center gap-1 font-semibold text-shop-heading">
              {usingPassword && <Check className="h-3.5 w-3.5 text-shop-accent-1" />}
              Password
            </span>
            <span className="text-shop-text/70">Email + your password</span>
          </button>
          <button
            type="button"
            onClick={() => switchMethod("otp")}
            disabled={methodState.isLoading}
            className={`flex flex-col items-start gap-0.5 rounded-[10px] border p-2.5 text-left text-[12px] transition-colors ${
              !usingPassword
                ? "border-shop-accent-1 bg-shop-accent-1-light"
                : "border-shop-border"
            }`}
          >
            <span className="flex items-center gap-1 font-semibold text-shop-heading">
              {!usingPassword && <Check className="h-3.5 w-3.5 text-shop-accent-1" />}
              Email code
            </span>
            <span className="text-shop-text/70">A one-time code each time</span>
          </button>
        </div>
      </div>

      <div className="border-t border-shop-border pt-3">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[12.5px] font-semibold text-shop-accent-1 hover:underline"
          >
            {hasPassword ? "Change password" : "Set a password"}
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            {hasPassword && (
              <PwInput
                value={current}
                onChange={setCurrent}
                placeholder="Current password"
                autoComplete="current-password"
              />
            )}
            <PwInput
              value={next}
              onChange={setNext}
              placeholder="New password"
              autoComplete="new-password"
            />
            <PasswordChecklist value={next} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={savePassword}
                disabled={changeState.isLoading || !passwordOk(next)}
                className="flex items-center gap-1.5 rounded-[8px] bg-shop-accent-1 px-3.5 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
              >
                {changeState.isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCurrent("");
                  setNext("");
                }}
                className="rounded-[8px] border border-shop-border px-3.5 py-2 text-[12px] font-semibold text-shop-heading"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
