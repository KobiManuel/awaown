"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Package,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Users2,
  ChevronDown,
  Loader2,
  Ban,
} from "lucide-react";
import {
  formatPrice,
  PRODUCT_CATEGORIES,
  PROCESSING_TIME_OPTIONS,
} from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetMerchantProductsQuery,
  useUpdateMerchantProductMutation,
  useDeleteMerchantProductMutation,
} from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

const categoryLabel = (slug) =>
  PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
const processingLabel = (id) =>
  PROCESSING_TIME_OPTIONS.find((p) => p.id === id)?.label || id;

const APPROVAL_TONE = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-50 text-shop-accent-3",
};
const APPROVAL_LABEL = {
  PENDING: "Awaiting Admin Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/** Inline stock editor shown when a merchant taps a product card. */
function StockEditor({ product, onSave, saving }) {
  const isVariable = !!product.hasVariants && (product.variants?.length ?? 0) > 0;
  const [simpleStock, setSimpleStock] = useState(String(product.stock ?? 0));
  const [rows, setRows] = useState(
    (product.variants ?? []).map((v) => ({ ...v, stock: String(v.stock ?? 0) })),
  );

  const saveSimple = () =>
    onSave({ id: product.productId, stock: Math.max(0, Number(simpleStock) || 0) });

  const saveVariants = (allZero = false) =>
    onSave({
      id: product.productId,
      optionName: product.optionName || "Option",
      variants: rows.map((v) => ({
        label: v.label,
        price: v.price,
        image: v.image ?? null,
        stock: allZero ? 0 : Math.max(0, Number(v.stock) || 0),
      })),
    });

  return (
    <div className="flex flex-col gap-3 border-t border-shop-border pt-3">
      {isVariable ? (
        <>
          <div className="flex flex-col gap-2">
            {rows.map((v, i) => (
              <div key={v.id} className="flex items-center gap-2">
                <span className="flex-1 truncate text-[12px] text-shop-heading">{v.label}</span>
                <input
                  value={v.stock}
                  inputMode="numeric"
                  onChange={(e) =>
                    setRows((r) =>
                      r.map((row, idx) =>
                        idx === i
                          ? { ...row, stock: e.target.value.replace(/[^0-9]/g, "") }
                          : row,
                      ),
                    )
                  }
                  className="w-20 rounded-[6px] border border-shop-border px-2 py-1 text-[12.5px] outline-none focus:border-shop-accent-1"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => saveVariants(false)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-[8px] bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              Save stock
            </button>
            <button
              type="button"
              onClick={() => saveVariants(true)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-[8px] border border-shop-accent-3 px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-3 disabled:opacity-60"
            >
              <Ban className="h-3 w-3" />
              Mark all out of stock
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-shop-text">Stock</label>
          <input
            value={simpleStock}
            inputMode="numeric"
            onChange={(e) => setSimpleStock(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-24 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
          <button
            type="button"
            onClick={saveSimple}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-[8px] bg-shop-accent-1 px-3 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            Save
          </button>
          <button
            type="button"
            onClick={() => onSave({ id: product.productId, stock: 0 })}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-[8px] border border-shop-accent-3 px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-3 disabled:opacity-60"
          >
            <Ban className="h-3 w-3" />
            Out of stock
          </button>
        </div>
      )}
    </div>
  );
}

export default function MerchantProductsPage() {
  const showToast = useToast();
  const { data, isLoading, isError } = useGetMerchantProductsQuery();
  const [updateProduct, { isLoading: updating }] = useUpdateMerchantProductMutation();
  const [deleteProduct, deleteState] = useDeleteMerchantProductMutation();

  const products = data?.items ?? [];
  const [openStockId, setOpenStockId] = useState(null);

  const saveStock = async (body) => {
    try {
      await updateProduct(body).unwrap();
      showToast("Stock updated");
      setOpenStockId(null);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const toggleHideStock = async (p) => {
    try {
      await updateProduct({ id: p.productId, hideStock: !p.hideStock }).unwrap();
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.title}"?`)) return;
    try {
      await deleteProduct(p.productId).unwrap();
      showToast("Product removed");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Products"
        backHref="/merchant"
        right={
          <Link
            href="/merchant/products/new"
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Link>
        }
      />

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load your products.
        </p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <Package className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">
            No products yet
          </p>
          <Link
            href="/merchant/products/new"
            className="rounded-full bg-shop-accent-1 px-6 py-2.5 text-[13px] font-semibold text-white"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {products.map((product) => (
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
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {product.hasVariants
                      ? `From ${formatPrice(product.price)}`
                      : formatPrice(product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenStockId((cur) =>
                        cur === product.productId ? null : product.productId,
                      )
                    }
                    className="flex items-center gap-1 text-[11.5px] text-shop-accent-1"
                  >
                    {product.stock <= 0
                      ? "Out of stock"
                      : `${product.stock} in stock${product.hideStock ? " (hidden)" : ""}`}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        openStockId === product.productId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {product.category && (
                    <p className="text-[11px] text-shop-text/60">
                      {categoryLabel(product.category)}
                      {product.processingTime &&
                        ` · Ships in ${processingLabel(product.processingTime)}`}
                    </p>
                  )}
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${APPROVAL_TONE[product.approvalStatus]}`}
                  >
                    {APPROVAL_LABEL[product.approvalStatus]}
                  </span>
                  {product.approvalStatus === "REJECTED" &&
                    product.rejectionReason && (
                      <p className="mt-1 text-[10.5px] text-shop-accent-3">
                        Reason: {product.rejectionReason}
                      </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                      product.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-shop-bg text-shop-text"
                    }`}
                  >
                    {product.status === "ACTIVE"
                      ? "Active"
                      : product.status === "DRAFT"
                        ? "Draft"
                        : "Archived"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/merchant/products/${product.productId}/edit`}
                      aria-label="Edit product"
                      className="text-shop-text/40 hover:text-shop-accent-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Remove product"
                      disabled={deleteState.isLoading}
                      onClick={() => remove(product)}
                      className="text-shop-text/40 hover:text-shop-accent-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-shop-border pt-3">
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-shop-text">
                  <Users2 className="h-3.5 w-3.5" />
                  {product.offerCommission && product.partnerProfitAmount ? (
                    <span className="text-shop-accent-1">
                      Partner Program ·{" "}
                      {formatPrice(product.partnerProfitAmount)} profit
                    </span>
                  ) : (
                    "Not in Partner Program"
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => toggleHideStock(product)}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-shop-text hover:text-shop-accent-1"
                >
                  {product.hideStock ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  {product.hideStock ? "Stock hidden" : "Stock visible"}
                </button>
              </div>

              {openStockId === product.productId && (
                <StockEditor
                  product={product}
                  onSave={saveStock}
                  saving={updating}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
