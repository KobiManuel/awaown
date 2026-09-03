"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Check,
  MapPin,
  User,
  ShieldCheck,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { formatPrice } from "@/lib/admin-data";
import { statusMeta, ORDER_STEPS } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminOrderQuery,
  useAdvanceAdminOrderMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

const NEXT_STATUS = {
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: "ESCROW_RELEASED",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const showToast = useToast();
  const confirm = useConfirm();
  const { data: order, isLoading, isError } = useGetAdminOrderQuery(id);
  const [advance, advanceState] = useAdvanceAdminOrderMutation();
  const [track, setTrack] = useState({ carrier: "", number: "", url: "" });

  const step = async (to, tracking) => {
    const res = await confirm({
      title: `Move ${id} to "${to.toLowerCase().replace(/_/g, " ")}"?`,
      message:
        to === "ESCROW_RELEASED"
          ? "This releases the escrowed funds to the seller. It can't be undone."
          : "The customer is notified of the status change.",
      confirmLabel: `Mark ${to.toLowerCase().replace(/_/g, " ")}`,
      tone: to === "ESCROW_RELEASED" ? "danger" : undefined,
    });
    if (!res) return;
    try {
      await advance({ reference: id, to, tracking }).unwrap();
      showToast(`${id} → ${to.toLowerCase().replace(/_/g, " ")}`);
    } catch (e) {
      showToast(errorMessage(e));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
        <AppHeader title="Order" backHref="/admin/orders" showBackOnDesktop />
        <div className="px-4 lg:px-8">
          <Skeleton className="h-24 rounded-[14px]" />
          <div className="mt-3">
            <SkeletonRows count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col gap-4 font-shop">
        <AppHeader title="Order" backHref="/admin/orders" showBackOnDesktop />
        <p className="px-4 py-10 text-center text-[13px] text-shop-text">
          This order couldn&apos;t be found.
        </p>
      </div>
    );
  }

  const meta = statusMeta(order.status);
  const next = NEXT_STATUS[order.status];
  const timelineAt = new Map((order.timeline || []).map((t) => [t.status, t.at]));
  const currentStep = ORDER_STEPS.reduce(
    (acc, s, i) => (timelineAt.has(s.key) ? i : acc),
    -1,
  );
  const escrowReleased = !!order.escrowReleasedAt;
  const hasRefund = !!order.refund;

  return (
    <div className="flex flex-col gap-5 pb-10 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title={order.reference} backHref="/admin/orders" showBackOnDesktop />

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
        <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${meta.tone}`}>
          {meta.label}
        </span>
      </div>

      {/* Escrow / refund status */}
      <div className="mx-4 flex items-center gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        {hasRefund ? (
          <>
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" strokeWidth={1.75} />
            <div>
              <p className="text-[13px] font-medium text-shop-heading">
                Refund {order.refund.status}
              </p>
              <p className="text-[11.5px] text-shop-text/70">
                {formatPrice(order.refund.amount)}
                {order.refund.reason ? ` — ${order.refund.reason}` : ""}
              </p>
            </div>
          </>
        ) : (
          <>
            <ShieldCheck
              className={`h-5 w-5 shrink-0 ${escrowReleased ? "text-emerald-600" : "text-amber-600"}`}
              strokeWidth={1.75}
            />
            <div>
              <p className="text-[13px] font-medium text-shop-heading">
                {escrowReleased ? "Escrow released to merchant" : "Funds held in escrow"}
              </p>
              <p className="text-[11.5px] text-shop-text/70">
                {escrowReleased
                  ? `Delivery was confirmed and the merchant has been paid${
                      order.escrowReleasedAt
                        ? ` on ${new Date(order.escrowReleasedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}`
                        : ""
                    }.`
                  : "Released automatically once delivery is confirmed."}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Shipment tracking (set/edit any time before delivery) */}
      {["PROCESSING", "SHIPPED"].includes(order.status) && (
        <div className="mx-4 flex flex-col gap-2 rounded-[14px] border border-shop-border p-4 lg:mx-8">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
            <Truck className="h-4 w-4" /> Shipment
          </p>
          {order.tracking && (
            <p className="text-[12px] text-shop-text">
              Current: {order.tracking.carrier || "—"}
              {order.tracking.number ? ` · ${order.tracking.number}` : ""}
            </p>
          )}
          <input
            value={track.carrier}
            onChange={(e) => setTrack((t) => ({ ...t, carrier: e.target.value }))}
            placeholder="Carrier"
            className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
          <input
            value={track.number}
            onChange={(e) => setTrack((t) => ({ ...t, number: e.target.value }))}
            placeholder="Tracking number"
            className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
          <input
            value={track.url}
            onChange={(e) => setTrack((t) => ({ ...t, url: e.target.value }))}
            placeholder="Tracking link (optional)"
            className="w-full rounded-[8px] border border-shop-border px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
        </div>
      )}

      {/* Advance status */}
      {next && (
        <div className="mx-4 lg:mx-8">
          <button
            type="button"
            disabled={advanceState.isLoading}
            onClick={() =>
              step(
                next,
                next === "SHIPPED" && (track.carrier || track.number) ? track : undefined,
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            <Truck className="h-4 w-4" />
            Mark as {next.toLowerCase().replace(/_/g, " ")}
          </button>
        </div>
      )}

      {/* Delivery tracking timeline */}
      <div className="mx-4 flex flex-col gap-4 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <p className="text-[13px] font-semibold text-shop-heading">Delivery Tracking</p>
        <div className="flex flex-col">
          {ORDER_STEPS.map((stepDef, i) => {
            const done = i <= currentStep;
            const at = timelineAt.get(stepDef.key);
            return (
              <div key={stepDef.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-shop-accent-1 text-white" : "bg-shop-bg text-shop-text/40"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {i < ORDER_STEPS.length - 1 && (
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
                    {stepDef.label}
                  </p>
                  {at && (
                    <p className="text-[11px] text-shop-text/60">
                      {new Date(at).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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

      {/* Customer + address */}
      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shop-bg">
            <User className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11.5px] text-shop-text/60">Customer</p>
            <p className="text-[13px] font-medium text-shop-heading">{order.customer.name}</p>
            <p className="text-[11.5px] text-shop-text/70">{order.customer.email}</p>
            {order.partner && (
              <p className="mt-0.5 text-[11.5px] text-shop-accent-1">
                Referred by partner {order.partner.name} ({order.partner.code})
              </p>
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
              {order.address.name}
              {order.address.phone ? ` · ${order.address.phone}` : ""}
            </p>
            <p className="text-[11.5px] text-shop-text/70">
              {[order.address.line1, order.address.city, order.address.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border p-4 lg:mx-8">
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
                <p className="text-[11px] text-shop-text/60">{item.variantLabel}</p>
              )}
              <p className="text-[11px] text-shop-text/70">Qty: {item.qty}</p>
            </div>
            <p className="text-[12.5px] font-semibold text-shop-heading">
              {formatPrice(item.price * item.qty)}
            </p>
          </div>
        ))}
        <div className="mt-1 flex flex-col gap-1.5 border-t border-shop-border pt-3 text-[12.5px]">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Shipping" value={formatPrice(order.shipping)} />
          {order.discount > 0 && (
            <Row
              label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
              value={`-${formatPrice(order.discount)}`}
            />
          )}
          <div className="mt-1 border-t border-shop-border pt-1.5">
            <Row label="Total" value={formatPrice(order.total)} bold />
          </div>
          <p className="pt-1 text-[11px] text-shop-text/60">
            {order.paymentMethod} · {order.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value, bold }) => (
  <div className="flex items-center justify-between">
    <span className={bold ? "font-semibold text-shop-heading" : "text-shop-text"}>{label}</span>
    <span className={bold ? "font-semibold text-shop-heading" : "text-shop-heading"}>{value}</span>
  </div>
);
