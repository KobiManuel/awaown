"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Package, Star, BadgeCheck, X, Trash2 } from "lucide-react";
import { formatPrice, PRODUCT_CATEGORIES } from "@/lib/merchant-data";
import { toggleProductField, adminSetProductApproval, removeProduct } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useUndoBuffer } from "@/app/Components/Dashboard/UndoBar";

function categoryLabel(slug) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
}

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const products = useSelector((s) => s.merchant.products);
  const { run, bar } = useUndoBuffer();
  const [tab, setTab] = useState("pending");

  const filtered = products.filter((p) => (p.approvalStatus || "approved") === tab);

  const handleApprove = (product) => {
    const previous = { approvalStatus: product.approvalStatus, rejectionReason: product.rejectionReason };
    dispatch(adminSetProductApproval({ id: product.id, approvalStatus: "approved" }));
    showToast(`${product.title} approved`);
    run(
      "Email to merchant sending in a few seconds...",
      () => {
        dispatch(adminSetProductApproval({ id: product.id, approvalStatus: previous.approvalStatus, reason: previous.rejectionReason }));
        showToast("Undone");
      },
      () => showToast(`Email sent: "${product.title}" approved`),
    );
  };

  const handleReject = (product) => {
    const reason = window.prompt(`Reason for rejecting "${product.title}"?`);
    if (reason === null) return;
    const previous = { approvalStatus: product.approvalStatus, rejectionReason: product.rejectionReason };
    dispatch(adminSetProductApproval({ id: product.id, approvalStatus: "rejected", reason }));
    showToast(`${product.title} rejected`);
    run(
      "Email to merchant sending in a few seconds...",
      () => {
        dispatch(adminSetProductApproval({ id: product.id, approvalStatus: previous.approvalStatus, reason: previous.rejectionReason }));
        showToast("Undone");
      },
      () => showToast(`Email sent: "${product.title}" rejected — ${reason}`),
    );
  };

  const handleRemove = (product) => {
    const reason = window.prompt(`Reason for permanently removing "${product.title}"?`);
    if (reason === null) return;
    dispatch(removeProduct(product.id));
    showToast(`${product.title} removed`);
    run(
      "Email to merchant sending in a few seconds...",
      () => showToast("This item was removed — restoring it isn't possible from here."),
      () => showToast(`Email sent: "${product.title}" removed — ${reason}`),
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Products" />
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
            {t.label} ({products.filter((p) => (p.approvalStatus || "approved") === t.id).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 px-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8">
        {filtered.map((p) => (
          <div key={p.id} className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5">
            <div className="flex items-center gap-3">
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
                {p.rejectionReason && (
                  <p className="mt-0.5 text-[10.5px] text-shop-accent-3">Reason: {p.rejectionReason}</p>
                )}
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
            <div className="flex gap-2 border-t border-shop-border pt-2.5">
              {tab !== "approved" && (
                <button
                  type="button"
                  onClick={() => handleApprove(p)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-shop-accent-1 py-2 text-[11.5px] font-semibold text-white"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {tab !== "rejected" && (
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
            No {tab} products.
          </p>
        )}
      </div>
      {bar}
    </div>
  );
}
