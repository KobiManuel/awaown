"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { removeFromCart, updateQty } from "@/lib/store/cartSlice";
import { formatPrice } from "@/lib/shop-data";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const CartClient = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 && subtotal < 200 ? 15 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[1460px] flex-col items-center gap-4 px-4 py-24 text-center font-shop md:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-shop-accent-1-light">
          <ShoppingBag className="h-9 w-9 text-shop-accent-1" />
        </div>
        <h1 className="text-[24px] font-semibold text-shop-heading">Your cart is empty</h1>
        <p className="max-w-[360px] text-[14px] text-shop-text">
          Looks like you haven&apos;t added anything yet. Explore our latest
          products and find something you&apos;ll love.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-[8px] bg-shop-accent-1 px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1460px] px-4 py-8 font-shop md:px-8 md:py-12">
      <SectionHeader title={`Shopping Cart (${items.length})`} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-[10px] bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex flex-1 items-start gap-3 sm:items-center sm:gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg sm:h-20 sm:w-20">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-2" sizes="80px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {item.vendor && (
                    <span className="text-[11px] uppercase tracking-wide text-shop-text/60">
                      {item.vendor}
                    </span>
                  )}
                  <p className="line-clamp-2 text-[14px] font-medium text-shop-heading">{item.title}</p>
                  <p className="text-[13px] text-shop-text/70">{formatPrice(item.price)} each</p>
                </div>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="shrink-0 text-shop-text/50 hover:text-shop-accent-3 sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
                <div className="flex items-center gap-2 rounded-full border border-shop-border px-2 py-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                    className="flex h-6 w-6 items-center justify-center text-shop-heading hover:text-shop-accent-1"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-[13px] font-medium text-shop-heading">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                    className="flex h-6 w-6 items-center justify-center text-shop-heading hover:text-shop-accent-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="shrink-0 text-right text-[15px] font-semibold text-shop-heading sm:w-[90px]">
                  {formatPrice(item.price * item.qty)}
                </p>

                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="hidden shrink-0 text-shop-text/50 hover:text-shop-accent-3 sm:block"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            href="/"
            className="mt-2 w-fit text-[13px] font-semibold text-shop-accent-1 hover:underline"
          >
            &larr; Continue shopping
          </Link>
        </div>

        <div className="w-full shrink-0 rounded-[10px] bg-white p-6 lg:w-[340px]">
          <h2 className="mb-4 text-[16px] font-semibold text-shop-heading">Order Summary</h2>
          <div className="flex flex-col gap-3 text-[14px]">
            <div className="flex justify-between text-shop-text">
              <span>Subtotal</span>
              <span className="text-shop-heading">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-shop-text">
              <span>Shipping</span>
              <span className="text-shop-heading">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            <div className="h-px bg-shop-border" />
            <div className="flex justify-between text-[16px] font-semibold text-shop-heading">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
