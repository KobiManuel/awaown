"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Tracks the marketing homepage and every customer/merchant/partner
 * dashboard - deliberately not /admin, same split as GoogleAnalytics.js.
 * Renders nothing (and never loads fbevents.js) until
 * NEXT_PUBLIC_META_PIXEL_ID is set, so this is a no-op until a real Pixel
 * exists. Standard e-commerce events (ViewContent, AddToCart,
 * InitiateCheckout, Purchase) are fired from the relevant pages via
 * lib/metaPixel.js's trackMetaEvent() - this component only owns the base
 * script + the PageView fired on every route change.
 */
export default function MetaPixel() {
  const pathname = usePathname() || "/";
  const excluded = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (!PIXEL_ID || excluded || typeof window.fbq !== "function") return;
    window.fbq("track", "PageView");
  }, [pathname, excluded]);

  if (!PIXEL_ID || excluded) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
