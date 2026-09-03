"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Heart, Layers, Check, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { getProductId } from "@/lib/product-id";
import {
  useAddToCartMutation,
  useToggleWishlistMutation,
} from "@/lib/api/commerceApi";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

// Rough colour-name → hex map so a "Color" variant group renders as swatches.
const COLOR_HEX = {
  black: "#111827", white: "#f9fafb", grey: "#9ca3af", gray: "#9ca3af",
  silver: "#cbd5e1", red: "#dc2626", maroon: "#7f1d1d", pink: "#ec4899",
  rose: "#f43f5e", orange: "#f97316", amber: "#f59e0b", yellow: "#eab308",
  gold: "#d4af37", green: "#16a34a", olive: "#4d7c0f", teal: "#0d9488",
  blue: "#2563eb", navy: "#1e3a8a", "royal blue": "#1d4ed8", "sky blue": "#38bdf8",
  purple: "#7c3aed", violet: "#8b5cf6", brown: "#92400e", tan: "#d2b48c",
  beige: "#e7dcc7", cream: "#f5f0e1", khaki: "#bda55d", burgundy: "#6b1f2a",
};

function swatchesFromVariants(variants) {
  if (!Array.isArray(variants)) return [];
  const group = variants.find((g) => /colou?r/i.test(g?.name || g?.key || ""));
  if (!group?.options?.length) return [];
  return group.options
    .map((o) => {
      const label = String(o.label || o.value || "").trim().toLowerCase();
      return o.swatch || COLOR_HEX[label] || null;
    })
    .filter(Boolean)
    .slice(0, 5);
}

// Normalise both shapes this card gets used with:
//  - the real catalog product from the API ({ id: slug, productId, images: [], rating, variants })
//  - the legacy shop-data shape ({ image, hoverImage, badge, swatches })
function normalise(product) {
  const id = product.id || getProductId(product);
  const images = product.images || [];
  const image = product.image || images[0] || "/v2/images/awa-logo.webp";
  const hoverImage = product.hoverImage || images[1] || null;
  const compareAt = product.compareAt ?? product.compareAtPrice ?? null;
  const badge =
    product.badge ||
    (compareAt && compareAt > product.price
      ? `-${Math.round((1 - product.price / compareAt) * 100)}%`
      : null);
  return {
    id,
    productId: product.productId || null,
    title: product.title,
    vendor: product.vendor,
    price: product.price,
    compareAt,
    image,
    hoverImage,
    badge,
    swatches:
      product.swatches?.length
        ? product.swatches
        : swatchesFromVariants(product.variants),
    rating: Math.round(product.rating || 0),
  };
}

const ProductCard = ({ product, bordered = false }) => {
  const p = normalise(product);
  const router = useRouter();
  const pathname = usePathname();
  const showToast = useToast();

  const [addToCart, addState] = useAddToCartMutation();
  const [toggleWishlist, wishState] = useToggleWishlistMutation();

  const isWishlisted = useSelector((s) =>
    s.wishlist.items.some((i) => i.id === p.id || i.id === p.productId),
  );

  const [justAdded, setJustAdded] = useState(false);

  const loginWall = () =>
    router.push(`/login/customer?next=${encodeURIComponent(pathname)}`);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (wishState.isLoading || !p.productId) return;
    try {
      await toggleWishlist(p.productId).unwrap();
      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      if (err?.status === 401) return loginWall();
      showToast("Couldn't update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (addState.isLoading || !p.productId) return;
    try {
      await addToCart({ productId: p.productId, qty: 1 }).unwrap();
      setJustAdded(true);
      showToast("Added to cart");
      setTimeout(() => setJustAdded(false), 1600);
    } catch (err) {
      if (err?.status === 401) return loginWall();
      showToast("Couldn't add to cart");
    }
  };

  return (
    <div
      className={`group relative flex w-full shrink-0 flex-col rounded-[10px] bg-white p-3 font-shop ${
        bordered ? "border border-shop-border" : ""
      }`}
    >
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
      <Link
        href={`/product/${p.id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg"
      >
        {p.badge && (
          <span className="absolute left-[10px] top-[10px] z-10 rounded-[3px] bg-shop-accent-3 px-2 py-[3px] text-[11px] font-medium text-white">
            {p.badge}
          </span>
        )}
        <Image
          src={p.image}
          alt={p.title}
          fill
          className={`object-contain p-4 transition-opacity duration-300 ${
            p.hoverImage ? "group-hover:opacity-0" : ""
          }`}
          sizes="(max-width: 768px) 45vw, 260px"
        />
        {p.hoverImage && (
          <Image
            src={p.hoverImage}
            alt=""
            fill
            className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 45vw, 260px"
          />
        )}

        {p.swatches.length > 0 && (
          <div className="absolute bottom-[8px] left-[12px] z-10 flex gap-[4px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {p.swatches.map((c, i) => (
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
        {p.vendor && (
          <span className="text-[11px] uppercase tracking-wide text-shop-text/70">
            {p.vendor}
          </span>
        )}
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-shop-heading hover:underline">
          <Link href={`/product/${p.id}`}>{p.title}</Link>
        </h3>
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-[13px] w-[13px] ${
                i < p.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-[#e5e5e5] text-[#e5e5e5]"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[15px] font-semibold text-shop-heading">
            {formatPrice(p.price)}
          </span>
          {p.compareAt && (
            <span className="text-[13px] text-shop-text/60 line-through">
              {formatPrice(p.compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
