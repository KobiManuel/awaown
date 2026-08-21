"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Link2, Check, Plus, Minus, Store, Package } from "lucide-react";
import { partnerProfile, formatPrice, splitPartnerProfit } from "@/lib/partner-data";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import { addToStore, removeFromStore } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function PartnerStorePage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const [copiedId, setCopiedId] = useState(null);
  const [category, setCategory] = useState("all");

  const merchantProducts = useSelector((s) => s.merchant.products);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const storeName = useSelector((s) => s.partner.storeName);

  const allEligible = useMemo(
    () =>
      merchantProducts.filter(
        (p) => p.status === "active" && p.offerCommission && p.partnerProfitAmount,
      ),
    [merchantProducts],
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

  const handleToggleStore = (product) => {
    const inStore = storeProductIds.includes(product.id);
    if (inStore) {
      dispatch(removeFromStore(product.id));
      showToast(`Removed from ${storeName}`);
    } else {
      dispatch(addToStore(product.id));
      showToast(`Added to ${storeName}`);
    }
  };

  const handleGetLink = (product) => {
    const link = `${partnerProfile.referralLink}?product=${product.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedId(product.id);
    showToast("Product link copied");
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="My Store" />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-8">
        <Store className="h-5 w-5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Add products to <span className="font-semibold text-shop-heading">{storeName}</span> —
          each one gets its own shareable link, and your full store link shares everything
          you&apos;ve added at once.
        </p>
      </div>

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

      <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
        {eligible.map((product) => {
          const { netProfit } = splitPartnerProfit(product.partnerProfitAmount);
          const partnerPrice = product.price - product.partnerProfitAmount;
          const inStore = storeProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex gap-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg">
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

              <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-shop-bg p-3">
                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                    Partner Price
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

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStore(product)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.5 text-[12.5px] font-semibold transition-colors ${
                    inStore
                      ? "border border-shop-border text-shop-heading hover:bg-shop-bg"
                      : "bg-shop-accent-1 text-white hover:bg-shop-accent-1-dark"
                  }`}
                >
                  {inStore ? (
                    <>
                      <Minus className="h-3.5 w-3.5" />
                      Remove
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Add to My Store
                    </>
                  )}
                </button>
                {inStore && (
                  <button
                    type="button"
                    onClick={() => handleGetLink(product)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.5 text-[12.5px] font-semibold transition-colors ${
                      copiedId === product.id
                        ? "bg-emerald-600 text-white"
                        : "border border-shop-accent-1 text-shop-accent-1 hover:bg-shop-accent-1-light"
                    }`}
                  >
                    {copiedId === product.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" />
                        Get Link
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {eligible.length === 0 && (
          <p className="col-span-2 py-10 text-center text-[13px] text-shop-text">
            {allEligible.length === 0
              ? "No products are enrolled in the Partner Program yet."
              : "No products in this category yet."}
          </p>
        )}
      </div>
    </div>
  );
}
