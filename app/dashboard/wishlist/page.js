"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";

export default function WishlistPage() {
  const items = useSelector((s) => s.wishlist.items);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Wishlist" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <Heart className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">Your wishlist is empty</p>
          <p className="text-[13px] text-shop-text">Tap the heart on any product to save it here.</p>
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
            <AppProductCard
              key={item.id}
              product={{
                id: item.id,
                title: item.title,
                vendor: item.vendor,
                price: item.price,
                compareAt: item.compareAt,
                images: [item.image],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
