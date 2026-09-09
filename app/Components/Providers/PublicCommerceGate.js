"use client";

import { usePathname } from "next/navigation";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";
import CommerceSync from "@/app/Components/Dashboard/CommerceSync";

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
  if (excluded) return null;
  return <PublicCommerce />;
}
