"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Loader2 } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useGetMerchantOverviewQuery } from "@/lib/api/merchantApi";

/**
 * Gates product upload behind a complete store address (state + address +
 * phone) - Fez needs a real pickup address to collect orders, and buyers see
 * the seller's state on every listing. Mirrors the same check the backend
 * enforces in createProduct, so this is a friendly front door, not the only
 * guard.
 */
export default function RequireStoreAddress({ children }) {
  const { data, isLoading } = useGetMerchantOverviewQuery();
  const p = data?.profile;
  const complete = !!(p?.state && p?.address && p?.phone);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
      </div>
    );
  }

  if (!complete) {
    return (
      <div className="flex flex-col gap-6 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
        <AppHeader
          title="Add Product"
          backHref="/merchant/products"
          showBackOnDesktop
        />
        <div className="mx-4 flex flex-col items-center gap-3 rounded-[16px] border border-dashed border-shop-border px-6 py-14 text-center lg:mx-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light">
            <MapPin className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
          </div>
          <p className="text-[14.5px] font-semibold text-shop-heading">
            Add your store address first
          </p>
          <p className="max-w-[380px] text-[12.5px] leading-[18px] text-shop-text">
            We need your state, address and phone number to show shoppers
            where your products ship from and to arrange courier pickup. Add
            them once, then come back to list products.
          </p>
          <Link
            href="/merchant/account"
            className="mt-1 rounded-full bg-shop-accent-1 px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            Add store address
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
