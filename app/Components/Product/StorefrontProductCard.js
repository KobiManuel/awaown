"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Check, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { addToCart } from "@/lib/store/cartSlice";
import { toggleWishlist } from "@/lib/store/wishlistSlice";

// Common color names merchants/partners actually type into a "Color" option
// group (see app/merchant/products/new/page.js's Option Names field). Variant
// records only ever store the free-text combined label ("Black / M"), never a
// hex value, so this is a heuristic match on that label — not a structured
// per-attribute color field. Good enough for the common case; won't catch an
// unusual color name.
const COLOR_NAME_HEX = {
  black: "#1a1a1a", white: "#f5f5f5", red: "#dc2626", blue: "#2563eb", navy: "#1e3a5f",
  green: "#16a34a", yellow: "#eab308", purple: "#7c3aed", pink: "#ec4899", orange: "#ea580c",
  brown: "#7b4a2d", grey: "#9ca3af", gray: "#9ca3af", gold: "#c9a635", silver: "#b8bcc2",
  beige: "#e8dcc8", cream: "#f5f0e1", maroon: "#7f1d1d", teal: "#0d9488", tan: "#d2b48c",
  burgundy: "#7a1f3d", olive: "#556b2f", turquoise: "#2dd4bf", lavender: "#c4b5fd", coral: "#ff6f61",
  peach: "#ffcba4", mint: "#86efac", indigo: "#4f46e5", charcoal: "#36454f", ivory: "#f7f4e9",
  khaki: "#c3b091", rose: "#f43f5e", violet: "#8b5cf6", cyan: "#22d3ee",
};

function extractColorSwatches(product) {
  if (!product.hasVariants || !product.variants?.length) return [];
  if (!/colou?r/i.test(product.optionName || "")) return [];
  const found = new Map();
  for (const v of product.variants) {
    const tokens = (v.label || "").split("/").map((t) => t.trim().toLowerCase());
    for (const token of tokens) {
      if (COLOR_NAME_HEX[token] && !found.has(token)) {
        found.set(token, COLOR_NAME_HEX[token]);
      }
    }
  }
  return [...found.values()];
}

// Visually matches app/Components/Product/ProductCard.js (same hover-reveal action
// icons, image swap, color swatches, layout) but sourced from real merchant/partner
// product records (Naira pricing, `images[]`) instead of the disconnected
// shop-data.js demo catalog — used on merchant and partner public store pages so a
// store "feels" like the rest of AwaOwn's shop.
const StorefrontProductCard = ({ product, accentColor }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );
  const [justAdded, setJustAdded] = useState(false);
  const image = product.images?.[0];
  const hoverImage = product.images?.[1];
  const swatches = extractColorSwatches(product);
  const href = `/product/${product.id}`;

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
      <Link href={href} className="relative block aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg">
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

        {swatches.length > 0 && (
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
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-shop-heading hover:underline">
          <Link href={href}>{product.title}</Link>
        </h3>
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-[13px] w-[13px] fill-[#e5e5e5] text-[#e5e5e5]" />
          ))}
        </div>
        <span className="text-[15px] font-semibold" style={{ color: accentColor }}>
          {product.hasVariants
            ? `From ${formatPrice(product.price)}`
            : formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
};

export default StorefrontProductCard;
