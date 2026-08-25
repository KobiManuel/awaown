"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Check, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { addToCart } from "@/lib/store/cartSlice";
import { toggleWishlist } from "@/lib/store/wishlistSlice";

// Visually matches app/Components/Product/ProductCard.js (same hover-reveal action
// icons, image swap, layout) but sourced from real merchant/partner product records
// (Naira pricing, `images[]`) instead of the disconnected shop-data.js demo catalog —
// used on merchant and partner public store pages so a store "feels" like the rest
// of AwaOwn's shop.
const StorefrontProductCard = ({ product, accentColor }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );
  const [justAdded, setJustAdded] = useState(false);
  const image = product.images?.[0];
  const hoverImage = product.images?.[1];

  const handleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        vendor: null,
        price: product.price,
        compareAt: null,
        image,
      }),
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, title: product.title, vendor: null, price: product.price, image, qty: 1 }));
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
          style={isWishlisted ? { borderColor: accentColor, backgroundColor: accentColor } : undefined}
          className={`shop-tooltip mb-[5px] flex h-[35px] w-[35px] items-center justify-center rounded-[5px] border transition-colors ${
            isWishlisted ? "" : "border-shop-border bg-white hover:bg-shop-accent-1"
          } hover:[&>svg]:text-white`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-white text-white" : "text-shop-accent-2"}`}
            strokeWidth={1.75}
          />
        </button>
        <button
          type="button"
          aria-label="Add to cart"
          data-tooltip={justAdded ? "Added!" : "Add to cart"}
          onClick={handleAddToCart}
          style={justAdded ? { borderColor: accentColor, backgroundColor: accentColor } : undefined}
          className={`shop-tooltip flex h-[35px] w-[35px] items-center justify-center rounded-[5px] border transition-colors ${
            justAdded ? "" : "border-shop-border bg-white hover:bg-shop-accent-1"
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
      <div className="relative aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg">
        {image ? (
          <>
            <Image
              src={image}
              alt={product.title}
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
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-shop-text/40">
            <ShoppingCart className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[4px] pt-3">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-shop-heading">
          {product.title}
        </h3>
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-[13px] w-[13px] fill-[#e5e5e5] text-[#e5e5e5]" />
          ))}
        </div>
        <span className="text-[15px] font-semibold" style={{ color: accentColor }}>
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
};

export default StorefrontProductCard;
