"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/merchant-data";

/**
 * Read-only product card for the public storefront pages (`/store/[code]`,
 * `/shop/[slug]`). No cart/wishlist actions — a visitor taps through to the
 * product page (with `?ref=` for partner attribution) and signs in there.
 */
export default function PublicStoreProductCard({ product, href, accentColor }) {
  const discountPct =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : null;

  return (
    <Link
      href={href}
      className="flex flex-col overflow-hidden rounded-[14px] border bg-white transition-transform active:scale-[0.98]"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="relative aspect-square w-full bg-[#f6f6f6]">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="45vw"
          />
        )}
        {discountPct && (
          <span
            className="absolute left-2 top-2 rounded-[4px] px-1.5 py-[2px] text-[10px] font-semibold text-white"
            style={{ backgroundColor: accentColor || "#6d28d9" }}
          >
            -{discountPct}%
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
          {product.title}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-semibold text-shop-heading">
            {formatPrice(product.price)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-[11px] text-shop-text/50 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
