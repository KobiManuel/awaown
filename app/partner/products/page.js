"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link2, Check } from "lucide-react";
import { earnableProducts, partnerProfile, formatPrice } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function PartnerProductsPage() {
  const showToast = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const handleGetLink = (product) => {
    const link = `${partnerProfile.referralLink}?product=${product.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedId(product.id);
    showToast("Product link copied");
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Products to Resell" />

      <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
        {earnableProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-shop-bg">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-1.5"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">
                  {product.title}
                </p>
                <p className="text-[11.5px] text-shop-text/70">
                  Public Price: {formatPrice(product.publicPrice)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-shop-bg p-3">
              <div>
                <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                  Member Discount
                </p>
                <p className="text-[13px] font-semibold text-shop-heading">
                  {formatPrice(product.memberDiscount)}
                </p>
              </div>
              <div>
                <p className="text-[10.5px] uppercase tracking-wide text-shop-text/60">
                  Your Profit
                </p>
                <p className="text-[13px] font-semibold text-emerald-600">
                  {formatPrice(product.memberProfit)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGetLink(product)}
              className={`flex items-center justify-center gap-2 rounded-[10px] py-2.5 text-[12.5px] font-semibold transition-colors ${
                copiedId === product.id
                  ? "bg-emerald-600 text-white"
                  : "bg-shop-accent-1 text-white hover:bg-shop-accent-1-dark"
              }`}
            >
              {copiedId === product.id ? (
                <>
                  <Check className="h-4 w-4" />
                  Link Copied
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Get Link
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
