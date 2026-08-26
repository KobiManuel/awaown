"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Layers, Check, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { getProductId } from "@/lib/product-id";
import { addToCart } from "@/lib/store/cartSlice";
import { toggleWishlist } from "@/lib/store/wishlistSlice";

const ProductCard = ({ product }) => {
  const { title, vendor, price, compareAt, image, hoverImage, badge, swatches } = product;
  const id = getProductId(product);
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === id)
  );
  const [justAdded, setJustAdded] = useState(false);

  const handleWishlist = () => {
    dispatch(toggleWishlist({ id, title, vendor, price, compareAt, image }));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ id, title, vendor, price, image, qty: 1 }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="group relative flex w-full shrink-0 flex-col rounded-[10px] bg-white p-3 font-shop">
      {/* Hover action icons */}
      <div className="absolute right-[10px] top-[-4px] z-20 flex flex-col opacity-0 transition-all duration-500 group-hover:top-[16px] group-hover:opacity-100">
        <button
          type="button"
          aria-label="Add to wishlist"
          data-tooltip={isWishlisted ? "Remove from wishlist" : "Wishlist"}
          onClick={handleWishlist}
          className={`shop-tooltip mb-[5px] flex h-[35px] w-[35px] items-center justify-center rounded-[5px] border transition-colors ${
            isWishlisted
              ? "border-shop-accent-1 bg-shop-accent-1"
              : "border-shop-border bg-white hover:bg-shop-accent-1"
          } hover:[&>svg]:text-white`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-white text-white" : "text-shop-accent-2"}`}
            strokeWidth={1.75}
          />
        </button>
        <button
          type="button"
          aria-label="Add to compare"
          data-tooltip="Compare"
          className="shop-tooltip mb-[5px] flex h-[35px] w-[35px] items-center justify-center rounded-[5px] border border-shop-border bg-white transition-colors hover:bg-shop-accent-1 hover:[&>svg]:text-white"
        >
          <Layers className="h-4 w-4 text-shop-accent-2" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Add to cart"
          data-tooltip={justAdded ? "Added!" : "Add to cart"}
          onClick={handleAddToCart}
          className={`shop-tooltip flex h-[35px] w-[35px] items-center justify-center rounded-[5px] border transition-colors ${
            justAdded
              ? "border-shop-accent-1 bg-shop-accent-1"
              : "border-shop-border bg-white hover:bg-shop-accent-1"
          } hover:[&>svg]:text-white`}
        >
          {justAdded ? (
            <Check className="h-4 w-4 text-white" strokeWidth={2} />
          ) : (
            <ShoppingCart className="h-4 w-4 text-shop-accent-2" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Media */}
      <Link href={`/product/${id}`} className="relative block aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg">
        {badge && (
          <span className="absolute left-[10px] top-[10px] z-10 rounded-[3px] bg-shop-accent-3 px-2 py-[3px] text-[11px] font-medium text-white">
            {badge}
          </span>
        )}
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 768px) 45vw, 260px"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            fill
            className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 45vw, 260px"
          />
        )}

        {/* Color swatches - absolutely positioned, no layout shift */}
        {swatches && swatches.length > 0 && (
          <div className="absolute bottom-[8px] left-[12px] z-10 flex gap-[4px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {swatches.map((c, i) => (
              <span
                key={i}
                className="h-[16px] w-[16px] rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-[4px] pt-3">
        {vendor && (
          <span className="text-[11px] uppercase tracking-wide text-shop-text/70">
            {vendor}
          </span>
        )}
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-shop-heading hover:underline">
          <Link href={`/product/${id}`}>{title}</Link>
        </h3>
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-[13px] w-[13px] fill-[#e5e5e5] text-[#e5e5e5]"
            />
          ))}
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[15px] font-semibold text-shop-heading">
            {formatPrice(price)}
          </span>
          {compareAt && (
            <span className="text-[13px] text-shop-text/60 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
