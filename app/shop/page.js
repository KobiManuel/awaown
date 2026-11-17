"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Header from "@/app/Components/Header/header";
import Footer from "@/app/Components/Footer/footer";
import ProductCard from "@/app/Components/Product/ProductCard";
import { ToastProvider } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonProductGrid, Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api/catalogApi";

function ShopContent() {
  const router = useRouter();
  const params = useSearchParams();
  const urlCategory = params.get("category") || "all";
  const urlQuery = params.get("q") || "";
  const sort = params.get("sort") || undefined;
  const onSale = params.get("deals") === "1";

  const [category, setCategory] = useState(urlCategory);
  const [query, setQuery] = useState(urlQuery);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => setCategory(urlCategory), [urlCategory]);
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  // Reset back to page 1 whenever the filters change, so switching category
  // or searching doesn't keep appending to a now-stale accumulated list.
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [category, query, sort, onSale]);

  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    limit: 48,
    page,
    ...(category !== "all" ? { category } : {}),
    ...(query ? { search: query } : {}),
    ...(sort ? { sort } : {}),
    ...(onSale ? { onSale: true } : {}),
  });

  useEffect(() => {
    if (!data) return;
    setProducts((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
    setTotal(data.total);
  }, [data, page]);

  const hasMore = data ? page < data.pageCount : false;

  const pickCategory = (slug) => {
    setCategory(slug);
    const sp = new URLSearchParams();
    if (slug !== "all") sp.set("category", slug);
    if (query) sp.set("q", query);
    if (sort) sp.set("sort", sort);
    if (onSale) sp.set("deals", "1");
    router.replace(`/shop${sp.toString() ? `?${sp}` : ""}`);
  };

  const heading = onSale
    ? "Top Deals"
    : sort === "newest"
      ? "New Arrivals"
      : "Shop";

  return (
    <div className="flex min-h-screen w-full flex-col bg-shop-bg">
      <Header />
      <main className="mx-auto w-full max-w-[1460px] flex-1 px-4 py-6 font-shop md:px-8">
        <h1 className="text-[20px] font-semibold text-shop-heading">{heading}</h1>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm md:max-w-[420px]">
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

        <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {catsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
            ))
          ) : (
            <>
              <button
                type="button"
                onClick={() => pickCategory("all")}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                  category === "all"
                    ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                    : "border-shop-border bg-white text-shop-text"
                }`}
              >
                All
              </button>
              {(categories ?? []).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => pickCategory(cat.slug)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                    category === cat.slug
                      ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                      : "border-shop-border bg-white text-shop-text"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="mt-6">
          {products.length === 0 && isLoading ? (
            <SkeletonProductGrid count={12} className="lg:grid-cols-5 lg:gap-5" />
          ) : isError ? (
            <p className="py-10 text-center text-[13px] text-red-600">
              Couldn&apos;t load products. Try again.
            </p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-shop-text">
              No products match your search.
            </p>
          ) : (
            <>
              <p className="mb-3 text-[12px] text-shop-text/70">
                {total} product{total === 1 ? "" : "s"}
                {page === 1 && isFetching ? " · updating…" : ""}
              </p>
              <div
                className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5 ${
                  page === 1 && isFetching ? "opacity-60" : ""
                }`}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    className="rounded-full border border-shop-border bg-white px-6 py-2.5 text-[13px] font-medium text-shop-heading transition-colors hover:bg-shop-bg disabled:opacity-60"
                  >
                    {isFetching ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PublicShopPage() {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ShopContent />
      </Suspense>
    </ToastProvider>
  );
}
