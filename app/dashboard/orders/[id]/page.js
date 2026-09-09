"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Check,
  ShieldCheck,
  Loader2,
  Truck,
  KeyRound,
  X,
  ImagePlus,
} from "lucide-react";
import { formatPrice } from "@/lib/dashboard-data";
import { statusMeta, ORDER_STEPS } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";
import {
  useGetOrderQuery,
  useConfirmDeliveryMutation,
  useConfirmPaymentMutation,
  useDisputeOrderMutation,
  useSimulateFulfilmentMutation,
  useRetryPaymentMutation,
  useCancelOrderMutation,
} from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";
import { openPaystackPopup } from "@/lib/paystack";

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
  const [confirmPayment] = useConfirmPaymentMutation();
  const [disputeOrder, disputeState] = useDisputeOrderMutation();
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [simulate, simState] = useSimulateFulfilmentMutation();
  const [retryPayment] = useRetryPaymentMutation();
  const [cancelOrder, cancelState] = useCancelOrderMutation();
  const [payBusy, setPayBusy] = useState(false);

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
  const autoReleaseAt = order.autoReleaseAt
    ? new Date(order.autoReleaseAt)
    : null;

  const doConfirm = async () => {
    try {
      await confirmDelivery(order.reference).unwrap();
      showToast("Received - payment released to the seller");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const submitDispute = async ({ reason, description, images }) => {
    try {
      await disputeOrder({
        reference: order.reference,
        reason,
        description,
        images,
      }).unwrap();
      setDisputeOpen(false);
      showToast("Reported. Our team will review it and get back to you");
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const doRetryPayment = async () => {
    if (payBusy) return;
    setPayBusy(true);
    try {
      const res = await retryPayment(order.reference).unwrap();
      const pay = res?.payment;
      if (!pay) {
        showToast("Payment already confirmed");
        setPayBusy(false);
        return;
      }
      try {
        sessionStorage.setItem("awaown_pending_order", order.reference);
      } catch {
        /* ignore */
      }
      if (pay.provider === "paystack" && pay.accessCode) {
        await openPaystackPopup({
          accessCode: pay.accessCode,
          fallbackUrl: pay.authorizationUrl,
          onSuccess: async () => {
            try {
              await confirmPayment(order.reference).unwrap();
            } catch {
              /* order page will reflect the real state */
            }
          },
          onCancel: () => setPayBusy(false),
          onError: (err) => {
            showToast(err?.message || "Payment could not be completed");
            setPayBusy(false);
          },
        });
        return;
      }
      if (pay.authorizationUrl) {
        window.location.href = pay.authorizationUrl;
        return;
      }
      // mock gateway
      try {
        await confirmPayment(order.reference).unwrap();
      } catch {
        /* ignore */
      }
      setPayBusy(false);
    } catch (err) {
      showToast(errorMessage(err));
      setPayBusy(false);
    }
  };

  const doCancelOrder = async () => {
    if (!window.confirm("Cancel this order? Nothing has been charged.")) return;
    try {
      await cancelOrder(order.reference).unwrap();
      showToast("Order cancelled");
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

      {order.status === "PENDING_PAYMENT" && (
        <div className="mx-4 flex flex-col gap-3 rounded-[14px] border border-amber-300 bg-amber-50 p-4">
          <p className="text-[13px] font-semibold text-amber-900">
            Payment not completed
          </p>
          <p className="text-[12px] leading-[18px] text-amber-800">
            This order is on hold and nothing has been charged. Finish paying to
            send it to the merchant, or cancel it to release the items.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={doRetryPayment}
              disabled={payBusy}
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13px] font-semibold text-white disabled:opacity-70"
            >
              {payBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Complete payment · ${formatPrice(order.total)}`
              )}
            </button>
            <button
              type="button"
              onClick={doCancelOrder}
              disabled={cancelState.isLoading || payBusy}
              className="rounded-[10px] border border-amber-300 bg-white py-3 text-[13px] font-semibold text-amber-900 disabled:opacity-70 sm:px-5"
            >
              {cancelState.isLoading ? "Cancelling…" : "Cancel order"}
            </button>
          </div>
          <p className="text-[10.5px] text-amber-700">
            If you do nothing, this order is automatically cancelled about 45
            minutes after it was placed.
          </p>
        </div>
      )}

      {order.deliveryOtp &&
        ["PROCESSING", "SHIPPED"].includes(order.status) && (
          <div className="mx-4 flex items-center gap-3 rounded-[12px] border border-shop-accent-1/30 bg-shop-accent-1-light/50 p-3.5">
            <KeyRound className="h-5 w-5 shrink-0 text-shop-accent-1" />
            <div>
              <p className="text-[12px] text-shop-text">
                Give this delivery code to the dispatch rider
              </p>
              <p className="text-[18px] font-bold tracking-[3px] text-shop-heading">
                {order.deliveryOtp}
              </p>
            </div>
          </div>
        )}

      {(order.tracking || (order.shipments ?? []).length > 0) && (
        <div className="mx-4 flex flex-col gap-1.5 rounded-[12px] border border-shop-border p-3.5">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-shop-heading">
            <Truck className="h-4 w-4 text-shop-accent-1" /> Shipment tracking
          </p>
          {(order.shipments ?? []).length > 0 ? (
            (order.shipments ?? []).map((s) => (
              <div key={s.id} className="text-[12px] text-shop-text">
                <span className="font-medium text-shop-heading">
                  {s.carrier}
                </span>
                {s.waybill ? ` · ${s.waybill}` : ""} ·{" "}
                {String(s.status).replace(/_/g, " ")}
              </div>
            ))
          ) : (
            <p className="text-[12px] text-shop-text">
              {order.tracking.carrier || "Courier"}
              {order.tracking.number ? ` · ${order.tracking.number}` : ""}
            </p>
          )}
          {order.tracking?.url && (
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
            ? "Delivery confirmed. Payment has been released to the seller."
            : order.status === "REFUND_REQUESTED"
              ? "Your report is under review. Escrow release is paused."
              : order.status === "DELIVERED" && autoReleaseAt
                ? `Delivered. Payment releases to the seller on ${autoReleaseAt.toLocaleDateString(
                    "en-NG",
                    { day: "numeric", month: "short" },
                  )} unless you confirm sooner or report a problem.`
                : "Your payment stays in escrow until the item is delivered and you confirm receipt."}
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
                "Mark as received & release payment"
              )}
            </button>
          )}
          {canRefund && order.status !== "REFUND_REQUESTED" && (
            <button
              type="button"
              onClick={() => setDisputeOpen(true)}
              className="rounded-[10px] border border-shop-border py-3 text-[13.5px] font-semibold text-shop-heading"
            >
              Report a problem
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

      {disputeOpen && (
        <DisputeModal
          submitting={disputeState.isLoading}
          onClose={() => setDisputeOpen(false)}
          onSubmit={submitDispute}
        />
      )}
    </div>
  );
}

function DisputeModal({ onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const { pickAndCrop, uploading, modal } = useImageCropUpload("disputes");

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || images.length >= 4) return;
    const url = await pickAndCrop(file, { aspect: 1, title: "Crop the photo" });
    if (url) setImages((p) => [...p, url]);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 p-0 font-shop sm:items-center sm:p-4">
      {modal}
      <div className="flex max-h-[92vh] w-full max-w-[440px] flex-col gap-3 overflow-y-auto rounded-t-[18px] bg-white p-5 sm:rounded-[18px]">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-shop-heading">
            Report a problem
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-shop-text/50 hover:text-shop-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[12px] leading-[17px] text-shop-text">
          Tell us what went wrong. Our team reviews every report and your payment
          stays in escrow until it&apos;s resolved.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-shop-heading">
            What&apos;s the issue?
          </span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          >
            <option value="">Select a reason</option>
            <option value="Item not received">Item not received</option>
            <option value="Wrong item delivered">Wrong item delivered</option>
            <option value="Item damaged / defective">
              Item damaged or defective
            </option>
            <option value="Item not as described">Item not as described</option>
            <option value="Missing parts / incomplete">
              Missing parts or incomplete
            </option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-shop-heading">
            Describe what happened
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Give us the details so we can help quickly"
            className="resize-none rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-shop-heading">
            Photos <span className="font-normal text-shop-text/60">(up to 4)</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative h-16 w-16 overflow-hidden rounded-[8px] border border-shop-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((_, k) => k !== i))}
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-[8px] border-2 border-dashed border-shop-border text-shop-text/50">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={addImage}
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={
            submitting || uploading || !reason || description.trim().length < 4
          }
          onClick={() =>
            onSubmit({
              reason,
              description: description.trim(),
              images,
            })
          }
          className="mt-1 flex items-center justify-center gap-2 rounded-[10px] bg-shop-accent-1 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit report
        </button>
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
