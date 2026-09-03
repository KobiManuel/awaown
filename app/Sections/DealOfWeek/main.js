"use client";

import React from "react";
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
import { useGetProductsQuery } from "@/lib/api/catalogApi";

const DealOfWeek = () => {
  const { content, visibility } = useHomepageContent();
  const { data, isLoading } = useGetProductsQuery({ featured: true, limit: 6 });
  const featured = data?.items ?? [];

  const showDeal = visibility.dealOfWeek;
  const showFeatured = visibility.featuredProducts && (isLoading || featured.length > 0);
  if (!showDeal && !showFeatured) return null;

  const p = content.dealOfWeek ?? {};

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {showDeal && p.image && (
          <div className="w-full lg:w-[360px] lg:shrink-0">
            <SectionHeader title="Deal Of The Week" />
            <div className="flex flex-col gap-4 rounded-[10px] bg-white p-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-[8px] bg-shop-bg">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-contain p-8"
                  sizes="340px"
                />
              </div>
              {p.vendor && (
                <span className="w-fit rounded-full bg-shop-accent-1-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-shop-accent-1">
                  {p.vendor}
                </span>
              )}
              <h3 className="text-[18px] font-semibold leading-[24px] text-shop-heading">
                {p.title}
              </h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < (p.rating ?? 0)
                        ? "fill-shop-accent-1 text-shop-accent-1"
                        : "fill-shop-border text-shop-border"
                    }`}
                  />
                ))}
                <span className="text-[12px] text-shop-text/70">({p.reviews ?? 0})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[22px] font-semibold text-shop-heading">
                  {formatPrice(p.price ?? 0)}
                </span>
                {p.compareAt ? (
                  <span className="text-[14px] text-shop-text/60 line-through">
                    {formatPrice(p.compareAt)}
                  </span>
                ) : null}
              </div>
              <Countdown />
              <Link
                href="/shop"
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
              <CarouselArrows targetSelector="[data-featured-track]" />
            </SectionHeader>
            <div
              data-featured-track
              className="hide-scrollbar grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-flow-row lg:grid-cols-2"
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[210px] sm:w-auto">
                      <SkeletonProductCard />
                    </div>
                  ))
                : featured.slice(0, 4).map((prod) => (
                    <div key={prod.id} className="w-[210px] sm:w-auto">
                      <ProductCard product={prod} />
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealOfWeek;
