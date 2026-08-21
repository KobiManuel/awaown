"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { BadgeCheck, ShieldCheck, Package } from "lucide-react";
import { merchantProfile, formatPrice } from "@/lib/merchant-data";

export default function PublicMerchantStorePage() {
  const products = useSelector((s) => s.merchant.products.filter((p) => p.status === "active"));
  const storeBanner = useSelector((s) => s.merchant.storeBanner);
  const storeBio = useSelector((s) => s.merchant.storeBio);
  const verified = useSelector((s) => s.merchant.verification.status === "verified");

  return (
    <div className="min-h-screen w-full bg-shop-bg font-shop">
      <div
        className="relative flex h-40 items-end bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 bg-cover bg-center sm:h-56"
        style={storeBanner ? { backgroundImage: `url(${storeBanner})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex w-full max-w-[900px] items-center gap-3 px-4 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[18px] font-bold text-shop-accent-1">
            {(merchantProfile.storeName || "S").charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[18px] font-bold text-white">{merchantProfile.storeName}</h1>
              {verified && <BadgeCheck className="h-4.5 w-4.5 text-white" strokeWidth={1.75} />}
            </div>
            <p className="text-[12px] text-white/80">{storeBio || merchantProfile.bio}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-4 py-6">
        {products.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-shop-text">
            This store doesn&apos;t have any products yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[14px] border border-shop-border bg-white"
              >
                <div className="relative flex aspect-square w-full items-center justify-center bg-shop-bg">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                      sizes="200px"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-shop-text/40" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
                    {product.title}
                  </p>
                  <p className="text-[13.5px] font-semibold text-shop-heading">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-2 rounded-[14px] border border-shop-border bg-white p-5 text-center">
          <ShieldCheck className="h-5 w-5 text-shop-accent-1" />
          <p className="text-[12.5px] text-shop-text">
            Every purchase on AwaOwn is escrow protected.
          </p>
          <Link
            href="/"
            className="mt-1 rounded-full bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Shop the Full AwaOwn Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
