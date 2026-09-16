"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Star, BadgeCheck, X, Trash2, Store, User, Pencil, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import { PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminProductsQuery,
  useSetAdminProductApprovalMutation,
  useEditAdminProductMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

function EditProductForm({ product, onSaved, onCancel }) {
  const showToast = useToast();
  const [editProduct, editState] = useEditAdminProductMutation();
  const [title, setTitle] = useState(product.title ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [stock, setStock] = useState(String(product.stock ?? ""));
  const [category, setCategory] = useState(
    PRODUCT_CATEGORIES.find((c) => c.label === product.category)?.slug ??
      PRODUCT_CATEGORIES[0].slug,
  );

  const save = async () => {
    if (!title.trim()) {
      showToast("Title can't be empty");
      return;
    }
    try {
      await editProduct({
        id: product.id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        ...(product.variants?.length ? {} : { stock: Number(stock) || 0 }),
        category,
      }).unwrap();
      showToast(`"${title.trim()}" updated - the merchant has been notified`);
      onSaved();
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-shop-heading">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-shop-heading">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
        />
      </label>
      <div className="flex gap-2.5">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[12px] font-semibold text-shop-heading">Price</span>
          <MoneyInput
            value={price}
            onChange={setPrice}
            className="rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
        </label>
        {!product.variants?.length && (
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-shop-heading">Stock</span>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
            />
          </label>
        )}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-shop-heading">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-[8px] border border-shop-border px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      {product.variants?.length > 0 && (
        <p className="text-[11px] text-shop-text/50">
          This product has variant combinations (colour, size, etc.) - those
          are only editable by the merchant, not from here.
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-[8px] border border-shop-border py-2.5 text-[12.5px] font-semibold text-shop-heading"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={editState.isLoading}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-70"
        >
          {editState.isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save &amp; Notify Merchant
        </button>
      </div>
    </div>
  );
}

// Keyed by product.id from the parent, so switching products remounts this
// with fresh state instead of needing an effect to reset it.
function ProductDetailModal({ product, onClose, onApprove, onReject, onRemove, tab }) {
  const [activeImage, setActiveImage] = useState(0);
  const [editing, setEditing] = useState(false);
  if (!product) return null;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 lg:items-center" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-[560px] flex-col gap-4 overflow-y-auto rounded-t-[20px] bg-white p-5 lg:max-w-[840px] lg:rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading">
            {editing ? "Edit Product" : "Product Details"}
          </p>
          <div className="flex items-center gap-1.5">
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label="Edit product"
                className="flex h-8 w-8 items-center justify-center rounded-full text-shop-accent-1 hover:bg-shop-accent-1-light"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-shop-bg"
            >
              <X className="h-4 w-4 text-shop-heading" />
            </button>
          </div>
        </div>

        {editing ? (
          <EditProductForm
            product={product}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex flex-col gap-3 lg:w-[46%] lg:shrink-0">
        <div className="flex min-h-[180px] w-full items-center justify-center rounded-[12px] bg-shop-bg p-2">
          {images[activeImage] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={images[activeImage]}
              alt={`${product.title} - photo ${activeImage + 1}`}
              className="h-auto w-full rounded-[8px] object-contain"
            />
          ) : (
            <Package className="h-10 w-10 text-shop-text/40" strokeWidth={1.5} />
          )}
        </div>
        {images.length > 0 && (
          <div className="text-[11px] text-shop-text/60">
            Photo {activeImage + 1} of {images.length}
            {activeImage === 0 ? " · cover" : ""} - shown at its uploaded
            proportions.
          </div>
        )}
        {images.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] border-2 bg-shop-bg ${
                  i === activeImage ? "border-shop-accent-1" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
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
            <p className="font-semibold text-shop-heading">{product.category || "-"}</p>
          </div>
          <div className="rounded-[10px] bg-shop-bg p-3">
            <p className="text-shop-text/60">Price</p>
            {isOnSale(product) ? (
              <p className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-shop-heading">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[11px] text-shop-text/50 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                  -{saleDiscountPct(product)}% on sale
                </span>
              </p>
            ) : (
              <p className="font-semibold text-shop-heading">{formatPrice(product.price)}</p>
            )}
          </div>
          {product.variants?.length ? (
            <div className="col-span-2 rounded-[10px] bg-shop-bg p-3">
              <p className="mb-1.5 text-shop-text/60">
                {product.variantAxes?.length
                  ? `${product.variantAxes.map((a) => a.name).join(" × ")} - ${product.variants.length} combination${product.variants.length === 1 ? "" : "s"}`
                  : `Varieties (${product.variants.length})`}
              </p>
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
                      {formatPrice(v.price)} · {v.stock <= 0 ? "out of stock" : `${v.stock} in inventory`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] bg-shop-bg p-3">
              <p className="text-shop-text/60">Inventory quantity</p>
              <p className="font-semibold text-shop-heading">{product.stock}</p>
            </div>
          )}
          {product.offerCommission && (
            <div className="col-span-2 rounded-[10px] bg-shop-bg p-3">
              <p className="text-shop-text/60">Partner Program</p>
              <p className="font-semibold text-shop-heading">
                Enrolled · {formatPrice(product.partnerProfitAmount)} profit per sale
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
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "ON_SALE", label: "On Sale" },
];

const isOnSale = (p) => !!p.compareAtPrice && p.compareAtPrice > p.price;
const saleDiscountPct = (p) =>
  Math.round((1 - p.price / p.compareAtPrice) * 100);

export default function AdminProductsPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminProductsQuery();
  const [setApproval] = useSetAdminProductApprovalMutation();
  const [tab, setTab] = useState("PENDING");
  const [detailProduct, setDetailProduct] = useState(null);

  const products = data?.items ?? [];
  const filtered =
    tab === "ON_SALE"
      ? products.filter(isOnSale)
      : products.filter((p) => (p.approvalStatus || "APPROVED") === tab);
  const liveCount = products.filter(
    (p) => p.status === "ACTIVE" && (p.approvalStatus || "APPROVED") === "APPROVED",
  ).length;
  const tabCount = (id) =>
    id === "ON_SALE"
      ? products.filter(isOnSale).length
      : products.filter((p) => (p.approvalStatus || "APPROVED") === id).length;

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

      <div className="flex items-center justify-between px-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">
          {products.length} total
        </p>
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {liveCount} live on the marketplace
        </p>
      </div>

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
            {t.label} ({tabCount(t.id)})
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
                  <p className="flex items-center gap-1.5 text-[11.5px] text-shop-text/70">
                    {isOnSale(p) ? (
                      <>
                        <span className="font-semibold text-shop-heading">
                          {formatPrice(p.price)}
                        </span>
                        <span className="text-shop-text/50 line-through">
                          {formatPrice(p.compareAtPrice)}
                        </span>
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                          -{saleDiscountPct(p)}%
                        </span>
                      </>
                    ) : (
                      formatPrice(p.price)
                    )}
                    {" · "}
                    {p.category || "-"}
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
                {(p.approvalStatus || "APPROVED") !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(p)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2 text-[11.5px] font-semibold text-white"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                {(p.approvalStatus || "APPROVED") !== "REJECTED" && (
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
              {tab === "ON_SALE"
                ? "No products are on sale right now."
                : `No ${TABS.find((t) => t.id === tab)?.label.toLowerCase()} products.`}
            </p>
          )}
        </div>
      )}
      <ProductDetailModal
        key={detailProduct?.id}
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
