"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Tracks the marketing homepage and every customer/merchant/partner
 * dashboard - deliberately not /admin, which is internal staff usage, not
 * traffic. Renders nothing (and never loads gtag.js) until
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so this is a no-op until a real GA4
 * property exists.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const excluded = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (!GA_ID || excluded || typeof window.gtag !== "function") return;
    const qs = searchParams?.toString();
    const page_path = qs ? `${pathname}?${qs}` : pathname;
    window.gtag("config", GA_ID, { page_path });
  }, [pathname, searchParams, excluded]);

  if (!GA_ID || excluded) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
