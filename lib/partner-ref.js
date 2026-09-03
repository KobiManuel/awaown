// Partner referral attribution that survives a page reload and the login redirect.
// A partner link is /product/<slug>?ref=<CODE> (or /store/<CODE>). We stash the
// code in a 30-day cookie the moment it's seen, and the cart/checkout flow reads
// it back so the sale is credited even if the visitor signs up in between.

const KEY = "awaown_ref";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function rememberRef(code) {
  if (!code || typeof document === "undefined") return;
  try {
    document.cookie = `${KEY}=${encodeURIComponent(code)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  } catch {
    // ignore (cookies disabled)
  }
}

export function readRef() {
  if (typeof document === "undefined") return null;
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${KEY}=([^;]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

export function clearRef() {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${KEY}=; path=/; max-age=0`;
  } catch {
    // ignore
  }
}
