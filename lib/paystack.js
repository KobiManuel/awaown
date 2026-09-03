// Paystack Inline v2 — loads the official script once and drives the popup so
// checkout and wallet top-up stay on the same page (no redirect) on desktop.
// A redirect fallback is only used if js.paystack.co is genuinely unreachable.

const SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

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
  popup.resumeTransaction(accessCode, {
    onSuccess: (tx) => onSuccess?.(tx),
    onCancel: () => onCancel?.(),
    onError: (e) => onError?.(e),
  });
  return "opened";
}
