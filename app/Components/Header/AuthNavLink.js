"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { User } from "lucide-react";

const DASHBOARD_HOME = {
  customer: "/dashboard",
  merchant: "/merchant",
  partner: "/partner",
};

// MerchantProfile and PartnerProfile use different field names for their logo.
const LOGO_FIELD = {
  merchant: "logoUrl",
  partner: "profileImageUrl",
};

/**
 * The marketing site's "Login" link - except once a customer/merchant/partner
 * is actually signed in, there's nothing to log into anymore. Swaps to a
 * circular avatar (their store logo if they have one, a generic user icon
 * otherwise) that takes them straight to their dashboard instead.
 */
export default function AuthNavLink({ variant = "bar", className = "", onClick }) {
  const status = useSelector((s) => s.auth.status);
  const role = useSelector((s) => s.auth.role);
  const profile = useSelector((s) => s.auth.profile);

  const dashboardHref = DASHBOARD_HOME[role];
  const authed = status === "authenticated" && dashboardHref;

  if (!authed) {
    return (
      <Link
        href="/login"
        onClick={onClick}
        className={
          variant === "menu"
            ? `w-full py-2 text-center text-[14px] font-semibold text-shop-heading ${className}`
            : `px-2 hover:text-shop-accent-1 ${className}`
        }
      >
        Login
      </Link>
    );
  }

  const logoField = LOGO_FIELD[role];
  const logo = logoField ? profile?.[logoField] : null;

  const avatar = (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-shop-accent-1-light">
      {logo ? (
        <Image src={logo} alt="" fill className="object-cover" sizes="32px" />
      ) : (
        <User className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
      )}
    </span>
  );

  if (variant === "menu") {
    return (
      <Link
        href={dashboardHref}
        onClick={onClick}
        className={`flex w-full items-center justify-center gap-2 py-2 text-[14px] font-semibold text-shop-heading ${className}`}
      >
        {avatar}
        Go to Dashboard
      </Link>
    );
  }

  return (
    <Link
      href={dashboardHref}
      onClick={onClick}
      aria-label="Go to your dashboard"
      className={className}
    >
      {avatar}
    </Link>
  );
}
