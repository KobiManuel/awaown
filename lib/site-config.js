// Single source of truth for the deployed site's base URL — used to build
// shareable links (partner referral links, SEO canonicals, OpenGraph), so they
// point at wherever this is actually deployed.
//   - production: NEXT_PUBLIC_SITE_URL=https://awaown.com (set on Vercel)
//   - local dev:  set NEXT_PUBLIC_SITE_URL=https://awaown-fe.vercel.app in
//                 .env.local so shared links resolve to a reachable deployment
//   - fallback:   the live domain, never the old awaown-ten placeholder
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://awaown.com"
).replace(/\/+$/, "");
