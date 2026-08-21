"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Package, Eye, EyeOff, Trash2, Users2, Boxes } from "lucide-react";
import { formatPrice, PRODUCT_CATEGORIES, PROCESSING_TIME_OPTIONS } from "@/lib/merchant-data";

function categoryLabel(slug) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
}

function processingLabel(id) {
  return PROCESSING_TIME_OPTIONS.find((p) => p.id === id)?.label || id;
}
import { toggleProductField, removeProduct } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

function priceLabel(product) {
  if (product.productType === "group") return `From ${formatPrice(product.price)}`;
  if (!product.hasVariants || product.variants.length === 0) {
    return formatPrice(product.price);
  }
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

function stockLabel(product) {
  if (product.productType === "group") {
    return `${product.groupProductIds?.length || 0} products in this group`;
  }
  if (product.hideStock) return "Stock hidden";
  if (!product.hasVariants || product.variants.length === 0) return `${product.stock} in stock`;
  const total = product.variants.reduce((sum, v) => sum + v.stock, 0);
  return `${total} in stock · ${product.variants.length} options`;
}

export default function MerchantProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.merchant.products);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Products"
        right={
          <Link
            href="/merchant/products/new"
            aria-label="Add product"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1-light text-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Link>
        }
      />

      <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
        {products.map((product) => (
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
                <p className="text-[13px] font-semibold text-shop-heading">
                  {priceLabel(product)}
                </p>
                <p className="text-[11.5px] text-shop-text/70">{stockLabel(product)}</p>
                {product.category && (
                  <p className="text-[11px] text-shop-text/60">
                    {categoryLabel(product.category)}
                    {product.processingTime && ` · Ships in ${processingLabel(product.processingTime)}`}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {product.productType === "group" && (
                  <span className="flex items-center gap-1 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10.5px] font-semibold text-shop-accent-1">
                    <Boxes className="h-3 w-3" />
                    Group
                  </span>
                )}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    product.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-shop-bg text-shop-text"
                  }`}
                >
                  {product.status === "active" ? "Active" : "Draft"}
                </span>
                <button
                  type="button"
                  aria-label="Remove product"
                  onClick={() => dispatch(removeProduct(product.id))}
                  className="text-shop-text/40 hover:text-shop-accent-3"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {product.productType !== "group" && (
              <div className="flex items-center justify-between border-t border-shop-border pt-3">
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-shop-text">
                  <Users2 className="h-3.5 w-3.5" />
                  {product.offerCommission && product.partnerProfitAmount ? (
                    <span className="text-shop-accent-1">
                      Partner Program · {formatPrice(product.partnerProfitAmount)} profit
                    </span>
                  ) : (
                    "Not enrolled in Partner Program"
                  )}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(toggleProductField({ id: product.id, field: "hideStock" }))
                  }
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
