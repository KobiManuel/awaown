"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Store, Package, Check } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetPartnerMarketplaceQuery,
  useAddToPartnerStoreMutation,
} from "@/lib/api/partnerApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function PartnerMarketplacePage() {
  const showToast = useToast();
  const [category, setCategory] = useState("all");
  const { data, isLoading, isError } = useGetPartnerMarketplaceQuery();
  const [addToStore, { isLoading: adding }] = useAddToPartnerStoreMutation();

  const all = data?.items ?? [];

  const counts = useMemo(() => {
    const c = {};
    for (const p of all) if (p.category) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [all]);

  const filtered =
    category === "all" ? all : all.filter((p) => p.category === category);

  const handleAdd = async (p) => {
    try {
      await addToStore(p.productId).unwrap();
      showToast("Added to your store");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Add from Marketplace"
        backHref="/partner/store"
        showBackOnDesktop
      />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-8">
        <Store
          className="h-5 w-5 shrink-0 text-shop-accent-1"
          strokeWidth={1.75}
        />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Only products merchants have enrolled in the Partner Program show up
          here. Add one and you earn the set profit on every sale through your
          link.
        </p>
      </div>

      {all.length > 0 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium ${
              category === "all"
                ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                : "border-shop-border text-shop-text"
            }`}
          >
            All ({all.length})
          </button>
          {PRODUCT_CATEGORIES.filter((c) => counts[c.slug]).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium ${
                category === c.slug
                  ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                  : "border-shop-border text-shop-text"
              }`}
            >
              {c.label} ({counts[c.slug]})
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load the marketplace.
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {filtered.map((product) => (
            <div
              key={product.productId}
              className={`relative flex flex-col gap-3 rounded-[14px] border-2 p-3.5 ${
                product.inStore
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-dashed border-shop-accent-1/40 bg-shop-bg"
              }`}
            >
              <div className="flex gap-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  ) : (
                    <Package
                      className="h-6 w-6 text-shop-text/40"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">
                    {product.title}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">
                    Public Price: {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-white p-3">
                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                    Buyer Price
                  </p>
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {formatPrice(product.buyerPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                    Your Profit
                  </p>
                  <p className="text-[13px] font-semibold text-emerald-600">
                    {formatPrice(Math.round(product.partnerProfit * 0.8))}
                  </p>
                  <p className="text-[9.5px] text-shop-text/50">after 20% platform fee</p>
                </div>
              </div>

              {product.inStore ? (
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-[10px] border border-emerald-300 py-2.5 text-[12.5px] font-semibold text-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> In your store
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  disabled={adding}
                  className="flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-2.5 text-[12.5px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:opacity-70"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to My Store
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-10 text-center text-[13px] text-shop-text">
              No products in this category yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
