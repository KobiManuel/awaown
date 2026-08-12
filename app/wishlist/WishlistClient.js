"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import ProductCard from "@/app/Components/Product/ProductCard";

const WishlistClient = () => {
  const items = useSelector((state) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[1460px] flex-col items-center gap-4 px-4 py-24 text-center font-shop md:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-shop-accent-1-light">
          <Heart className="h-9 w-9 text-shop-accent-1" />
        </div>
        <h1 className="text-[24px] font-semibold text-shop-heading">Your wishlist is empty</h1>
        <p className="max-w-[360px] text-[14px] text-shop-text">
          Tap the heart icon on any product to save it here for later.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-[8px] bg-shop-accent-1 px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1460px] px-4 py-8 font-shop md:px-8 md:py-12">
      <SectionHeader title={`Wishlist (${items.length})`} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default WishlistClient;
