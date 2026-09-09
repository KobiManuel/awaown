"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { setActiveStore, clearActiveStore } from "@/lib/store-context";

/**
 * Keeps the session-scoped "active store" in sync with the current route so the
 * product / cart / checkout pages only wear a partner store's theme while the
 * visitor is genuinely shopping that store:
 *
 *  - /store/<code>              -> that store
 *  - /product/<id>?ref=<code>   -> that store
 *  - /product/<id> (no ref),
 *    /cart, /dashboard/checkout -> keep whatever's active (mid-flow)
 *  - anywhere else              -> leave the store (clear)
 */
export default function StoreContextTracker() {
  const pathname = usePathname() || "/";
  const search = useSearchParams();
  const ref = search.get("ref");

  useEffect(() => {
    const storeMatch = pathname.match(/^\/store\/([^/]+)\/?$/);
    if (storeMatch) {
      setActiveStore(storeMatch[1].toUpperCase());
      return;
    }
    if (pathname.startsWith("/product/")) {
      if (ref) setActiveStore(ref.toUpperCase());
      return; // no ref -> stay with the current flow's store
    }
    if (pathname === "/cart" || pathname.startsWith("/dashboard/checkout")) {
      return; // carry the store through the buying flow
    }
    clearActiveStore();
  }, [pathname, ref]);

  return null;
}
