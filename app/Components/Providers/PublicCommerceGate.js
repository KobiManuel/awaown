"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";
import CommerceSync from "@/app/Components/Dashboard/CommerceSync";

// A signed-in merchant/partner/admin visiting the public site (e.g. clicking
// their own dashboard sidebar logo, which links to "/") still counts as a
// non-excluded route below. The auth slice holds one role/session at a time,
// so forcing a customer bootstrap here would flip `role` to "customer" and
// try to refresh a customer session that doesn't exist - clearing their
// actual merchant/partner/admin session out of memory until they navigate
// back and it silently re-authenticates. Skip the customer bootstrap
// entirely while one of those sessions is already active.
const DASHBOARD_ROLES = ["merchant", "partner", "admin"];

// Routes that run their own auth bootstrap / commerce sync (or must not touch
// the customer session at all).
const EXCLUDED = [
  "/dashboard",
  "/merchant",
  "/partner",
  "/admin",
  "/login",
  "/signup",
  "/onboarding",
  "/maintenance",
];

function PublicCommerce() {
  // Establish the customer session from the refresh cookie so the public header
  // knows who's signed in, then keep the Redux cart/wishlist mirror fresh -
  // otherwise "add to cart" from a product page updates the server but never the
  // header badge until the shopper opens their dashboard.
  useAuthBootstrap("customer");
  return <CommerceSync />;
}

export default function PublicCommerceGate() {
  const pathname = usePathname() || "/";
  const excluded = EXCLUDED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const activeRole = useSelector((s) => s.auth.role);
  const activeStatus = useSelector((s) => s.auth.status);
  const hasOtherDashboardSession =
    DASHBOARD_ROLES.includes(activeRole) && activeStatus === "authenticated";
  if (excluded || hasOtherDashboardSession) return null;
  return <PublicCommerce />;
}
