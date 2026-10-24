"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Pencil, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import {
  useGetMerchantReviewQueueQuery,
  useDecideMerchantProductReviewMutation,
} from "@/lib/api/merchantApi";

function ReviewRow({ product }) {
  const [decide, { isLoading }] = useDecideMerchantProductReviewMutation();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [busyAction, setBusyAction] = useState(null);

  const run = async (decision, patch) => {
    setBusyAction(decision);
    try {
      await decide({ id: product.id, decision, ...patch }).unwrap();
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-shop-bg">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-[13px] font-semibold text-shop-heading">
            {product.title}
          </p>
          <p className="text-[12px] text-shop-text/70">
            {formatPrice(product.price)} · {product.stock} in stock
          </p>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 rounded-[10px] bg-shop-bg p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[11px] text-shop-text/60">Price</p>
              <MoneyInput
                value={price}
                onChange={setPrice}
                className="w-full rounded-[8px] border border-shop-border bg-white px-2.5 py-2 text-[13px] outline-none focus:border-shop-accent-1"
              />
            </div>
            <div>
              <p className="mb-1 text-[11px] text-shop-text/60">Stock</p>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-[8px] border border-shop-border bg-white px-2.5 py-2 text-[13px] outline-none focus:border-shop-accent-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                run("approve", {
                  price: Number(price) || 0,
                  stock: Math.max(0, Number(stock) || 0),
                })
              }
              className="flex-1 rounded-full bg-shop-accent-1 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {busyAction === "approve" ? "Saving…" : "Update & Approve"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-shop-border px-3 py-2 text-[12px] font-semibold text-shop-text"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => run("approve")}
            className="flex-1 rounded-full bg-shop-accent-1 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {busyAction === "approve" ? "Saving…" : "Approve as-is"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 rounded-full border border-shop-border px-3 py-2 text-[12px] font-semibold text-shop-text"
          >
            <Pencil className="h-3 w-3" /> Price/stock changed
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => run("keep_draft")}
            className="rounded-full border border-shop-border px-3 py-2 text-[12px] font-semibold text-shop-text disabled:opacity-60"
          >
            {busyAction === "keep_draft" ? "Saving…" : "Keep hidden"}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => run("archive")}
            className="rounded-full border border-shop-border px-3 py-2 text-[12px] font-semibold text-red-600 disabled:opacity-60"
          >
            {busyAction === "archive" ? "Saving…" : "Archive"}
          </button>
        </div>
      )}

      <Link
        href={`/merchant/products/${product.id}/edit`}
        className="text-[11.5px] font-medium text-shop-accent-1"
      >
        Need to change more (images, description, variants)?
      </Link>
    </div>
  );
}

/**
 * Full-screen, uncloseable - same pattern as MerchantTermsGate. Blocks a
 * legacy merchant's first post-migration login until every product
 * auto-hidden by the backfill (MerchantProfile.productsNeedReview) has an
 * explicit decision. Resolves itself: each decision clears the product's
 * own needsVendorReview flag server-side, and once none remain the backend
 * also clears productsNeedReview, which invalidates "Me" and makes
 * AppFrame's gate unmount - no separate "I'm done" button needed.
 */
export default function ProductReviewGate() {
  const { data, isLoading } = useGetMerchantReviewQueueQuery();
  useBodyScrollLock(true);

  const items = data?.items ?? [];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white font-shop">
      <div className="flex items-center gap-2 border-b border-shop-border px-4 py-4 md:px-8">
        <PackageSearch className="h-5 w-5 text-shop-accent-1" strokeWidth={1.75} />
        <div>
          <p className="text-[14px] font-semibold text-shop-heading">
            Review your listings before they go live
          </p>
          <p className="text-[11.5px] text-shop-text/60">
            These were migrated from your old store and have been hidden from
            shoppers until you confirm the price and stock are still correct.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
              <p className="text-[12.5px] text-shop-text/60">
                All caught up - taking you to your dashboard…
              </p>
            </div>
          ) : (
            items.map((p) => <ReviewRow key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
