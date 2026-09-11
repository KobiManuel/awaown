// Single source of truth for the deployed site's base URL, used to build
// shareable links (partner referral links, SEO canonicals, OpenGraph), so they
// point at wherever this is actually deployed.
//   - production: NEXT_PUBLIC_SITE_URL=https://awaown.com (set on Vercel)
//   - local dev:  set NEXT_PUBLIC_SITE_URL=https://awaown-fe.vercel.app in
//                 .env.local so shared links resolve to a reachable deployment
//   - fallback:   the live domain, never the old awaown-ten placeholder
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://awaown.com"
).replace(/\/+$/, "");

// AwaOwn's own support line - shown wherever the platform lists a phone
// number, and used to build the WhatsApp deep link.
export const SUPPORT_PHONE_DISPLAY = "+234 911 161 1113";
export const SUPPORT_PHONE_INTL = "2349111611113"; // wa.me / tel: form, no leading +
export const WHATSAPP_URL = `https://wa.me/${SUPPORT_PHONE_INTL}`;
