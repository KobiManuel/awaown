"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, ChevronRight } from "lucide-react";

/**
 * "Sold by <store>" pill. Links to the seller's public storefront when a
 * `href` is present. `seller` is `{ name, href, logoUrl }` (the shape the
 * catalog / partner APIs return).
 */
export default function SellerPill({ seller, className = "" }) {
  if (!seller?.name) return null;

  const body = (
    <>
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-shop-accent-1-light">
        {seller.logoUrl ? (
          <Image
            src={seller.logoUrl}
            alt={seller.name}
            fill
            className="object-cover"
            sizes="16px"
          />
        ) : (
          <Store className="h-2.5 w-2.5 text-shop-accent-1" strokeWidth={1.75} />
        )}
      </span>
      <span className="truncate">Sold by {seller.name}</span>
      {seller.href && (
        <ChevronRight className="h-3 w-3 shrink-0 text-shop-text/50" />
      )}
    </>
  );

  const base = `flex w-fit max-w-full items-center gap-1 rounded-full border border-shop-border bg-white py-0.5 pl-1 pr-2 text-[10.5px] font-medium text-shop-heading ${className}`;

  if (!seller.href) {
    return <span className={base}>{body}</span>;
  }

  return (
    <Link
      href={seller.href}
      onClick={(e) => e.stopPropagation()}
      className={`${base} transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1-light`}
    >
      {body}
    </Link>
  );
}
