"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, X, Loader2, Users2 } from "lucide-react";
import {
  formatPrice,
  PRODUCT_CATEGORIES,
  PROCESSING_TIME_OPTIONS,
  PARTNER_PROGRAM_MIN_PROFIT,
} from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMerchantProductsQuery,
  useUpdateMerchantProductMutation,
} from "@/lib/api/merchantApi";
import { useMediaUpload } from "@/lib/api/mediaApi";
import { errorMessage } from "@/lib/api/errorMessage";

const FIELD =
  "w-full rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";
const LABEL = "text-[12px] font-semibold text-shop-heading";
const MAX_IMAGES = 4;

export default function EditMerchantProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const showToast = useToast();

  const { data, isLoading } = useGetMerchantProductsQuery();
  const product = useMemo(
    () => (data?.items ?? []).find((p) => p.productId === id),
    [data, id],
  );

  const [update, { isLoading: saving }] = useUpdateMerchantProductMutation();
  const { upload, uploading } = useMediaUpload("products");

  const [form, setForm] = useState(null);

  // seed the form once the product is in cache
  if (form === null && product) {
    setForm({
      title: product.title ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      category: product.category ?? PRODUCT_CATEGORIES[0].slug,
      processingTime: product.processingTime ?? PROCESSING_TIME_OPTIONS[1].id,
      images: product.images ?? [],
      status: product.status === "DRAFT" ? "DRAFT" : "ACTIVE",
      hideStock: !!product.hideStock,
      offerCommission: !!product.offerCommission,
      partnerProfitAmount: product.partnerProfitAmount
        ? String(product.partnerProfitAmount)
        : "",
    });
  }

  if (isLoading || (!product && !data)) {
    return (
      <div className="flex flex-col gap-4 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[640px]">
        <AppHeader title="Edit Product" backHref="/merchant/products" showBackOnDesktop />
        <div className="px-4">
          <Skeleton className="h-64 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!product || !form) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Edit Product" backHref="/merchant/products" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This product couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await upload(file);
    if (url) set({ images: [...form.images, url].slice(0, MAX_IMAGES) });
    else showToast("Image upload failed");
  };

  const profit = Number(form.partnerProfitAmount) || 0;
  const profitTooLow =
    form.offerCommission && profit < PARTNER_PROGRAM_MIN_PROFIT;

  const valid =
    form.title.trim() &&
    Number(form.price) > 0 &&
    !profitTooLow;

  const save = async () => {
    if (!valid || saving) return;
    try {
      await update({
        id: product.productId,
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category,
        processingTime: form.processingTime,
        images: form.images,
        status: form.status,
        hideStock: form.hideStock,
        offerCommission: form.offerCommission,
        partnerProfitAmount: form.offerCommission ? profit : 0,
      }).unwrap();
      showToast("Product updated");
      router.push("/merchant/products");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[640px]">
      <AppHeader title="Edit Product" backHref="/merchant/products" showBackOnDesktop />

      {product.approvalStatus === "REJECTED" && product.rejectionReason && (
        <p className="mx-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-shop-accent-3">
          Rejected: {product.rejectionReason}. Edit and it will be re-reviewed.
        </p>
      )}

      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Title</label>
          <input
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            className={FIELD}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            className={`${FIELD} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Price (₦)</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set({ price: e.target.value })}
              className={FIELD}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Stock</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.stock}
              onChange={(e) => set({ stock: e.target.value })}
              className={FIELD}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              className={FIELD}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Processing time</label>
            <select
              value={form.processingTime}
              onChange={(e) => set({ processingTime: e.target.value })}
              className={FIELD}
            >
              {PROCESSING_TIME_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Photos</label>
          <div className="flex flex-wrap gap-2.5">
            {form.images.map((src, i) => (
              <div
                key={src}
                className="relative h-20 w-20 overflow-hidden rounded-[10px] border border-shop-border bg-shop-bg"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() =>
                    set({ images: form.images.filter((_, idx) => idx !== i) })
                  }
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {form.images.length < MAX_IMAGES && (
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-shop-border text-shop-text/50">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <span className="text-[10px]">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={addImage}
                />
              </label>
            )}
          </div>
        </div>

        {/* Status + hide stock */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Listing status</label>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value })}
              className={FIELD}
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft (hidden from shoppers)</option>
            </select>
          </div>
          <label className="flex items-end gap-2 pb-2.5 text-[12.5px] text-shop-heading">
            <input
              type="checkbox"
              checked={form.hideStock}
              onChange={(e) => set({ hideStock: e.target.checked })}
              className="h-4 w-4 accent-shop-accent-1"
            />
            Hide stock count
          </label>
        </div>

        {/* Partner program */}
        <div className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border p-3.5">
          <label className="flex items-center gap-2 text-[12.5px] font-semibold text-shop-heading">
            <input
              type="checkbox"
              checked={form.offerCommission}
              onChange={(e) => set({ offerCommission: e.target.checked })}
              className="h-4 w-4 accent-shop-accent-1"
            />
            <Users2 className="h-4 w-4 text-shop-accent-1" />
            Offer this product to Partners
          </label>
          {form.offerCommission && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11.5px] text-shop-text">
                Partner profit per sale (min {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)})
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={form.partnerProfitAmount}
                onChange={(e) => set({ partnerProfitAmount: e.target.value })}
                className={FIELD}
              />
              {profitTooLow && (
                <p className="text-[11px] font-medium text-shop-accent-3">
                  Must be at least {formatPrice(PARTNER_PROGRAM_MIN_PROFIT)}.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!valid || saving || uploading}
          className="mt-1 flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
