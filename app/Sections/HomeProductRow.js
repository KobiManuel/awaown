"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "@/app/Components/Product/ProductCard";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import { SkeletonProductCard } from "@/components/ui/skeleton";
import { useGetProductsQuery } from "@/lib/api/catalogApi";

/**
 * Marketing-homepage product row backed by the real catalog. `params` is passed
 * straight to GET /products (e.g. { sort: "newest", limit: 12 } or
 * { featured: true }). Cards route to the public /product/[slug] page.
 */
export default function HomeProductRow({
  title,
  params = {},
  href = "/shop",
  showSeeAll = false,
}) {
  const trackRef = useRef(null);
  const { data, isLoading } = useGetProductsQuery({ limit: 12, ...params });
  const products = data?.items ?? [];

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const w = card ? card.getBoundingClientRect().width + 20 : 260;
    track.scrollBy({ left: dir * w * 2, behavior: "smooth" });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title={title}>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCards(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCards(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </SectionHeader>
      <div
        ref={trackRef}
        className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                data-card
                className="w-[46vw] shrink-0 sm:w-[220px] md:w-[240px] lg:w-[260px]"
              >
                <SkeletonProductCard />
              </div>
            ))
          : products.map((p) => (
              <div
                data-card
                key={p.id}
                className="w-[46vw] shrink-0 sm:w-[220px] md:w-[240px] lg:w-[260px]"
              >
                <ProductCard product={p} />
              </div>
            ))}
      </div>
      {showSeeAll && !isLoading && products.length > 0 && (
        <div className="mt-3 flex justify-end">
          <Link
            href={href}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-accent-1 hover:underline"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
