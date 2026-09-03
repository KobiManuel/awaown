"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";
import { SkeletonProductGrid, Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api/catalogApi";

function ShopContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [query, setQuery] = useState("");

  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    limit: 40,
    ...(category !== "all" ? { category } : {}),
    ...(query ? { search: query } : {}),
  });

  const products = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Shop" />

      <div className="flex items-center gap-2 px-4 lg:px-8">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-shop-bg px-4 py-2.5 lg:max-w-[420px]">
          <Search className="h-4 w-4 text-shop-text/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full bg-transparent text-[13px] text-shop-heading outline-none placeholder:text-shop-text/50"
          />
        </div>
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 lg:px-8">
        {catsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
          ))
        ) : (
          <>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                category === "all"
                  ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                  : "border-shop-border text-shop-text"
              }`}
            >
              All
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setCategory(cat.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                  category === cat.slug
                    ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                    : "border-shop-border text-shop-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="px-4 lg:px-8">
        {isLoading ? (
          <SkeletonProductGrid count={8} className="lg:grid-cols-4 lg:gap-5" />
        ) : isError ? (
          <p className="py-10 text-center text-[13px] text-red-600">
            Couldn&apos;t load products. Check your connection and try again.
          </p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-shop-text">
            No products match your search.
          </p>
        ) : (
          <>
            <p className="mb-3 text-[12px] text-shop-text/70">
              {data.total} product{data.total === 1 ? "" : "s"}
              {isFetching ? " · updating…" : ""}
            </p>
            <div
              className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {products.map((product) => (
                <AppProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
