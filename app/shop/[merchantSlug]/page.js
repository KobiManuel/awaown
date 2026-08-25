"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ShieldCheck, Store, MapPin, Phone, Clock } from "lucide-react";
import { merchantProfile } from "@/lib/merchant-data";
import StorefrontProductCard from "@/app/Components/Product/StorefrontProductCard";

export default function PublicMerchantStorePage() {
  const products = useSelector((s) => s.merchant.products);
  const storeBanner = useSelector((s) => s.merchant.storeBanner);
  const storeLogo = useSelector((s) => s.merchant.storeLogo);
  const storeBio = useSelector((s) => s.merchant.storeBio);
  const storeDetails = useSelector((s) => s.merchant.storeDetails);
  const verification = useSelector((s) => s.merchant.verification);
  const activeProducts = products.filter((p) => p.status === "active");

  return (
    <div className="min-h-screen w-full bg-shop-bg font-shop">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8">
        {/* Banner */}
        <div
          className="relative h-40 w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 sm:h-56"
          style={
            storeBanner
              ? { backgroundImage: `url(${storeBanner})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {storeBanner && <div className="absolute inset-0 bg-black/25" />}
        </div>

        {/* Identity card, overlapping the banner */}
        <div className="-mt-16 flex flex-col gap-5 rounded-[16px] border border-shop-border bg-white p-5 sm:-mt-20 sm:flex-row sm:items-end sm:gap-5">
          <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-shop-accent-1-light shadow sm:-mt-20 sm:h-28 sm:w-28">
            {storeLogo ? (
              <img src={storeLogo} alt={merchantProfile.storeName} className="h-full w-full object-cover" />
            ) : (
              <Store className="h-9 w-9 text-shop-accent-1" strokeWidth={1.75} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="text-[20px] font-bold text-shop-heading sm:text-[24px]">
                {merchantProfile.storeName}
              </h1>
              {verification.status === "verified" && (
                <ShieldCheck className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
              )}
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700">
                Store Open
              </span>
            </div>
            <p className="max-w-[560px] pt-2 text-[13px] leading-[19px] text-shop-text">
              {storeBio || "Quality products, delivered with AwaOwn's payment protection."}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[12px] font-semibold text-shop-text/80">
              {storeDetails.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {storeDetails.address ? `${storeDetails.address}, ` : ""}
                  {storeDetails.state}
                </span>
              )}
              {storeDetails.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {storeDetails.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Powered by AwaOwn
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold text-shop-heading">Products</p>
          {activeProducts.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-shop-text/60">
              This store doesn&apos;t have any products yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {activeProducts.map((product) => (
                <StorefrontProductCard key={product.id} product={product} accentColor="#6D28D9" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 rounded-[14px] border border-shop-border bg-white p-5 text-center">
          <ShieldCheck className="h-5 w-5 text-shop-accent-1" />
          <p className="text-[12.5px] text-shop-text/70">
            Every purchase is protected by AwaOwn&apos;s payment protection policy.
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
