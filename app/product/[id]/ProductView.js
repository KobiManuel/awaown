"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
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
} from "lucide-react";
import {
  resolveVariant,
  defaultVariantSelection,
  formatPrice,
} from "@/lib/dashboard-data";
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
  useGetWishlistQuery,
  useAddToCartMutation,
  useToggleWishlistMutation,
} from "@/lib/api/commerceApi";
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
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !authed });

  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const [addToCart, addState] = useAddToCartMutation();
  const [toggleWishlist, wishState] = useToggleWishlistMutation();

  useEffect(() => {
    if (product && Object.keys(selected).length === 0 && product.variants?.length) {
      setSelected(defaultVariantSelection(product));
    }
  }, [product]); // eslint-disable-line

  const resolved = useMemo(
    () => (product ? resolveVariant(product, selected) : null),
    [product, selected],
  );

  const isWishlisted = !!(
    product && (wishlist?.items ?? []).some((i) => i.id === product.id || i.productId === product.productId)
  );

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
  const stockLeft = product.stock;

  const handleWishlist = async () => {
    if (wishState.isLoading) return;
    if (!authed) return requireLogin();
    try {
      await toggleWishlist(product.productId).unwrap();
      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      showToast("Couldn't update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!authed) {
      requireLogin();
      return false;
    }
    try {
      await addToCart({
        productId: product.productId,
        qty,
        variantId: resolved.variantId ?? undefined,
        variantLabel: resolved.variantLabel ?? undefined,
        ref: refCode ?? undefined,
      }).unwrap();
      setJustAdded(true);
      showToast("Added to cart");
      setTimeout(() => setJustAdded(false), 1600);
      return true;
    } catch (err) {
      showToast(errorMessage(err));
      return false;
    }
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 font-shop lg:py-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-[12.5px] text-shop-text/70 hover:text-shop-accent-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Continue shopping
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-square overflow-hidden rounded-[16px] bg-shop-bg lg:sticky lg:top-28 lg:self-start">
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
              className="object-contain p-8"
              sizes="(max-width: 1024px) 480px, 540px"
              priority
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:mt-0">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-medium uppercase tracking-wide text-shop-accent-1">
                {product.vendor}
              </span>
              <h1 className="text-[20px] font-semibold leading-[26px] text-shop-heading">
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
              <span className="flex w-fit items-center gap-1.5 rounded-full border border-shop-border bg-shop-bg py-1 pl-1 pr-3 text-[12px] font-medium text-shop-heading">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-shop-accent-1-light">
                  <Store className="h-3 w-3 text-shop-accent-1" strokeWidth={1.75} />
                </span>
                Sold by {product.vendor}
                <ChevronRight className="h-3 w-3 text-shop-text/50" />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[24px] font-bold text-shop-heading">
                {formatPrice(resolved.price)}
              </span>
              {product.compareAt && (
                <span className="text-[14px] text-shop-text/50 line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {(product.variants ?? []).map((group) => (
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

            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-shop-heading">Quantity</p>
              <p className="text-[12px] text-shop-text/70">
                {stockLeft == null || stockLeft > 10
                  ? "In stock"
                  : stockLeft > 0
                    ? `Only ${stockLeft} left`
                    : "Out of stock"}
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
                onClick={() => setQty((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
              >
                <Plus className="h-3.5 w-3.5 text-shop-heading" />
              </button>
            </div>

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
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addState.isLoading || product.inStock === false}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-semibold text-white transition-colors disabled:opacity-60 ${
                  justAdded ? "bg-emerald-600" : "bg-shop-accent-1 hover:bg-shop-accent-1-dark"
                }`}
              >
                {addState.isLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check className="h-4.5 w-4.5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                if (await handleAddToCart()) router.push("/dashboard/checkout");
              }}
              className="w-full rounded-[10px] border border-shop-accent-1 py-3 text-[13.5px] font-semibold text-shop-accent-1"
            >
              Buy Now
            </button>

            <div className="flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
              <p className="text-[12px] leading-[18px] text-shop-text">
                Protected by <strong className="text-shop-heading">AwaOwn Escrow</strong> —
                your payment is only released after you confirm delivery.
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-shop-border pt-4">
              <p className="text-[13px] font-semibold text-shop-heading">Description</p>
              <p className="text-[13px] leading-[21px] text-shop-text">
                {product.description}
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
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
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
