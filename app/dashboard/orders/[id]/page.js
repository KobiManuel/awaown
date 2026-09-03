"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, Check, ShieldCheck, Loader2, Truck } from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import { statusMeta, ORDER_STEPS } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import {
  useGetOrderQuery,
  useConfirmDeliveryMutation,
  useRequestRefundMutation,
  useSimulateFulfilmentMutation,
} from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";

const DEV = process.env.NODE_ENV !== "production";

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
  const justPlaced = useSearchParams().get("placed") === "true";
  const showToast = useToast();

  const { data: order, isLoading, isError } = useGetOrderQuery(id);
  const [confirmDelivery, confirmState] = useConfirmDeliveryMutation();
  const [requestRefund, refundState] = useRequestRefundMutation();
  const [simulate, simState] = useSimulateFulfilmentMutation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
        <AppHeader title="Order" backHref="/dashboard/orders" showBackOnDesktop />
        <div className="mx-4 flex flex-col gap-4">
          <Skeleton className="h-40 w-full rounded-[14px]" />
          <Skeleton className="h-24 w-full rounded-[14px]" />
          <Skeleton className="h-32 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Order" backHref="/dashboard/orders" />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This order couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const meta = statusMeta(order.status);
  const reached = new Set((order.timeline ?? []).map((t) => t.status));
  const eventAt = {};
  (order.timeline ?? []).forEach((t) => {
    if (!eventAt[t.status]) eventAt[t.status] = t.at;
  });
  // any step at or before the furthest reached is "done"
  const furthest = ORDER_STEPS.reduce(
    (acc, step, i) => (reached.has(step.key) ? i : acc),
    -1,
  );

  const canConfirm = ["SHIPPED", "DELIVERED"].includes(order.status);
  const canRefund = [
    "ESCROW_HELD",
    "AWAITING_CONFIRMATION",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
  ].includes(order.status);

  const doConfirm = async () => {
    try {
      await confirmDelivery(order.reference).unwrap();
      showToast("Delivery confirmed — payment released");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const doRefund = async () => {
    const reason = window.prompt("Why are you requesting a refund?");
    if (!reason || reason.trim().length < 4) return;
    try {
      await requestRefund({ reference: order.reference, reason }).unwrap();
      showToast("Refund requested — our team will review it");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader
        title={order.reference}
        backHref="/dashboard/orders"
        showBackOnDesktop
      />

      {justPlaced && <PlacedBanner />}

      <div className="mx-4 flex items-center justify-between">
        <p className="text-[13px] text-shop-text">
          Placed{" "}
          {new Date(order.placedAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${meta.tone}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mx-4 flex flex-col gap-4 rounded-[14px] border border-shop-border p-4">
        <p className="text-[13px] font-semibold text-shop-heading">
          Order Tracking
        </p>
        <div className="flex flex-col">
          {ORDER_STEPS.map((step, i) => {
            const done = i <= furthest;
            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-shop-accent-1 text-white"
                        : "bg-shop-bg text-shop-text/40"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {i < ORDER_STEPS.length - 1 && (
                    <span
                      className={`w-[2px] flex-1 ${
                        done ? "bg-shop-accent-1" : "bg-shop-border"
                      }`}
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
                  {eventAt[step.key] && (
                    <p className="text-[11px] text-shop-text/60">
                      {new Date(eventAt[step.key]).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.tracking && (
        <div className="mx-4 flex flex-col gap-1.5 rounded-[12px] border border-shop-border p-3.5">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-shop-heading">
            <Truck className="h-4 w-4 text-shop-accent-1" /> Shipment tracking
          </p>
          <p className="text-[12px] text-shop-text">
            {order.tracking.carrier || "Courier"}
            {order.tracking.number ? ` · ${order.tracking.number}` : ""}
          </p>
          {order.tracking.url && (
            <a
              href={order.tracking.url}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold text-shop-accent-1"
            >
              Track your package →
            </a>
          )}
        </div>
      )}

      <div className="mx-4 flex items-start gap-3 rounded-[12px] bg-shop-bg p-3.5">
        <ShieldCheck
          className="h-5 w-5 shrink-0 text-shop-accent-1"
          strokeWidth={1.75}
        />
        <p className="text-[12px] leading-[18px] text-shop-text">
          {order.status === "ESCROW_RELEASED"
            ? "Delivery confirmed — payment has been released to the merchant."
            : order.status === "REFUND_REQUESTED"
              ? "A refund request is under review. Escrow release is paused."
              : "Your payment stays in escrow until you confirm delivery."}
        </p>
      </div>

      {(canConfirm || canRefund || DEV) && order.status !== "ESCROW_RELEASED" && (
        <div className="mx-4 flex flex-col gap-2">
          {canConfirm && (
            <button
              type="button"
              onClick={doConfirm}
              disabled={confirmState.isLoading}
              className="flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white disabled:opacity-70"
            >
              {confirmState.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm delivery & release payment"
              )}
            </button>
          )}
          {canRefund && order.status !== "REFUND_REQUESTED" && (
            <button
              type="button"
              onClick={doRefund}
              disabled={refundState.isLoading}
              className="rounded-[10px] border border-shop-border py-3 text-[13.5px] font-semibold text-shop-heading disabled:opacity-70"
            >
              Request a refund
            </button>
          )}
          {DEV && !canConfirm && order.status !== "REFUND_REQUESTED" && (
            <button
              type="button"
              onClick={() => simulate(order.reference)}
              disabled={simState.isLoading}
              className="rounded-[10px] border border-dashed border-shop-border py-2.5 text-[12px] font-medium text-shop-text/70 disabled:opacity-70"
            >
              {simState.isLoading
                ? "Simulating…"
                : "▸ Dev: simulate shipping & delivery"}
            </button>
          )}
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4">
        <p className="text-[13px] font-semibold text-shop-heading">Items</p>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-1.5"
                  sizes="56px"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="line-clamp-1 text-[12.5px] font-medium text-shop-heading">
                {item.title}
              </p>
              {item.variantLabel && (
                <p className="text-[11px] text-shop-text/70">
                  {item.variantLabel}
                </p>
              )}
              <p className="text-[11px] text-shop-text/70">Qty: {item.qty}</p>
            </div>
            <span className="text-[12.5px] font-semibold text-shop-heading">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

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
            {order.paymentMethod?.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-2 rounded-[14px] bg-shop-bg p-4">
        <div className="flex items-center justify-between text-[13px] text-shop-text">
          <span>Subtotal</span>
          <span className="font-medium text-shop-heading">
            {formatPrice(order.subtotal)}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex items-center justify-between text-[13px] text-shop-text">
            <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
            <span className="font-medium text-emerald-600">
              −{formatPrice(order.discount)}
            </span>
          </div>
        )}
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
