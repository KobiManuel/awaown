"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePartnerCart } from "@/lib/usePartnerCart";

/**
 * The only cart affordance inside a partner store - the shared site header
 * (which normally carries the cart icon) is hidden here, so without this a
 * shopper who adds something has no visible way back to it.
 */
export default function PartnerCartButton({ code }) {
  const { count } = usePartnerCart(code);
  if (!count) return null;

  return (
    <Link
      href={`/store/${code}/cart`}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      // bottom-left - the public WhatsApp support button already owns
      // bottom-right everywhere on the site, this store's pages included.
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1 text-white shadow-lg transition-transform hover:scale-105"
    >
      <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-shop-heading shadow">
        {count}
      </span>
    </Link>
  );
}
