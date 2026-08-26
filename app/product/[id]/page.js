"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Star, Minus, Plus, Check, ShoppingBag, Store, ChevronRight, Boxes, Package } from "lucide-react";
import {
  getProductById,
  getRelatedProducts,
  resolveVariant,
  defaultVariantSelection,
  formatPrice as formatCatalogPrice,
} from "@/lib/dashboard-data";
import { getShopProductById } from "@/lib/shop-data";
import { getProductId } from "@/lib/product-id";
import { merchantProfile, formatPrice as formatMerchantPrice } from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { addToCart } from "@/lib/store/cartSlice";
import { toggleWishlist } from "@/lib/store/wishlistSlice";

// This route works for two, otherwise-disconnected product catalogues:
// the home page's dummy shop catalogue (lib/dashboard-data.js) and the real
// merchant/partner catalogue (state.merchant.products) — see the two "Known
// limitation" notes left elsewhere in this codebase about that split not being
// unified yet. Rather than forcing one shape onto the other, this page looks a
// product up in both places and renders whichever shape it finds.
export default function PublicProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showToast = useToast();

  const catalogProduct = getProductById(id);
  const merchantProducts = useSelector((s) => s.merchant.products);
  const merchantProduct = !catalogProduct ? merchantProducts.find((p) => p.id === id) : null;
  // Last resort: the home page's separate demo catalogue (lib/shop-data.js) has
  // no id field of its own, no description/rating/variants, and isn't the same
  // list dashboard-data.js uses — see the file-level comment above. Only reached
  // when a product isn't in either of the two richer sources.
  const shopProduct =
    !catalogProduct && !merchantProduct ? getShopProductById(id) : null;

  const [selected, setSelected] = useState(() =>
    catalogProduct ? defaultVariantSelection(catalogProduct) : {},
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    merchantProduct?.hasVariants ? merchantProduct.variants[0]?.id : null,
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (merchantProduct?.hasVariants && !selectedVariantId) {
      setSelectedVariantId(merchantProduct.variants[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantProduct?.id]);

  const resolvedCatalog = useMemo(
    () => (catalogProduct ? resolveVariant(catalogProduct, selected) : null),
    [catalogProduct, selected],
  );

  const selectedMerchantVariant = merchantProduct?.hasVariants
    ? merchantProduct.variants.find((v) => v.id === selectedVariantId) || merchantProduct.variants[0]
    : null;

  const product = catalogProduct || merchantProduct || shopProduct;
  const productId = shopProduct ? getProductId(shopProduct) : product?.id;

  const isWishlisted = useSelector((s) =>
    product ? s.wishlist.items.some((i) => i.id === productId) : false,
  );

  if (!product) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Product" backHref="/" />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This product couldn&apos;t be found.
        </p>
      </div>
    );
  }

  // Normalize everything the JSX needs into one shape regardless of source.
  const isGroup = merchantProduct?.productType === "group";
  const formatPrice = shopProduct ? formatMerchantPrice : catalogProduct ? formatCatalogPrice : formatMerchantPrice;
  const image = catalogProduct
    ? resolvedCatalog.image
    : merchantProduct
      ? (merchantProduct.images?.[0] || null)
      : (shopProduct.image || null);
  const price = catalogProduct
    ? resolvedCatalog.price
    : merchantProduct
      ? (selectedMerchantVariant ? selectedMerchantVariant.price : merchantProduct.price)
      : shopProduct.price;
  const stock = catalogProduct
    ? catalogProduct.stock
    : merchantProduct
      ? (selectedMerchantVariant ? selectedMerchantVariant.stock : merchantProduct.stock)
      : 20;
  const variantLabel = catalogProduct ? resolvedCatalog.variantLabel : (selectedMerchantVariant?.label || null);
  const vendor = catalogProduct ? catalogProduct.vendor : merchantProduct ? merchantProfile.storeName : (shopProduct.vendor || "AwaOwn");
  const storeHref = "/shop/fashion-vault";
  const rating = catalogProduct ? catalogProduct.rating : null;
  const reviewCount = catalogProduct ? catalogProduct.reviewCount : null;
  const compareAt = catalogProduct ? catalogProduct.compareAt : shopProduct ? (shopProduct.compareAt || null) : null;
  const discount = compareAt ? Math.round((1 - price / compareAt) * 100) : null;
  const description = product.description || null;
  const related = catalogProduct ? getRelatedProducts(catalogProduct) : [];

  const cartLineId = catalogProduct
    ? `${productId}${resolvedCatalog.variantId ? `::${resolvedCatalog.variantId}` : ""}`
    : selectedMerchantVariant
      ? `${productId}::${selectedMerchantVariant.id}`
      : productId;

  const handleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: productId,
        title: product.title,
        vendor,
        price,
        compareAt,
        image,
      }),
    );
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: cartLineId,
        title: product.title,
        vendor,
        price,
        image,
        variantLabel,
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
        backHref="/"
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
        {image ? (
          <Image
            key={image}
            src={image}
            alt={product.title}
            fill
            className="object-contain p-8 transition-opacity duration-300"
            sizes="(max-width: 1024px) 480px, 540px"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-shop-text/30">
            <Package className="h-16 w-16" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {/* Title + rating */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-medium uppercase tracking-wide text-shop-accent-1">
            {vendor}
          </span>
          <h1 className="text-[18px] font-semibold leading-[24px] text-shop-heading">
            {product.title}
          </h1>
          {rating != null && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-[#e5e5e5] text-[#e5e5e5]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12px] text-shop-text">
                {rating} ({reviewCount} reviews)
              </span>
            </div>
          )}
          <Link
            href={storeHref}
            className="flex w-fit items-center gap-1.5 rounded-full border border-shop-border bg-shop-bg py-1 pl-1 pr-3 text-[12px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
              <Store className="h-3 w-3 text-shop-accent-1" strokeWidth={1.75} />
            </span>
            Sold by {vendor}
            <ChevronRight className="h-3 w-3 text-shop-text/50" />
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-shop-heading">
            {formatPrice(price)}
          </span>
          {compareAt && (
            <span className="text-[14px] text-shop-text/50 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>

        {/* Variants — catalogue products: grouped attribute selectors */}
        {catalogProduct &&
          catalogProduct.variants.map((group) => (
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

        {/* Variants — merchant/partner products: flat option list */}
        {merchantProduct?.hasVariants && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-shop-heading">Options</p>
            <div className="flex flex-wrap gap-2">
              {merchantProduct.variants.map((v) => {
                const active = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={v.stock <= 0}
                    className={`rounded-[8px] border px-3.5 py-2 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? "border-shop-accent-1 bg-shop-accent-1-light text-shop-accent-1"
                        : "border-shop-border text-shop-heading"
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Group/bundle contents */}
        {isGroup && merchantProduct.groupItems?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
              <Boxes className="h-4 w-4 text-shop-accent-1" />
              What&apos;s in this bundle
            </p>
            <div className="flex flex-col gap-2">
              {merchantProduct.groupItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-[10px] border border-shop-border p-2.5">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-shop-bg">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-4.5 w-4.5 text-shop-text/40" />
                    )}
                  </div>
                  <span className="text-[12.5px] font-medium text-shop-heading">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Qty + stock */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-shop-heading">Quantity</p>
          {!merchantProduct?.hideStock && (
            <p className="text-[12px] text-shop-text/70">
              {stock > 10 ? "In stock" : stock > 0 ? `Only ${stock} left` : "Out of stock"}
            </p>
          )}
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
            onClick={() => setQty((q) => Math.min(Math.max(stock, 1), q + 1))}
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
            disabled={stock <= 0}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-shop-accent-1/40 ${
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
            router.push(catalogProduct ? "/dashboard/checkout" : "/cart");
          }}
          disabled={stock <= 0}
          className="w-full rounded-[10px] border border-shop-accent-1 py-3 text-[13.5px] font-semibold text-shop-accent-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>

        {/* Description */}
        {description && (
          <div className="flex flex-col gap-2 border-t border-shop-border pt-4">
            <p className="text-[13px] font-semibold text-shop-heading">Description</p>
            <p className="text-[13px] leading-[21px] text-shop-text">{description}</p>
          </div>
        )}
      </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-shop-border px-4 pt-4 lg:px-8">
          <p className="text-[14px] font-semibold text-shop-heading">You may also like</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="flex flex-col overflow-hidden rounded-[14px] border border-shop-border bg-white transition-transform active:scale-[0.98]"
              >
                <div className="relative aspect-square w-full bg-shop-bg">
                  <Image src={p.images[0]} alt={p.title} fill className="object-contain p-4" sizes="45vw" />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">{p.title}</p>
                  <span className="text-[13.5px] font-semibold text-shop-heading">
                    {formatCatalogPrice(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
