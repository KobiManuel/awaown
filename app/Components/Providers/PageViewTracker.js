"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api/baseApi";

const VISITOR_KEY = "awaown_visitor_id";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
