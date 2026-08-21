"use client";

import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Package, Star } from "lucide-react";
import { formatPrice, PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import { toggleProductField } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

function categoryLabel(slug) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
}

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const products = useSelector((s) => s.merchant.products);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Products" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Inventory, approvals, categories, featured products and product status.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-[14px] border border-shop-border bg-white p-3.5">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1.5" sizes="56px" />
              ) : (
                <Package className="h-5 w-5 text-shop-text/40" strokeWidth={1.5} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">{p.title}</p>
              <p className="text-[11.5px] text-shop-text/70">
                {formatPrice(p.price)} · {categoryLabel(p.category)}
              </p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-shop-bg text-shop-text"
              }`}>
                {p.status === "active" ? "Approved" : "Draft"}
              </span>
            </div>
            <button
              type="button"
              aria-label="Toggle featured"
              onClick={() => {
                dispatch(toggleProductField({ id: p.id, field: "featured" }));
                showToast(p.featured ? "Removed from Featured" : "Marked as Featured");
              }}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                p.featured ? "bg-amber-100 text-amber-600" : "bg-shop-bg text-shop-text/40"
              }`}
            >
              <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
