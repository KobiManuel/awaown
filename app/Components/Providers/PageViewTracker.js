"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api/baseApi";

const VISITOR_KEY = "awaown_visitor_id";

// Internal/staff-only areas - a person managing the platform is not "traffic",
// so counting these here would inflate Visits/Unique Visitors with our own
// admin, merchant and partner dashboard usage instead of real shopper activity.
const EXCLUDED_PREFIXES = ["/admin", "/dashboard", "/merchant", "/partner", "/login"];

function isExcludedPath(pathname) {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

/**
 * Fires a lightweight page-view beacon on every route change, for the
 * /admin/analytics dashboard. Deliberately independent of the Redux auth
 * slice (plain fetch, no dispatch) - see PublicWhatsAppButton/AboutImageSlot
 * history for why a tracker like this must never touch shared auth state.
 * Best-effort: a failed beacon is silently dropped, never surfaced.
 */
export default function PageViewTracker() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const visitorIdRef = useRef(null);

  useEffect(() => {
    if (isExcludedPath(pathname)) return;
    if (!visitorIdRef.current) visitorIdRef.current = getVisitorId();
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    fetch(`${API_URL}/storefront/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        visitorId: visitorIdRef.current,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
