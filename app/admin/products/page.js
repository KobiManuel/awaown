"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Star, BadgeCheck, X, Trash2, Store, User } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminProductsQuery,
  useSetAdminProductApprovalMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

function ProductDetailModal({ product, onClose, onApprove, onReject, onRemove, tab }) {
  const [activeImage, setActiveImage] = useState(0);
  if (!product) return null;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 lg:items-center" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-[560px] flex-col gap-4 overflow-y-auto rounded-t-[20px] bg-white p-5 lg:rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading">Product Details</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
          >
            <X className="h-4 w-4 text-shop-heading" />
          </button>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-shop-bg">
          {images[activeImage] ? (
            <Image src={images[activeImage]} alt={product.title} fill className="object-contain p-6" sizes="560px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-10 w-10 text-shop-text/40" strokeWidth={1.5} />
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] border-2 bg-shop-bg ${
                  i === activeImage ? "border-shop-accent-1" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-contain p-1.5" sizes="56px" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-semibold text-shop-heading">{product.title}</p>
          <p className="text-[13px] text-shop-text">{product.description || "No description provided."}</p>
        </div>

        <div className="flex items-center gap-3 rounded-[10px] bg-shop-bg p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
            <Store className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-shop-heading">
              {product.storeName || product.vendor}
            </p>
            {product.ownerName && (
              <p className="flex items-center gap-1 truncate text-[11px] text-shop-text/70">
                <User className="h-3 w-3" />
                {product.ownerName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-[12.5px]">
          <div className="rounded-[10px] bg-shop-bg p-3">
            <p className="text-shop-text/60">Category</p>
            <p className="font-semibold text-shop-heading">{product.category || "—"}</p>
          </div>
          <div className="rounded-[10px] bg-shop-bg p-3">
            <p className="text-shop-text/60">Price</p>
            <p className="font-semibold text-shop-heading">{formatPrice(product.price)}</p>
          </div>
          {product.variants?.length ? (
            <div className="col-span-2 rounded-[10px] bg-shop-bg p-3">
              <p className="mb-1.5 text-shop-text/60">Varieties ({product.variants.length})</p>
              <div className="flex flex-col gap-1.5">
                {product.variants.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 text-[12px]">
                    <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-[5px] bg-white">
                      {v.imageUrl ? (
                        <Image src={v.imageUrl} alt={v.label} fill className="object-cover" sizes="24px" />
                      ) : null}
                    </span>
                    <span className="flex-1 text-shop-heading">{v.label}</span>
                    <span className="text-shop-text">
                      {formatPrice(v.price)} · {v.stock <= 0 ? "out of stock" : `${v.stock} in stock`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] bg-shop-bg p-3">
              <p className="text-shop-text/60">Stock</p>
              <p className="font-semibold text-shop-heading">{product.stock}</p>
            </div>
          )}
          {product.offerCommission && (
            <div className="col-span-2 rounded-[10px] bg-shop-bg p-3">
              <p className="text-shop-text/60">Partner Program</p>
              <p className="font-semibold text-shop-heading">
                Enrolled — {formatPrice(product.partnerProfitAmount)} profit per sale
              </p>
            </div>
          )}
          {product.rejectionReason && (
            <div className="col-span-2 rounded-[10px] bg-red-50 p-3">
              <p className="text-shop-accent-3/80">Rejection Reason</p>
              <p className="font-semibold text-shop-accent-3">{product.rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-shop-border pt-3">
          {tab !== "APPROVED" && (
            <button
              type="button"
              onClick={() => onApprove(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2.5 text-[12.5px] font-semibold text-white"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Approve
            </button>
          )}
          {tab !== "REJECTED" && (
            <button
              type="button"
              onClick={() => onReject(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-shop-border py-2.5 text-[12.5px] font-semibold text-shop-heading"
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(product)}
            aria-label="Remove product"
            className="flex items-center justify-center rounded-[8px] border border-shop-border px-3.5 text-shop-accent-3"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

export default function AdminProductsPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminProductsQuery();
  const [setApproval] = useSetAdminProductApprovalMutation();
  const [tab, setTab] = useState("PENDING");
  const [detailProduct, setDetailProduct] = useState(null);

  const products = data?.items ?? [];
  const filtered = products.filter((p) => (p.approvalStatus || "APPROVED") === tab);

  const act = async (id, action, reason, ok) => {
    try {
      await setApproval({ id, action, reason }).unwrap();
      if (ok) showToast(ok);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  const handleApprove = async (product) => {
    const res = await confirm({
      title: `Approve "${product.title}"?`,
      message: "It goes live on the marketplace and the merchant is emailed.",
      confirmLabel: "Approve",
    });
    if (!res) return;
    act(product.id, "approve", undefined, `${product.title} approved`);
  };

  const handleReject = async (product) => {
    const res = await confirm({
      title: `Reject "${product.title}"?`,
      message: "The merchant is emailed the reason and the product stays as a draft.",
      confirmLabel: "Reject",
      tone: "danger",
      reason: { label: "Reason for rejection (emailed to the merchant)", required: true },
    });
    if (!res) return;
    act(product.id, "reject", res.reason, `${product.title} rejected`);
  };

  const handleRemove = async (product) => {
    const res = await confirm({
      title: `Remove "${product.title}"?`,
      message: "This archives the listing. The merchant is notified.",
      confirmLabel: "Remove",
      tone: "danger",
      reason: { label: "Reason for removal (emailed to the merchant)", required: true },
    });
    if (!res) return;
    act(product.id, "remove", res.reason, `${product.title} removed`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Products" backHref="/admin" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Approve products before they go live, reject with a reason, or remove fraudulent listings.
      </p>

      <div className="flex gap-2 px-4 lg:px-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors ${
              tab === t.id ? "border-shop-accent-1 bg-shop-accent-1 text-white" : "border-shop-border text-shop-text"
            }`}
          >
            {t.label} ({products.filter((p) => (p.approvalStatus || "APPROVED") === t.id).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setDetailProduct(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setDetailProduct(p);
                }}
                className="flex cursor-pointer items-center gap-3"
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg">
                  {p.image ? (
                    <Image src={p.image} alt={p.title} fill className="object-contain p-1.5" sizes="56px" />
                  ) : (
                    <Package className="h-5 w-5 text-shop-text/40" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">{p.title}</p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {formatPrice(p.price)} · {p.category || "—"}
                  </p>
                  {p.rejectionReason && (
                    <p className="mt-0.5 text-[10.5px] text-shop-accent-3">Reason: {p.rejectionReason}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Toggle featured"
                  onClick={(e) => {
                    e.stopPropagation();
                    act(p.id, p.featured ? "unfeature" : "feature");
                    showToast(p.featured ? "Removed from Featured" : "Marked as Featured");
                  }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    p.featured ? "bg-amber-100 text-amber-600" : "bg-shop-bg text-shop-text/40"
                  }`}
                >
                  <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="flex gap-2 border-t border-shop-border pt-2.5">
                {tab !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(p)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2 text-[11.5px] font-semibold text-white"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                {tab !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => handleReject(p)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-shop-border py-2 text-[11.5px] font-semibold text-shop-heading"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(p)}
                  aria-label="Remove product"
                  className="flex items-center justify-center rounded-[8px] border border-shop-border px-3 text-shop-accent-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-10 text-center text-[13px] text-shop-text">
              No {TABS.find((t) => t.id === tab)?.label.toLowerCase()} products.
            </p>
          )}
        </div>
      )}
      <ProductDetailModal
        product={detailProduct}
        tab={tab}
        onClose={() => setDetailProduct(null)}
        onApprove={(p) => {
          handleApprove(p);
          setDetailProduct(null);
        }}
        onReject={(p) => {
          handleReject(p);
          setDetailProduct(null);
        }}
        onRemove={(p) => {
          handleRemove(p);
          setDetailProduct(null);
        }}
      />
    </div>
  );
}
