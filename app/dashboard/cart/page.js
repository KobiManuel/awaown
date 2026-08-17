"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import { removeFromCart, updateQty } from "@/lib/store/cartSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 1500;

export default function CartPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const items = useSelector((s) => s.cart.items);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handleRemove = (id, title) => {
    dispatch(removeFromCart(id));
    showToast(`${title} removed from cart`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="My Cart" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <ShoppingBag className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-shop-heading">Your cart is empty</p>
            <p className="mt-1 text-[13px] text-shop-text">
              Browse the shop and add items you love.
            </p>
          </div>
          <Link
            href="/dashboard/shop"
            className="rounded-full bg-shop-accent-1 px-6 py-2.5 text-[13px] font-semibold text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:px-8">
          <div className="flex flex-col gap-3 px-4 lg:col-span-2 lg:px-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-[14px] border border-shop-border bg-white p-3"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-shop-bg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">
                      {item.title}
                    </p>
                    {item.variantLabel && (
                      <p className="text-[11px] text-shop-text/70">{item.variantLabel}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-shop-border px-1 py-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-shop-bg"
                      >
                        <Minus className="h-3 w-3 text-shop-heading" />
                      </button>
                      <span className="w-4 text-center text-[12px] font-semibold text-shop-heading">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-shop-bg"
                      >
                        <Plus className="h-3 w-3 text-shop-heading" />
                      </button>
                    </div>
                    <span className="text-[13px] font-semibold text-shop-heading">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => handleRemove(item.id, item.title)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 px-4 lg:sticky lg:top-24 lg:col-span-1 lg:mt-0 lg:px-0">
            <div className="flex flex-col gap-2 rounded-[14px] bg-shop-bg p-4">
              <div className="flex items-center justify-between text-[13px] text-shop-text">
                <span>Subtotal</span>
                <span className="font-medium text-shop-heading">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-shop-text">
                <span>Shipping</span>
                <span className="font-medium text-shop-heading">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-shop-border pt-2 text-[14px] font-semibold text-shop-heading">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/dashboard/checkout"
              className="flex w-full items-center justify-center rounded-[10px] bg-shop-accent-1 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
