"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Store, ShieldCheck, Package } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";

export default function PublicPartnerStorePage() {
  const storeName = useSelector((s) => s.partner.storeName);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const merchantProducts = useSelector((s) => s.merchant.products);

  const products = merchantProducts.filter((p) => storeProductIds.includes(p.id));

  return (
    <div className="min-h-screen w-full bg-shop-bg font-shop">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-10">
        <div className="flex flex-col items-center gap-3 rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-8 text-center text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Store className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-[22px] font-bold">{storeName}</h1>
          <p className="text-[13px] text-white/80">Curated picks, shared with you on AwaOwn</p>
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-shop-text">
            This store doesn&apos;t have any products yet — check back soon.
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
