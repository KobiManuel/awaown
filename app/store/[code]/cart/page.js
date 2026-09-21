"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Minus, Plus, X, ShoppingBag, ArrowRight, PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { usePartnerCart } from "@/lib/usePartnerCart";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

export default function PartnerStoreCartPage() {
  const { code } = useParams();
  const cart = usePartnerCart(code);

  if (cart.items.length === 0) {
    return (
      <StoreThemeShell cartButton={false}>
        <div className="mx-auto flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center gap-4 px-4 py-24 text-center font-shop">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-shop-accent-1-light">
            <ShoppingBag className="h-9 w-9 text-shop-accent-1" />
          </div>
          <h1 className="text-[22px] font-semibold">Your cart is empty</h1>
          <p className="max-w-[340px] text-[13.5px] opacity-70">
            Add something from the store to see it here.
          </p>
          <Link
            href={`/store/${code}`}
            className="mt-2 rounded-[8px] bg-shop-accent-1 px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
          >
            Continue Shopping
          </Link>
          <Link
            href={`/store/${code}/orders`}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-accent-1 hover:underline"
          >
            <PackageSearch className="h-3.5 w-3.5" />
            Track an order
          </Link>
        </div>
      </StoreThemeShell>
    );
  }

  return (
    <StoreThemeShell cartButton={false}>
      <div className="mx-auto w-full max-w-[800px] px-4 py-8 font-shop md:py-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-[20px] font-semibold">
            Your Cart ({cart.items.length})
          </h1>
          <Link
            href={`/store/${code}/orders`}
            className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-shop-accent-1 hover:underline"
          >
            <PackageSearch className="h-3.5 w-3.5" />
            Track an order
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-[10px] bg-shop-surface p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex flex-1 items-start gap-3 sm:items-center sm:gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg sm:h-20 sm:w-20">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" sizes="80px" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="line-clamp-2 text-[14px] font-medium">{item.title}</p>
                  {item.variantLabel && (
                    <p className="text-[12px] opacity-70">{item.variantLabel}</p>
                  )}
                  <p className="text-[13px] opacity-70">{formatPrice(item.price)} each</p>
                </div>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => cart.remove(item.id)}
                  className="shrink-0 opacity-60 hover:opacity-100 sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
                <div className="flex items-center gap-2 rounded-full border border-shop-border px-2 py-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => cart.updateQty(item.id, item.qty - 1)}
                    className="flex h-6 w-6 items-center justify-center hover:text-shop-accent-1"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-[13px] font-medium">{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={item.maxQty != null && item.qty >= item.maxQty}
                    onClick={() => cart.updateQty(item.id, item.qty + 1)}
                    className="flex h-6 w-6 items-center justify-center hover:text-shop-accent-1 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="shrink-0 text-right text-[15px] font-semibold sm:w-[90px]">
                  {formatPrice(item.price * item.qty)}
                </p>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => cart.remove(item.id)}
                  className="hidden shrink-0 opacity-60 hover:opacity-100 sm:block"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            href={`/store/${code}`}
            className="mt-2 w-fit text-[13px] font-semibold text-shop-accent-1 hover:underline"
          >
            &larr; Continue shopping
          </Link>
        </div>

        <div className="mt-6 rounded-[10px] bg-shop-surface p-6">
          <div className="flex justify-between text-[16px] font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <p className="mt-1 text-[11.5px] opacity-60">Shipping is calculated at checkout.</p>
          <Link
            href={`/store/${code}/checkout`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </StoreThemeShell>
  );
}
