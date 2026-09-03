"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link2, Check, Minus, Store, Package, Tag, Plus, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetPartnerStoreQuery,
  useGetPartnerOverviewQuery,
  useRemoveFromPartnerStoreMutation,
  useSetPartnerDiscountMutation,
} from "@/lib/api/partnerApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function PartnerStorePage() {
  const showToast = useToast();
  const { data, isLoading, isError } = useGetPartnerStoreQuery();
  const { data: overview } = useGetPartnerOverviewQuery();
  const [removeFromStore] = useRemoveFromPartnerStoreMutation();
  const [setDiscount, discountState] = useSetPartnerDiscountMutation();

  const [copiedId, setCopiedId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const items = data?.items ?? [];
  const refCode = overview?.profile?.referralCode;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const handleRemove = async (p) => {
    try {
      await removeFromStore(p.productId).unwrap();
      showToast("Removed from your store");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const handleGetLink = (p) => {
    const link = `${origin}/product/${p.slug}?ref=${refCode}`;
    if (navigator?.clipboard) navigator.clipboard.writeText(link).catch(() => {});
    setCopiedId(p.productId);
    showToast("Product link copied");
    setTimeout(() => setCopiedId(null), 1600);
  };

  const applyDiscount = async (p) => {
    const raw = Number(drafts[p.productId] ?? p.discount ?? 0);
    try {
      await setDiscount({ productId: p.productId, discount: raw }).unwrap();
      showToast(raw > 0 ? "Discount updated" : "Discount removed");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="My Store"
        backHref="/partner"
        right={
          <Link
            href="/partner/store/marketplace"
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            <Plus className="h-3.5 w-3.5" />
            Add from Marketplace
          </Link>
        }
      />

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-8">
        <Store
          className="h-5 w-5 shrink-0 text-shop-accent-1"
          strokeWidth={1.75}
        />
        <p className="text-[12px] leading-[18px] text-shop-text">
          Products live in your store. Each has its own shareable link with your
          referral code baked in.
        </p>
      </div>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={3} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load your store.
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <Store className="h-8 w-8 text-shop-text/30" strokeWidth={1.5} />
          <p className="text-[13px] text-shop-text">
            Your store doesn&apos;t have any products yet.
          </p>
          <Link
            href="/partner/store/marketplace"
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-5 py-2.5 text-[12.5px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            <Plus className="h-3.5 w-3.5" />
            Add from Marketplace
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {items.map((product) => (
            <div
              key={product.productId}
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

              <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-shop-bg p-3">
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
                    {formatPrice(product.yourNetProfit)}
                  </p>
                  <p className="text-[9.5px] text-shop-text/50">
                    after 20% platform fee
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-shop-text">
                  <Tag className="h-3.5 w-3.5" />
                  Extra discount from your own{" "}
                  {formatPrice(product.maxDiscount)} cut
                </span>
                <div className="flex items-center gap-2">
                  <input
                    value={drafts[product.productId] ?? product.discount ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.productId]: e.target.value.replace(
                          /[^0-9]/g,
                          "",
                        ),
                      }))
                    }
                    inputMode="numeric"
                    placeholder="0"
                    className="w-24 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
                  />
                  <button
                    type="button"
                    onClick={() => applyDiscount(product)}
                    disabled={discountState.isLoading}
                    className="rounded-[6px] bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-70"
                  >
                    Apply
                  </button>
                  <span className="text-[10.5px] text-shop-text/50">
                    max {formatPrice(product.maxDiscount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRemove(product)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-shop-border py-2.5 text-[12.5px] font-semibold text-shop-heading hover:bg-shop-bg"
                >
                  <Minus className="h-3.5 w-3.5" />
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => handleGetLink(product)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.5 text-[12.5px] font-semibold ${
                    copiedId === product.productId
                      ? "bg-emerald-600 text-white"
                      : "border border-shop-accent-1 text-shop-accent-1 hover:bg-shop-accent-1-light"
                  }`}
                >
                  {copiedId === product.productId ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Link2 className="h-3.5 w-3.5" /> Get Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
