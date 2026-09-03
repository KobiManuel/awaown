"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";
import { SkeletonProductGrid } from "@/components/ui/skeleton";
import { useGetWishlistQuery } from "@/lib/api/commerceApi";

export default function WishlistPage() {
  const { data, isLoading, isError } = useGetWishlistQuery();
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Wishlist" />

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonProductGrid count={6} className="lg:grid-cols-4 lg:gap-5" />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load your wishlist.
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <Heart className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">
            Your wishlist is empty
          </p>
          <p className="text-[13px] text-shop-text">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/dashboard/shop"
            className="rounded-full bg-shop-accent-1 px-6 py-2.5 text-[13px] font-semibold text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 lg:px-8">
          {items.map((item) => (
            <AppProductCard key={item.slug} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
