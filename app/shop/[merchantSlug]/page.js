"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, Store, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import PublicStoreProductCard from "@/app/Components/Product/PublicStoreProductCard";
import { useGetMerchantStorefrontQuery } from "@/lib/api/storefrontApi";

export default function PublicMerchantStorePage() {
  const { merchantSlug } = useParams();
  const {
    data: store,
    isLoading,
    isError,
  } = useGetMerchantStorefrontQuery(merchantSlug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg">
        <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-shop-bg px-8 text-center font-shop">
        <p className="text-[15px] font-semibold text-shop-heading">
          Store not found
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          Go to AwaOwn
        </Link>
      </div>
    );
  }

  const products = store.products ?? [];

  return (
    <div className="min-h-screen w-full bg-shop-bg font-shop">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8">
        <div
          className="relative h-40 w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 sm:h-56"
          style={
            store.bannerUrl
              ? {
                  backgroundImage: `url(${store.bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {store.bannerUrl && <div className="absolute inset-0 bg-black/25" />}
        </div>

        <div className="-mt-16 flex flex-col gap-5 rounded-[16px] border border-shop-border bg-white p-5 sm:-mt-20 sm:flex-row sm:items-end sm:gap-5">
          <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-shop-accent-1-light shadow sm:-mt-20 sm:h-28 sm:w-28">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store
                className="h-9 w-9 text-shop-accent-1"
                strokeWidth={1.75}
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="text-[20px] font-bold text-shop-heading sm:text-[24px]">
                {store.name}
              </h1>
              {store.rating > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  ★ {store.rating}
                </span>
              )}
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700">
                Store Open
              </span>
            </div>
            <p className="max-w-[560px] pt-2 text-[13px] leading-[19px] text-shop-text">
              {store.bio ||
                "Quality products, delivered with AwaOwn's payment protection."}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[12px] font-semibold text-shop-text/80">
              {store.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {store.location}
                </span>
              )}
              {store.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {store.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Powered by AwaOwn
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold text-shop-heading">Products</p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-shop-text/60">
              This store doesn&apos;t have any products yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <PublicStoreProductCard
                  key={product.slug}
                  product={product}
                  href={`/product/${product.slug}`}
                  accentColor="#6D28D9"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 rounded-[14px] border border-shop-border bg-white p-5 text-center">
          <ShieldCheck className="h-5 w-5 text-shop-accent-1" />
          <p className="text-[12.5px] text-shop-text/70">
            Every purchase is protected by AwaOwn&apos;s payment protection policy.
          </p>
        </div>
      </div>
    </div>
  );
}
