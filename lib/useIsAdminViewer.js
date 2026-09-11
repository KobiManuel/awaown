"use client";

import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";

/**
 * True once an already-signed-in admin's session resolves, for public pages
 * (like /about) that want to offer an admin-only edit affordance without
 * gating the page itself behind login the way AppFrame does for /admin/*.
 * Silently resolves to false for every other visitor - a failed admin
 * session refresh is expected and not shown as an error.
 */
export function useIsAdminViewer() {
  const { authed } = useAuthBootstrap("admin");
  return authed;
}
