"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Star,
  Minus,
  Plus,
  Check,
  ShoppingBag,
  Store,
  ChevronRight,
  ChevronLeft,
  Loader2,
  BellRing,
} from "lucide-react";
import {
  resolveVariant,
  defaultVariantSelection,
  formatPrice,
} from "@/lib/dashboard-data";
import { isColorAxis, colorHex } from "@/lib/variant-options";
import { smartTitle, sentenceCase } from "@/lib/text-format";
import { setBuyNow as setBuyNowItem } from "@/lib/express-checkout";
import FullScreenLoader from "@/app/Components/Dashboard/FullScreenLoader";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";
import { rememberRef, readRef } from "@/lib/partner-ref";
import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ProductCard from "@/app/Components/Product/ProductCard";
import { useToast, ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthBootstrap } from "@/lib/api/useAuthBootstrap";
import {
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useCreateReviewMutation,
} from "@/lib/api/catalogApi";
import {
  useGetStockAlertQuery,
  useSubscribeStockAlertMutation,
} from "@/lib/api/catalogApi";
import { useCommerce } from "@/lib/useCommerce";
import { errorMessage } from "@/lib/api/errorMessage";

function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const showToast = useToast();

  const { authed } = useAuthBootstrap("customer");

  // Partner attribution: capture ?ref= into a cookie so it survives login/signup.
  const refFromUrl = search.get("ref");
  useEffect(() => {
    if (refFromUrl) rememberRef(refFromUrl);
  }, [refFromUrl]);
  const refCode = refFromUrl || readRef();

  const { data: product, isLoading, isError } = useGetProductQuery(id);
  const { data: related } = useGetRelatedProductsQuery(id, { skip: !product });

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(null); // thumbnail the buyer tapped
  const [imgLoading, setImgLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const commerce = useCommerce();

  useEffect(() => {
    if (product?.hasVariants && selected == null) {
      setSelected(defaultVariantSelection(product));
    }
  }, [product]); // eslint-disable-line

  const resolved = useMemo(
    () => (product ? resolveVariant(product, selected) : null),
    [product, selected],
  );

  const pickAxis = (key, value) =>
    setSelected((s) => ({ ...(s || {}), [key]: value }));

  // A value on `axisKey` is offered only if some in-stock combination carries
  // it *and* is consistent with the choices already made on the other axes.
  const axisValueAvailable = (axisKey, value) => {
    const list = product?.variants ?? [];
    return list.some((v) => {
      const ov = v.options ?? v.optionValues ?? {};
      if (ov[axisKey] !== value) return false;
      for (const [k, val] of Object.entries(selected || {})) {
        if (k !== axisKey && ov[k] !== val) return false;
      }
      return v.inStock !== false;
    });
  };

  const needsSelection = !!product?.hasVariants && !resolved?.complete;

  // Full image set for the gallery: the selected variety's photo first (if it
  // has its own), then every product photo, de-duplicated.
  const gallery = useMemo(() => {
    const all = [resolved?.image, ...(product?.images ?? [])].filter(Boolean);
    return [...new Set(all)];
  }, [resolved?.image, product?.images]);

  // Picking a different variety resets the manual thumbnail choice so the main
  // image follows the variety again.
  useEffect(() => {
    setActiveImg(null); // eslint-disable-line react-hooks/set-state-in-effect
  }, [resolved?.variantId]);

  const shownImg =
    activeImg && gallery.includes(activeImg) ? activeImg : resolved?.image ?? null;

  // Show the shimmer again each time the displayed image changes, with a
  // safety timeout in case a cache-hit skips the <Image> onLoad.
  useEffect(() => {
    setImgLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    const t = setTimeout(() => setImgLoading(false), 2500);
    return () => clearTimeout(t);
  }, [shownImg]);

  // keep quantity within the selected variety's stock
  useEffect(() => {
    if (resolved?.maxQty != null && qty > resolved.maxQty) {
      setQty(Math.max(1, resolved.maxQty));
    }
  }, [resolved?.maxQty]); // eslint-disable-line

  const { data: alertStatus } = useGetStockAlertQuery(id, {
    skip: !authed || !product,
  });
  const [subscribeAlert, alertState] = useSubscribeStockAlertMutation();
  const [alerted, setAlerted] = useState(false);
  const isSubscribed = alerted || !!alertStatus?.subscribed;

  const isWishlisted = !!(product && commerce.isWishlisted(product));

  const requireLogin = () => {
    const next = encodeURIComponent(pathname + (search.toString() ? `?${search}` : ""));
    router.push(`/login/customer?next=${next}`);
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-[1100px] px-4 py-8 lg:grid lg:grid-cols-2 lg:gap-10">
          <Skeleton className="aspect-square rounded-[16px]" />
          <div className="mt-4 flex flex-col gap-3 lg:mt-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (isError || !product || !resolved) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-[1100px] px-4 py-20 text-center">
          <p className="text-[15px] font-semibold text-shop-heading">
            This product couldn&apos;t be found.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-full bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Back to AwaOwn
          </Link>
        </div>
      </PageShell>
    );
  }

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;
  // per-combination once the shopper has picked every axis, otherwise the roll-up
  const stockLeft = needsSelection ? null : resolved.maxQty;
  const outOfStock = !needsSelection && resolved.inStock === false;
  const canAlert = outOfStock && product.backInStockAlerts;

  const handleAlert = async () => {
    if (!authed) return requireLogin();
    try {
      await subscribeAlert(id).unwrap();
      setAlerted(true);
      showToast("We'll email you when it's back in stock");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const handleWishlist = async () => {
    try {
      await commerce.toggleWishlist(product);
      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      showToast("Couldn't update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (adding) return false;
    setAdding(true);
    try {
      await commerce.addToCart(
        { ...product, price: resolved.price, image: resolved.image },
        {
          qty,
          variantId: resolved.variantId ?? null,
          variantLabel: resolved.variantLabel ?? null,
          ref: refCode ?? undefined,
        },
      );
      setJustAdded(true);
      showToast("Added to cart");
      setTimeout(() => setJustAdded(false), 1600);
      return true;
    } catch (err) {
      showToast(errorMessage(err));
      return false;
    } finally {
      setAdding(false);
    }
  };

  // Buy Now goes straight to checkout for THIS item only - it never touches the
  // cart. The item is stashed for the checkout page (survives the login hop).
  const buyNow = () => {
    if (needsSelection || outOfStock) return;
    setNavigating(true);
    setBuyNowItem({
      productId: product.productId,
      slug: product.slug ?? id,
      variantId: resolved.variantId ?? null,
      qty,
      ref: refCode ?? null,
    });
    if (commerce.authed) {
      router.push("/dashboard/checkout?mode=buynow");
    } else {
      router.push(
        `/login/customer?next=${encodeURIComponent("/dashboard/checkout?mode=buynow")}`,
      );
    }
  };

  return (
    <PageShell>
      {navigating && <FullScreenLoader label="Taking you to checkout" />}
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 font-shop lg:py-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-[12.5px] text-shop-text/70 hover:text-shop-accent-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Continue shopping
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[16px] bg-shop-bg">
              {/* wave skeleton fills the box until the image paints, so it's
                  never a blank rectangle while switching photos */}
              {shownImg && imgLoading && (
                <div className="shop-shimmer absolute inset-0 z-[1]" />
              )}
              {discount && (
                <span className="absolute left-3 top-3 z-10 rounded-[4px] bg-shop-accent-3 px-2 py-1 text-[11px] font-semibold text-white">
                  -{discount}%
                </span>
              )}
              {shownImg && (
                <Image
                  key={shownImg}
                  src={shownImg}
                  alt={product.title}
                  fill
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                  className={`relative z-[2] object-contain p-8 transition-opacity duration-300 ${
                    imgLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 1024px) 480px, 540px"
                  priority
                />
              )}
            </div>

            {gallery.length > 1 && (
              <div className="hide-scrollbar flex max-h-[164px] flex-wrap gap-2 overflow-y-auto">
                {gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImg(img)}
                    aria-label="View photo"
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] border-2 bg-shop-bg transition-colors ${
                      img === shownImg
                        ? "border-shop-accent-1"
                        : "border-transparent hover:border-shop-border"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:mt-0">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-medium uppercase tracking-wide text-shop-accent-1">
                {product.vendor}
              </span>
              <h1 className="text-[20px] font-semibold leading-[26px] text-shop-heading">
                {smartTitle(product.title)}
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
              {(() => {
                const seller = product.seller ?? {
                  name: product.vendor,
                  href: null,
                  logoUrl: null,
                };
                const Pill = (
                  <>
                    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-shop-accent-1-light">
                      {seller.logoUrl ? (
                        <Image
                          src={seller.logoUrl}
                          alt={seller.name}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      ) : (
                        <Store className="h-3 w-3 text-shop-accent-1" strokeWidth={1.75} />
                      )}
                    </span>
                    Sold by {seller.name}
                    {seller.href && <ChevronRight className="h-3 w-3 text-shop-text/50" />}
                  </>
                );
                return seller.href ? (
                  <Link
                    href={seller.href}
                    className="flex w-fit items-center gap-1.5 rounded-full border border-shop-border bg-shop-bg py-1 pl-1 pr-3 text-[12px] font-medium text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1-light"
                  >
                    {Pill}
                  </Link>
                ) : (
                  <span className="flex w-fit items-center gap-1.5 rounded-full border border-shop-border bg-shop-bg py-1 pl-1 pr-3 text-[12px] font-medium text-shop-heading">
                    {Pill}
                  </span>
                );
              })()}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[24px] font-bold text-shop-heading">
                {needsSelection
                  ? `From ${formatPrice(product.price)}`
                  : formatPrice(resolved.price)}
              </span>
              {product.compareAt && (
                <span className="text-[14px] text-shop-text/50 line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {product.hasVariants && product.variantAxes?.length > 0 && (
              <div className="flex flex-col gap-4">
                {product.variantAxes.map((axis) => {
                  const isColor = isColorAxis(axis);
                  const chosen = selected?.[axis.key];
                  const chosenLabel = axis.options.find(
                    (o) => o.value === chosen,
                  )?.label;
                  return (
                    <div key={axis.key} className="flex flex-col gap-2">
                      <p className="text-[13px] font-semibold text-shop-heading">
                        {axis.name}:{" "}
                        <span className="font-normal text-shop-text">
                          {chosenLabel ?? "Select"}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {axis.options.map((o) => {
                          const active = chosen === o.value;
                          const available = axisValueAvailable(axis.key, o.value);
                          if (isColor) {
                            return (
                              <button
                                key={o.value}
                                type="button"
                                disabled={!available}
                                onClick={() => pickAxis(axis.key, o.value)}
                                title={o.label}
                                aria-label={o.label}
                                className={`relative h-9 w-9 rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
                                  active
                                    ? "border-shop-accent-1"
                                    : "border-shop-border hover:border-shop-accent-1/50"
                                }`}
                                style={{
                                  backgroundColor:
                                    o.swatch || colorHex(o.label) || "#d4d4d4",
                                }}
                              >
                                {active && (
                                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.5))]" />
                                )}
                              </button>
                            );
                          }
                          return (
                            <button
                              key={o.value}
                              type="button"
                              disabled={!available}
                              onClick={() => pickAxis(axis.key, o.value)}
                              className={`flex items-center gap-2 rounded-[10px] border p-1.5 pr-3 text-left text-[12.5px] font-medium text-shop-heading transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                                active
                                  ? "border-shop-accent-1 bg-shop-accent-1-light"
                                  : "border-shop-border hover:border-shop-accent-1/50"
                              }`}
                            >
                              {axis.useImages && o.image && (
                                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[7px] bg-shop-bg">
                                  <Image
                                    src={o.image}
                                    alt={o.label}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </span>
                              )}
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {needsSelection && (
                  <p className="text-[12px] font-medium text-shop-accent-3">
                    Pick an option for each of the above to continue.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-shop-heading">Quantity</p>
              <p
                className={`text-[12px] ${
                  outOfStock ? "font-semibold text-shop-accent-3" : "text-shop-text/70"
                }`}
              >
                {product.hideStock
                  ? outOfStock
                    ? "Out of stock"
                    : "In stock"
                  : stockLeft == null || stockLeft > 10
                    ? "In stock"
                    : stockLeft > 0
                      ? `Only ${stockLeft} left`
                      : "Out of stock"}
              </p>
            </div>

            {!outOfStock && (
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
                  disabled={stockLeft != null && qty >= stockLeft}
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5 text-shop-heading" />
                </button>
              </div>
            )}

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
                    isWishlisted
                      ? "fill-shop-accent-1 text-shop-accent-1"
                      : "text-shop-heading"
                  }`}
                  strokeWidth={1.75}
                />
              </button>

              {outOfStock ? (
                <button
                  type="button"
                  onClick={handleAlert}
                  disabled={!canAlert || isSubscribed || alertState.isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-shop-accent-1 py-3.5 text-[14px] font-semibold text-shop-accent-1 transition-colors disabled:opacity-60"
                >
                  {alertState.isLoading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <BellRing className="h-4.5 w-4.5" />
                  )}
                  {isSubscribed
                    ? "We'll email you when it's back"
                    : canAlert
                      ? "Notify me when it's back"
                      : "Out of stock"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || needsSelection}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-semibold text-white transition-colors disabled:opacity-60 ${
                    justAdded ? "bg-emerald-600" : "bg-shop-accent-1 hover:bg-shop-accent-1-dark"
                  }`}
                >
                  {adding ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : justAdded ? (
                    <>
                      <Check className="h-4.5 w-4.5" /> Added to Cart
                    </>
                  ) : needsSelection ? (
                    "Select options"
                  ) : (
                    <>
                      <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                    </>
                  )}
                </button>
              )}
            </div>

            {!outOfStock && !needsSelection && (
              <button
                type="button"
                onClick={buyNow}
                className="w-full rounded-[10px] border border-shop-accent-1 py-3 text-[13.5px] font-semibold text-shop-accent-1"
              >
                Buy Now
              </button>
            )}

            <div className="flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
              <p className="text-[12px] leading-[18px] text-shop-text">
                Protected by <strong className="text-shop-heading">AwaOwn Escrow</strong>.
                Your payment is only released after you confirm delivery.
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-shop-border pt-4">
              <p className="text-[13px] font-semibold text-shop-heading">Description</p>
              <p className="whitespace-pre-line text-[13px] leading-[21px] text-shop-text">
                {sentenceCase(product.description)}
              </p>
            </div>

            <ReviewsBlock
              slug={id}
              reviews={product.reviews ?? []}
              authed={authed}
              onRequireLogin={requireLogin}
            />
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-10 flex flex-col gap-3 border-t border-shop-border pt-6">
            <p className="text-[15px] font-semibold text-shop-heading">You may also like</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function ReviewsBlock({ slug, reviews, authed, onRequireLogin }) {
  const [create, { isLoading }] = useCreateReviewMutation();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!authed) return onRequireLogin();
    setError("");
    try {
      await create({ slug, rating, body }).unwrap();
      setDone(true);
      setBody("");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-shop-border pt-4">
      <p className="text-[13px] font-semibold text-shop-heading">
        Reviews ({reviews.length})
      </p>
      {reviews.length === 0 && (
        <p className="text-[12.5px] text-shop-text/70">No reviews yet.</p>
      )}
      {reviews.map((r) => (
        <div key={r.id} className="flex flex-col gap-1 rounded-[10px] bg-shop-bg p-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < r.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-[#e5e5e5] text-[#e5e5e5]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] font-medium text-shop-heading">
              {r.authorName}
            </span>
          </div>
          {r.body && (
            <p className="text-[12.5px] leading-[18px] text-shop-text">{r.body}</p>
          )}
        </div>
      ))}

      {!done && (
        <form onSubmit={submit} className="flex flex-col gap-2 pt-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-5 w-5 ${
                    n <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-[#e5e5e5] text-[#e5e5e5]"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Share your thoughts (optional)"
            className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[13px] outline-none focus:border-shop-accent-1"
          />
          {error && <p className="text-[12px] text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="self-start rounded-[8px] bg-shop-accent-1 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Posting…" : authed ? "Post review" : "Sign in to review"}
          </button>
        </form>
      )}
      {done && (
        <p className="text-[12.5px] font-medium text-emerald-600">
          Thanks for your review!
        </p>
      )}
    </div>
  );
}

function PageShell({ children }) {
  return (
    <StoreThemeShell>
      <div className="flex min-h-screen w-full flex-col bg-shop-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StoreThemeShell>
  );
}

export default function ProductView() {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ProductDetail />
      </Suspense>
    </ToastProvider>
  );
}
