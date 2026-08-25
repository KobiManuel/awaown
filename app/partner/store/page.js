"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Link2, Check, Plus, Minus, Store, Package, Tag, Trash2, Boxes } from "lucide-react";
import { partnerProfile, formatPrice, splitPartnerProfit } from "@/lib/partner-data";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import { addToStore, removeFromStore, setProductDiscount, removeOwnProduct } from "@/lib/store/partnerSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function PartnerStorePage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const [copiedId, setCopiedId] = useState(null);
  const [category, setCategory] = useState("all");
  const [discountDrafts, setDiscountDrafts] = useState({});
  const [tab, setTab] = useState("marketplace"); // marketplace | mine

  const merchantProducts = useSelector((s) => s.merchant.products);
  const storeProductIds = useSelector((s) => s.partner.storeProductIds);
  const storeName = useSelector((s) => s.partner.storeName);
  const productDiscounts = useSelector((s) => s.partner.productDiscounts);
  const ownProducts = useSelector((s) => s.partner.ownProducts);

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
      dispatch(setProductDiscount({ productId: product.id, discount: 0 }));
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

  const applyDiscount = (product) => {
    const raw = Number(discountDrafts[product.id] ?? productDiscounts[product.id] ?? 0);
    const clamped = Math.max(0, Math.min(raw, product.partnerProfitAmount));
    dispatch(setProductDiscount({ productId: product.id, discount: clamped }));
    showToast(clamped > 0 ? `Discount set — buyers save an extra ${formatPrice(clamped)}` : "Discount removed");
  };

  const handleRemoveOwn = (product) => {
    dispatch(removeOwnProduct(product.id));
    showToast(`Removed from ${storeName}`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="My Store"
        right={
          <Link
            href="/partner/products/new"
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3.5 py-2 text-[12px] font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Link>
        }
      />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-8">
        <Store className="h-5 w-5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Add products to <span className="font-semibold text-shop-heading">{storeName}</span> —
          from the AwaOwn marketplace, or your own uploads. Each one gets its own
          shareable link, and your full store link shares everything at once.
        </p>
      </div>

      <div className="flex gap-2 px-4 lg:px-8">
        <button
          type="button"
          onClick={() => setTab("marketplace")}
          className={`flex-1 rounded-full border py-2.5 text-[12.5px] font-semibold transition-colors ${
            tab === "marketplace"
              ? "border-shop-accent-1 bg-shop-accent-1 text-white"
              : "border-shop-border text-shop-text"
          }`}
        >
          Add from Marketplace
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`flex-1 rounded-full border py-2.5 text-[12.5px] font-semibold transition-colors ${
            tab === "mine"
              ? "border-shop-accent-1 bg-shop-accent-1 text-white"
              : "border-shop-border text-shop-text"
          }`}
        >
          My Products ({ownProducts.length})
        </button>
      </div>

      {tab === "mine" ? (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {ownProducts.map((product) => (
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
                  <p className="text-[11.5px] text-shop-text/70">{formatPrice(product.price)}</p>
                  {product.productType === "group" ? (
                    <p className="flex items-center gap-1 text-[11px] text-shop-accent-1">
                      <Boxes className="h-3 w-3" />
                      {product.groupItems?.length || 0} items in this bundle
                    </p>
                  ) : (
                    !product.hideStock && (
                      <p className="text-[11px] text-shop-text/60">{product.stock} in stock</p>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-2">
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
                <button
                  type="button"
                  onClick={() => handleRemoveOwn(product)}
                  className="flex items-center justify-center gap-1.5 rounded-[10px] border border-shop-border px-3.5 text-[12.5px] font-semibold text-shop-accent-3 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {ownProducts.length === 0 && (
            <div className="col-span-2 flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-[13px] text-shop-text">
                You haven&apos;t uploaded any products of your own yet.
              </p>
              <Link
                href="/partner/products/new"
                className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
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
          const discount = productDiscounts[product.id] || 0;
          const { netProfit } = splitPartnerProfit(product.partnerProfitAmount - discount);
          const partnerPrice = product.price - product.partnerProfitAmount - discount;
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

              {inStore && (
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-shop-text">
                    <Tag className="h-3.5 w-3.5" />
                    Give buyers an extra discount, out of your own {formatPrice(product.partnerProfitAmount)} cut
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      value={discountDrafts[product.id] ?? discount ?? ""}
                      onChange={(e) =>
                        setDiscountDrafts((prev) => ({
                          ...prev,
                          [product.id]: e.target.value.replace(/[^0-9]/g, ""),
                        }))
                      }
                      inputMode="numeric"
                      placeholder="0"
                      className="w-24 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                    />
                    <button
                      type="button"
                      onClick={() => applyDiscount(product)}
                      className="rounded-[6px] bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                    >
                      Apply
                    </button>
                    <span className="text-[10.5px] text-shop-text/50">
                      max {formatPrice(product.partnerProfitAmount)}
                    </span>
                  </div>
                </div>
              )}

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
        </>
      )}
    </div>
  );
}
