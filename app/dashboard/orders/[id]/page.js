"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { CheckCircle2, Check, ShieldCheck } from "lucide-react";
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/dashboard-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

function PlacedBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`mx-4 flex flex-col items-center gap-3 rounded-[16px] bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-center text-white transition-all duration-500 ${
        show ? "scale-100 opacity-100" : "scale-90 opacity-0"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
        <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-[16px] font-semibold">Order Placed Successfully!</p>
        <p className="mt-1 text-[12.5px] text-white/85">
          We&apos;ve notified the merchant. Your payment is safely held in escrow.
        </p>
      </div>
    </div>
  );
}

function OrderDetailContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "true";
  const order = useSelector((s) => s.orders.items.find((o) => o.id === id));

  if (!order) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Order" backHref="/dashboard/orders" />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This order couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title={order.id} backHref="/dashboard/orders" showBackOnDesktop />

      {justPlaced && <PlacedBanner />}

      <div className="mx-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-shop-text">
            Placed{" "}
            {new Date(order.placedAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${ORDER_STATUS_TONE[order.status]}`}
        >
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Timeline */}
      <div className="mx-4 flex flex-col gap-4 rounded-[14px] border border-shop-border p-4">
        <p className="text-[13px] font-semibold text-shop-heading">Order Tracking</p>
        <div className="flex flex-col">
          {order.timeline.map((step, i) => (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    step.done
                      ? "bg-shop-accent-1 text-white"
                      : "bg-shop-bg text-shop-text/40"
                  }`}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                {i < order.timeline.length - 1 && (
                  <span
                    className={`w-[2px] flex-1 ${step.done ? "bg-shop-accent-1" : "bg-shop-border"}`}
                    style={{ minHeight: "22px" }}
                  />
                )}
              </div>
              <div className="pb-5">
                <p
                  className={`text-[13px] font-medium ${
                    step.done ? "text-shop-heading" : "text-shop-text/50"
                  }`}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[11px] text-shop-text/60">
                    {new Date(step.date).toLocaleString("en-NG", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow note */}
      <div className="mx-4 flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
        <ShieldCheck className="h-5 w-5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          {order.status === "delivered"
            ? "Delivery confirmed — payment has been released to the merchant."
            : "Your payment stays in escrow until you confirm delivery."}
        </p>
      </div>

      {/* Items */}
      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4">
        <p className="text-[13px] font-semibold text-shop-heading">Items</p>
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
              <Image src={item.image} alt={item.title} fill className="object-contain p-1.5" sizes="56px" />
            </div>
            <div className="flex-1">
              <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
                {item.title}
              </p>
              {item.variantLabel && (
                <p className="text-[11px] text-shop-text/70">{item.variantLabel}</p>
              )}
              <p className="text-[11px] text-shop-text/70">Qty: {item.qty}</p>
            </div>
            <span className="text-[12.5px] font-semibold text-shop-heading">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Address + payment */}
      <div className="mx-4 flex flex-col gap-2 rounded-[14px] border border-shop-border p-4 text-[12.5px]">
        <div className="flex justify-between text-shop-text">
          <span>Delivery Address</span>
          <span className="max-w-[60%] text-right font-medium text-shop-heading">
            {order.address?.line1}, {order.address?.city}
          </span>
        </div>
        <div className="flex justify-between text-shop-text">
          <span>Payment Method</span>
          <span className="font-medium capitalize text-shop-heading">
            {order.paymentMethod}
          </span>
        </div>
      </div>

      {/* Totals */}
      <div className="mx-4 flex flex-col gap-2 rounded-[14px] bg-shop-bg p-4">
        <div className="flex items-center justify-between text-[13px] text-shop-text">
          <span>Subtotal</span>
          <span className="font-medium text-shop-heading">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] text-shop-text">
          <span>Shipping</span>
          <span className="font-medium text-shop-heading">
            {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-shop-border pt-2 text-[14px] font-semibold text-shop-heading">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailContent />
    </Suspense>
  );
}
