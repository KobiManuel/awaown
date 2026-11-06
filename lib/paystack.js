"use client";

import { useEffect } from "react";

// Paystack Inline v2. Loads the official script once and drives the popup so
// checkout and wallet top-up stay on the same page (no redirect) on desktop.
// A redirect fallback is only used if js.paystack.co is genuinely unreachable.
//
// CHECKOUT_MODE below switches the *primary* flow to a full redirect to
// Paystack's hosted checkout page instead - every call site goes through
// startPaystackCheckout() rather than calling openPaystackPopup() directly,
// so flipping this one constant is the entire rollback if redirect turns out
// to be worse for conversion/UX. Nothing below it needs to change either way.

const SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

export const CHECKOUT_MODE = "redirect"; // "redirect" | "inline"

export function loadPaystack() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Paystack can only load in the browser"));
      return;
    }
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }
    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () =>
        window.PaystackPop
          ? resolve(window.PaystackPop)
          : reject(new Error("PaystackPop missing after load")),
      );
      existing.addEventListener("error", () =>
        reject(new Error("Paystack script failed to load")),
      );
      return;
    }
    const s = document.createElement("script");
    s.id = "paystack-inline-js";
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () =>
      window.PaystackPop
        ? resolve(window.PaystackPop)
        : reject(new Error("PaystackPop missing after load"));
    s.onerror = () => reject(new Error("Paystack script failed to load"));
    document.body.appendChild(s);
  });
}

// How long to wait for Paystack's own popup to call back before giving up on
// it. Covers a stuck bank OTP/3-D Secure step inside Paystack's iframe - a
// known Inline failure mode where it never fires onSuccess/onCancel/onError
// at all, leaving the caller's "Placing your order..." state spinning
// forever with no way out (see the 2026-10-22 "screen froze" customer
// reports - confirmed via Paystack's own API that those orders were
// genuinely never charged, i.e. abandoned inside the popup, not a lost
// webhook).
const CALLBACK_TIMEOUT_MS = 2 * 60 * 1000;

/**
 * Resume a server-created transaction in the inline popup.
 *
 * @returns {Promise<"opened"|"redirected">} "opened" once the popup is showing,
 *   "redirected" if we had to fall back to the hosted checkout page.
 */
export async function openPaystackPopup({
  accessCode,
  fallbackUrl,
  onSuccess,
  onCancel,
  onError,
  timeoutMs = CALLBACK_TIMEOUT_MS,
}) {
  let PaystackPop;
  try {
    PaystackPop = await loadPaystack();
  } catch (err) {
    console.error("Paystack inline unavailable, using redirect:", err);
    if (fallbackUrl) window.location.href = fallbackUrl;
    return "redirected";
  }
  const popup = new PaystackPop();

  // Only the first of (success, cancel, error, timeout) counts - once one
  // fires, ignore anything that arrives after (a late real callback racing
  // the timeout, or vice versa).
  let settled = false;
  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    // Best-effort - Inline v2 doesn't document a public close/dismiss
    // method, so this is defensive rather than relied on.
    try {
      popup.close?.();
    } catch {
      // ignore
    }
    onError?.(
      new Error(
        "Still waiting on a response from Paystack. If you weren't charged, you can try again.",
      ),
    );
  }, timeoutMs);

  popup.resumeTransaction(accessCode, {
    onSuccess: (tx) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      onSuccess?.(tx);
    },
    onCancel: () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      onCancel?.();
    },
    onError: (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      onError?.(e);
    },
  });
  return "opened";
}

/**
 * Starts a Paystack payment the way CHECKOUT_MODE says to - the one place
 * every checkout/top-up call site should go through instead of calling
 * openPaystackPopup() or window.location.href directly, so the inline/
 * redirect choice lives in exactly one spot.
 *
 * In "redirect" mode this just sends the browser to Paystack's hosted page.
 * The caller must save whatever its callback page will need (order
 * reference, guest phone, etc.) to sessionStorage *before* calling this,
 * since the page is about to unload.
 *
 * In "inline" mode it's the old popup-with-fallback behaviour, unchanged.
 *
 * @returns {Promise<"redirected"|"opened"|"errored">}
 */
export async function startPaystackCheckout({
  accessCode,
  authorizationUrl,
  onSuccess,
  onCancel,
  onError,
}) {
  if (CHECKOUT_MODE === "redirect") {
    if (!authorizationUrl) {
      onError?.(new Error("Payment could not be started."));
      return "errored";
    }
    window.location.href = authorizationUrl;
    return "redirected";
  }
  return openPaystackPopup({
    accessCode,
    fallbackUrl: authorizationUrl,
    onSuccess,
    onCancel,
    onError,
  });
}

/**
 * A full-page redirect to Paystack never unmounts the checkout page - it
 * just navigates away. If the shopper cancels (or just hits "back") on
 * Paystack's hosted page, the browser restores this exact page from bfcache
 * with whatever "Placing your order…" state it had right before the
 * redirect, since nothing ever re-ran to reset it. Only relevant in
 * CHECKOUT_MODE "redirect" - the old inline popup never left the page, so
 * its onCancel/onError callbacks always fired instead.
 *
 * Call with whatever puts the page back in its idle state, e.g.:
 *   usePaystackReturnReset(() => setBusy(false));
 */
export function usePaystackReturnReset(onReturn) {
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) onReturn();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [onReturn]);
}
