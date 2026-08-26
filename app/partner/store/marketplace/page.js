"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Store, Package } from "lucide-react";
import { formatPrice, splitPartnerProfit } from "@/lib/partner-data";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import { addToStore } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function PartnerMarketplacePage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const [category, setCategory] = useState("all");

  const merchantProducts = useSelector((s) => s.merchant.products);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const storeName = useSelector((s) => s.partner.storeName);
  const productDiscounts = useSelector((s) => s.partner.productDiscounts);

  const allProgramProducts = useMemo(
    () =>
      merchantProducts.filter(
        (p) => p.status === "active" && p.offerCommission && p.partnerProfitAmount,
      ),
    [merchantProducts],
  );

  const allEligible = useMemo(
    () => allProgramProducts.filter((p) => !storeProductIds.includes(p.id)),
    [allProgramProducts, storeProductIds],
  );

  const eligible = useMemo(
    () => (category === "all" ? allEligible : allEligible.filter((p) => p.category === category)),
    [allEligible, category],
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const p of allEligible) counts[p.category] = (counts[p.category] || 0) + 1;
    return counts;
  }, [allEligible]);

  const handleAddToStore = (product) => {
    dispatch(addToStore(product.id));
    showToast(`Added to ${storeName}`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Add from Marketplace" backHref="/partner/store" showBackOnDesktop />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-8">
        <Store className="h-5 w-5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Add products from the AwaOwn marketplace to{" "}
          <span className="font-semibold text-shop-heading">{storeName}</span> — each one
          gets its own shareable link, and your full store link shares everything at once.
        </p>
      </div>

      {allEligible.length > 0 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
              category === "all"
                ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                : "border-shop-border text-shop-text"
            }`}
          >
            All ({allEligible.length})
          </button>
          {PRODUCT_CATEGORIES.filter((c) => categoryCounts[c.slug]).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                category === c.slug
                  ? "border-shop-accent-1 bg-shop-accent-1 text-white"
                  : "border-shop-border text-shop-text"
              }`}
            >
              {c.label} ({categoryCounts[c.slug]})
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
        {eligible.map((product) => {
          const discount = productDiscounts[product.id] || 0;
          const { netProfit } = splitPartnerProfit(product.partnerProfitAmount - discount);
          const partnerPrice = product.price - product.partnerProfitAmount - discount;

          return (
            <div
              key={product.id}
              className="relative flex flex-col gap-3 rounded-[14px] border-2 border-dashed border-shop-accent-1/40 bg-shop-bg p-3.5"
            >
              <span className="absolute right-3.5 top-3.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-shop-accent-1">
                Not in store
              </span>

              <div className="flex gap-3 pr-20">
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
                    <Package className="h-6 w-6 text-shop-text/40" strokeWidth={1.5} />
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
                    {formatPrice(partnerPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                    Your Profit
                  </p>
                  <p className="text-[13px] font-semibold text-emerald-600">
                    {formatPrice(netProfit)}
                  </p>
                  <p className="text-[9.5px] text-shop-text/50">after 20% platform fee</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToStore(product)}
                className="flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to My Store
              </button>
            </div>
          );
        })}
        {eligible.length === 0 && (
          <p className="col-span-2 py-10 text-center text-[13px] text-shop-text">
            {allProgramProducts.length === 0
              ? "No products are enrolled in the Partner Program yet."
              : allEligible.length === 0
                ? "No new items to add from marketplace."
                : "No products in this category yet."}
          </p>
        )}
      </div>
    </div>
  );
}
