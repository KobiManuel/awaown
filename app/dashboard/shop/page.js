"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, dashboardCategories } from "@/lib/dashboard-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        !query || p.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop">
      <AppHeader title="Shop" />

      <div className="flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-shop-bg px-4 py-2.5">
          <Search className="h-4 w-4 text-shop-text/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full bg-transparent text-[13px] text-shop-heading outline-none placeholder:text-shop-text/50"
          />
        </div>
        <button
          type="button"
          aria-label="Filters"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-shop-border"
        >
          <SlidersHorizontal className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
        </button>
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4">
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
        {dashboardCategories.map((cat) => (
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
            {cat.title}
          </button>
        ))}
      </div>

      <div className="px-4">
        <p className="mb-3 text-[12px] text-shop-text/70">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-shop-text">
            No products match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <AppProductCard key={product.id} product={product} />
            ))}
          </div>
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
