"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Check, CheckCircle2, MapPin, User } from "lucide-react";
import {
  formatPrice,
  MERCHANT_ORDER_STATUS_LABEL,
  MERCHANT_ORDER_STATUS_TONE,
  MERCHANT_ORDER_STEPS,
  merchantOrderStepIndex,
} from "@/lib/merchant-data";
import { confirmOrderReady } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function MerchantOrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const showToast = useToast();
  const order = useSelector((s) => s.merchant.orders.find((o) => o.id === id));

  if (!order) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Order" backHref="/merchant/orders" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This order couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const currentStep = merchantOrderStepIndex(order.status);

  const handleConfirm = () => {
    dispatch(confirmOrderReady(order.id));
    showToast(`${order.id} marked ready for pickup`);
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title={order.id} backHref="/merchant/orders" showBackOnDesktop />

      <div className="mx-4 flex items-center justify-between lg:mx-8">
        <p className="text-[13px] text-shop-text">
          Placed{" "}
          {new Date(order.placedAt).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${MERCHANT_ORDER_STATUS_TONE[order.status]}`}
        >
          {MERCHANT_ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Tracking timeline */}
      <div className="mx-4 flex flex-col gap-4 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <p className="text-[13px] font-semibold text-shop-heading">Delivery Tracking</p>
        <div className="flex flex-col">
          {MERCHANT_ORDER_STEPS.map((step, i) => {
            const done = i <= currentStep;
            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-shop-accent-1 text-white" : "bg-shop-bg text-shop-text/40"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {i < MERCHANT_ORDER_STEPS.length - 1 && (
                    <span
                      className={`w-[2px] flex-1 ${done ? "bg-shop-accent-1" : "bg-shop-border"}`}
                      style={{ minHeight: "22px" }}
                    />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className={`text-[13px] font-medium ${
                      done ? "text-shop-heading" : "text-shop-text/50"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {order.status === "awaiting_confirmation" && (
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Ready for Pickup
          </button>
        )}
      </div>

      {/* Customer + address */}
      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
            <User className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-shop-text/60">Customer</p>
            <p className="text-[13px] font-medium text-shop-heading">{order.customerName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
            <MapPin className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-shop-text/60">Delivery Address</p>
            <p className="text-[13px] font-medium text-shop-heading">{order.address}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
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
              <p className="text-[11px] text-shop-text/70">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-shop-border pt-3 text-[14px] font-semibold text-shop-heading">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
