"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import ProductCard from "@/app/Components/Product/ProductCard";
import { SkeletonProductCard } from "@/components/ui/skeleton";
import Countdown from "./Countdown";
import CarouselArrows from "@/app/Components/Product/CarouselArrows";
import { useHomepageContent } from "@/lib/useHomepageContent";
import { useGetProductsQuery, useGetProductQuery } from "@/lib/api/catalogApi";

const DealOfWeek = () => {
  const { content, visibility } = useHomepageContent();
  const deal = content.dealOfWeek ?? {};
  // The countdown target IS what makes the deal live - no admin-set end
  // time (or one that's already passed) means there's nothing to show,
  // regardless of the section's own on/off toggle. Nothing needs to revert
  // when it ends; it just stops rendering and stops discounting at checkout
  // (see backend/src/common/deal-of-week.ts) the moment this goes false.
  const dealEndsAt = deal.endsAt ? new Date(deal.endsAt).getTime() : null;
  // Whether "now" is past dealEndsAt depends on the real clock, which can't
  // be read on the server render (it would disagree with the client's own
  // render instant) - resolved once after mount, same reasoning as
  // Countdown.js's own placeholder-then-real pattern.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect
  const dealLive =
    mounted &&
    !!deal.productId &&
    !!deal.slug &&
    !!dealEndsAt &&
    dealEndsAt > Date.now(); // eslint-disable-line react-hooks/purity
  const { data: dealProduct } = useGetProductQuery(deal.slug, { skip: !dealLive });

  // No real cap on how many products a merchant/admin can mark "featured" -
  // 100 is just a safety ceiling against a pathological case, not a UI
  // limit. The arrows below page through them 4 at a time.
  const { data, isLoading } = useGetProductsQuery({ featured: true, limit: 100 });
  const featured = data?.items ?? [];

  const FEATURED_PAGE_SIZE = 4;
  const [featuredPage, setFeaturedPage] = useState(0);
  const featuredPageCount = Math.max(1, Math.ceil(featured.length / FEATURED_PAGE_SIZE));
  // Clamped here rather than synced back with an effect - if the list
  // shrinks (a product gets unfeatured) while sitting on a now out-of-range
  // page, this just quietly shows the last real page instead of a blank one.
  const currentFeaturedPage = Math.min(featuredPage, featuredPageCount - 1);
  const visibleFeatured = featured.slice(
    currentFeaturedPage * FEATURED_PAGE_SIZE,
    currentFeaturedPage * FEATURED_PAGE_SIZE + FEATURED_PAGE_SIZE,
  );

  const showDeal = visibility.dealOfWeek && dealLive && !!dealProduct;
  const showFeatured = visibility.featuredProducts && (isLoading || featured.length > 0);
  if (!showDeal && !showFeatured) return null;

  const discount = Number(deal.discountAmount) || 0;
  const dealPrice = dealProduct ? Math.max(0, dealProduct.price - discount) : 0;

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {showDeal && (
          <div className="w-full lg:w-[360px] lg:shrink-0">
            <SectionHeader title="Deal Of The Week" />
            <div className="flex flex-col gap-4 rounded-[10px] bg-white p-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg">
                <Image
                  src={dealProduct.images?.[0]}
                  alt={dealProduct.title}
                  fill
                  className="object-cover"
                  sizes="340px"
                />
              </div>
              {dealProduct.vendor && (
                <span className="w-fit rounded-full bg-shop-accent-1-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-shop-accent-1">
                  {dealProduct.vendor}
                </span>
              )}
              <h3 className="text-[18px] font-semibold leading-[24px] text-shop-heading">
                {dealProduct.title}
              </h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(dealProduct.rating ?? 0)
                        ? "fill-shop-accent-1 text-shop-accent-1"
                        : "fill-shop-border text-shop-border"
                    }`}
                  />
                ))}
                <span className="text-[12px] text-shop-text/70">
                  ({dealProduct.reviewCount ?? 0})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[22px] font-semibold text-shop-heading">
                  {formatPrice(dealPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-[14px] text-shop-text/60 line-through">
                    {formatPrice(dealProduct.price)}
                  </span>
                )}
              </div>
              <Countdown target={dealEndsAt} />
              <Link
                href={`/product/${deal.slug}`}
                className="mt-1 w-fit bg-shop-accent-1 px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-shop-accent-1-dark"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}

        {showFeatured && (
          <div className="flex-1">
            <SectionHeader title={content.featuredProducts?.sectionTitle || "Featured Products"}>
              <CarouselArrows
                onPrev={() => setFeaturedPage((p) => Math.max(0, p - 1))}
                onNext={() =>
                  setFeaturedPage((p) => Math.min(featuredPageCount - 1, p + 1))
                }
                prevDisabled={currentFeaturedPage === 0}
                nextDisabled={currentFeaturedPage >= featuredPageCount - 1}
              />
            </SectionHeader>
            <div className="grid grid-cols-2 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)
                : visibleFeatured.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealOfWeek;
