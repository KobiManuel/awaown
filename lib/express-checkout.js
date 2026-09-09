"use client";

// "Buy Now" bypasses the cart: the chosen item is stashed here (per tab) and the
// checkout page reads it instead of the cart, so nothing lands in the shopper's
// cart. sessionStorage survives the login redirect in the same tab.

const KEY = "awaown_buynow";

export function setBuyNow(item) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...item, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function readBuyNow() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    // stale after 30 min
    if (!v?.productId || Date.now() - (v.ts || 0) > 30 * 60 * 1000) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

export function clearBuyNow() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
