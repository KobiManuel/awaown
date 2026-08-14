"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import { toggleWishlist } from "@/lib/store/wishlistSlice";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const AppProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const isWishlisted = useSelector((s) =>
    s.wishlist.items.some((i) => i.id === product.id),
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        price: product.price,
        compareAt: product.compareAt,
        image: product.images[0],
      }),
    );
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      href={`/dashboard/product/${product.id}`}
      className="flex flex-col overflow-hidden rounded-[14px] border border-shop-border bg-white transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full bg-shop-bg">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-contain p-4"
          sizes="45vw"
        />
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-shop-accent-1 text-shop-accent-1" : "text-shop-heading"
            }`}
            strokeWidth={1.75}
          />
        </button>
        {product.compareAt && (
          <span className="absolute left-2 top-2 rounded-[4px] bg-shop-accent-3 px-1.5 py-[2px] text-[10px] font-semibold text-white">
            -{Math.round((1 - product.price / product.compareAt) * 100)}%
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
          {product.compareAt && (
            <span className="text-[11px] text-shop-text/50 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AppProductCard;
