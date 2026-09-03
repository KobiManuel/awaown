"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Check, CheckCircle2, MapPin, User, Loader2, Truck } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { statusMeta, ORDER_STEPS } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import {
  useGetMerchantOrderQuery,
  useConfirmOrderReadyMutation,
  useSetMerchantOrderTrackingMutation,
} from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function MerchantOrderDetailPage() {
  const { id } = useParams();
  const showToast = useToast();
  const { data: order, isLoading, isError } = useGetMerchantOrderQuery(id);
  const [confirmReady, { isLoading: confirming }] =
    useConfirmOrderReadyMutation();
  const [setTracking, trackState] = useSetMerchantOrderTrackingMutation();
  const [ship, setShip] = useState({ carrier: "", number: "", url: "" });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
        <AppHeader title="Order" backHref="/merchant/orders" showBackOnDesktop />
        <div className="mx-4 flex flex-col gap-4 lg:mx-8">
          <Skeleton className="h-40 rounded-[14px]" />
          <Skeleton className="h-28 rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Order" backHref="/merchant/orders" showBackOnDesktop />
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
  const furthest = ORDER_STEPS.reduce(
    (acc, step, i) => (reached.has(step.key) ? i : acc),
    -1,
  );
  const awaiting = order.status === "AWAITING_CONFIRMATION";

  const handleConfirm = async () => {
    try {
      await confirmReady(order.reference).unwrap();
      showToast(`${order.reference} marked ready for pickup`);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const markShipped = async () => {
    if (!ship.carrier.trim()) {
      showToast("Enter the carrier");
      return;
    }
    try {
      await setTracking({
        reference: order.reference,
        carrier: ship.carrier,
        number: ship.number,
        url: ship.url,
        ship: true,
      }).unwrap();
      showToast("Order marked as shipped");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };


  return (
    <div className="flex flex-col gap-5 pb-6 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader
        title={order.reference}
        backHref="/merchant/orders"
        showBackOnDesktop
      />

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
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${meta.tone}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mx-4 flex flex-col gap-4 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <p className="text-[13px] font-semibold text-shop-heading">
          Delivery Tracking
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

        {awaiting && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirming}
            className="flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:opacity-70"
          >
            {confirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Confirm Ready for Pickup
          </button>
        )}
      </div>

      {/* Shipment / tracking */}
      {["PROCESSING", "SHIPPED", "DELIVERED", "ESCROW_RELEASED"].includes(
        order.status,
      ) && (
        <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <Truck className="h-4 w-4 text-shop-accent-1" /> Shipment
          </p>
          {order.status === "PROCESSING" ? (
            <>
              <p className="text-[12px] text-shop-text/70">
                Add the carrier and tracking number, then mark the order shipped —
                the customer is emailed the details.
              </p>
              <input
                value={ship.carrier}
                onChange={(e) => setShip((s) => ({ ...s, carrier: e.target.value }))}
                placeholder="Carrier (e.g. GIG Logistics, DHL)"
                className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
              />
              <input
                value={ship.number}
                onChange={(e) => setShip((s) => ({ ...s, number: e.target.value }))}
                placeholder="Tracking number (optional)"
                className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
              />
              <input
                value={ship.url}
                onChange={(e) => setShip((s) => ({ ...s, url: e.target.value }))}
                placeholder="Tracking link (optional)"
                className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
              />
              <button
                type="button"
                onClick={markShipped}
                disabled={trackState.isLoading}
                className="flex items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:opacity-70"
              >
                {trackState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Truck className="h-4 w-4" />
                )}
                Mark as Shipped
              </button>
            </>
          ) : order.tracking ? (
            <div className="text-[12.5px] text-shop-text">
              <p>
                <span className="text-shop-text/60">Carrier: </span>
                {order.tracking.carrier || "—"}
              </p>
              <p>
                <span className="text-shop-text/60">Tracking #: </span>
                {order.tracking.number || "—"}
              </p>
              {order.tracking.url && (
                <a
                  href={order.tracking.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-semibold text-shop-accent-1"
                >
                  Open tracking page
                </a>
              )}
            </div>
          ) : (
            <p className="text-[12.5px] text-shop-text/60">
              No tracking added. AwaOwn logistics is handling this delivery.
            </p>
          )}
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
            <User className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-shop-text/60">Customer</p>
            <p className="text-[13px] font-medium text-shop-heading">
              {order.customerName}
            </p>
            {order.phone && (
              <p className="text-[12px] text-shop-text">{order.phone}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
            <MapPin className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-shop-text/60">Delivery Address</p>
            <p className="text-[13px] font-medium text-shop-heading">
              {order.address}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <p className="text-[13px] font-semibold text-shop-heading">Items</p>
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
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
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-shop-border pt-3 text-[14px] font-semibold text-shop-heading">
          <span>Your earnings from this order</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
