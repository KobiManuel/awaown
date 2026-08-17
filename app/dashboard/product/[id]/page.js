"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Star, Minus, Plus, Check, ShoppingBag } from "lucide-react";
import {
  getProductById,
  getRelatedProducts,
  resolveVariant,
  defaultVariantSelection,
  formatPrice,
} from "@/lib/dashboard-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { addToCart } from "@/lib/store/cartSlice";
import { toggleWishlist } from "@/lib/store/wishlistSlice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showToast = useToast();

  const product = getProductById(id);
  const [selected, setSelected] = useState(() =>
    product ? defaultVariantSelection(product) : {},
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const resolved = useMemo(
    () => (product ? resolveVariant(product, selected) : null),
    [product, selected],
  );

  const cartLineId = product
    ? `${product.id}${resolved.variantId ? `::${resolved.variantId}` : ""}`
    : null;

  const isWishlisted = useSelector((s) =>
    product ? s.wishlist.items.some((i) => i.id === product.id) : false,
  );

  if (!product || !resolved) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Product" backHref="/dashboard/shop" />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This product couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;

  const handleWishlist = () => {
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

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: cartLineId,
        title: product.title,
        vendor: product.vendor,
        price: resolved.price,
        image: resolved.image,
        variantLabel: resolved.variantLabel,
        qty,
      }),
    );
    setJustAdded(true);
    showToast("Added to cart");
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title={product.title}
        backHref="/dashboard/shop"
        showBackOnDesktop
        right={
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg"
          >
            <Heart
              className={`h-4.5 w-4.5 ${
                isWishlisted ? "fill-shop-accent-1 text-shop-accent-1" : "text-shop-heading"
              }`}
              strokeWidth={1.75}
            />
          </button>
        }
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pt-2">
      {/* Gallery */}
      <div className="relative mx-4 aspect-square overflow-hidden rounded-[16px] bg-shop-bg lg:mx-0 lg:sticky lg:top-28 lg:self-start">
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded-[4px] bg-shop-accent-3 px-2 py-1 text-[11px] font-semibold text-white">
            -{discount}%
          </span>
        )}
        <Image
          key={resolved.image}
          src={resolved.image}
          alt={product.title}
          fill
          className="object-contain p-8 transition-opacity duration-300"
          sizes="(max-width: 1024px) 480px, 540px"
          priority
        />
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {/* Title + rating */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-medium uppercase tracking-wide text-shop-accent-1">
            {product.vendor}
          </span>
          <h1 className="text-[18px] font-semibold leading-[24px] text-shop-heading">
            {product.title}
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-[#e5e5e5] text-[#e5e5e5]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] text-shop-text">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-shop-heading">
            {formatPrice(resolved.price)}
          </span>
          {product.compareAt && (
            <span className="text-[14px] text-shop-text/50 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>

        {/* Variants */}
        {product.variants.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-shop-heading">
              {group.name}:{" "}
              <span className="font-normal text-shop-text">
                {group.options.find((o) => o.value === selected[group.key])?.label}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const active = selected[group.key] === option.value;
                if (option.swatch) {
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={option.label}
                      onClick={() =>
                        setSelected((s) => ({ ...s, [group.key]: option.value }))
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                        active ? "border-shop-accent-1" : "border-transparent"
                      }`}
                    >
                      <span
                        className="h-6.5 w-6.5 rounded-full border border-black/10"
                        style={{ backgroundColor: option.swatch }}
                      />
                    </button>
                  );
                }
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSelected((s) => ({ ...s, [group.key]: option.value }))
                    }
                    className={`rounded-[8px] border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                      active
                        ? "border-shop-accent-1 bg-shop-accent-1-light text-shop-accent-1"
                        : "border-shop-border text-shop-heading"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Qty + stock */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-shop-heading">Quantity</p>
          <p className="text-[12px] text-shop-text/70">
            {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-full border border-shop-border px-1.5 py-1.5">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
          >
            <Minus className="h-3.5 w-3.5 text-shop-heading" />
          </button>
          <span className="w-5 text-center text-[14px] font-semibold text-shop-heading">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
          >
            <Plus className="h-3.5 w-3.5 text-shop-heading" />
          </button>
        </div>

        {/* Add to cart */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border transition-colors ${
              isWishlisted
                ? "border-shop-accent-1 bg-shop-accent-1-light"
                : "border-shop-border"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-shop-accent-1 text-shop-accent-1" : "text-shop-heading"
              }`}
              strokeWidth={1.75}
            />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-semibold text-white transition-colors ${
              justAdded ? "bg-emerald-600" : "bg-shop-accent-1 hover:bg-shop-accent-1-dark"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4.5 w-4.5" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4.5 w-4.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            handleAddToCart();
            router.push("/dashboard/checkout");
          }}
          className="w-full rounded-[10px] border border-shop-accent-1 py-3 text-[13.5px] font-semibold text-shop-accent-1"
        >
          Buy Now
        </button>

        {/* Description */}
        <div className="flex flex-col gap-2 border-t border-shop-border pt-4">
          <p className="text-[13px] font-semibold text-shop-heading">Description</p>
          <p className="text-[13px] leading-[21px] text-shop-text">{product.description}</p>
        </div>
      </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-shop-border px-4 pt-4 lg:px-8">
          <p className="text-[14px] font-semibold text-shop-heading">You may also like</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <AppProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
