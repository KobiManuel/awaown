"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, PackageCheck, Download } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { statusMeta } from "@/lib/order-status";
import {
  useGetGuestOrderDetailQuery,
  useGuestConfirmDeliveryMutation,
  useGuestDisputeOrderMutation,
} from "@/lib/api/ordersApi";
import { errorMessage } from "@/lib/api/errorMessage";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";
import DisputeModal from "@/app/Components/Orders/DisputeModal";
import { trackMetaEvent } from "@/lib/metaPixel";
import { useDigitalDownload } from "@/lib/useDigitalDownload";

// Same list requestRefund() accepts server-side - kept in sync manually since
// there's no shared constant on this boundary.
const REFUNDABLE_STATUSES = [
  "ESCROW_HELD",
  "AWAITING_CONFIRMATION",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function PartnerStoreOrderDetailPage() {
  const { code, reference } = useParams();
  const router = useRouter();
  const search = useSearchParams();
  // Captured once, before the URL is scrubbed below - the phone number is
  // this guest's only credential for the order, so it shouldn't linger in
  // the address bar/browser history/referrer any longer than it takes to
  // read it once.
  const [phone] = useState(() => search.get("phone") || "");
  const [justPlaced] = useState(() => search.get("placed") === "true");

  useEffect(() => {
    // Strip the phone (and any other query params) from the visible URL as
    // early as possible. Left in place, it rides along in the Meta Pixel's
    // automatic PageView (which reports document.location.href regardless
    // of what we pass to trackMetaEvent) and in browser history if this
    // page is ever bookmarked, screen-shared, or the link forwarded.
    if (search.toString()) {
      router.replace(`/store/${code}/orders/${reference}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [confirmDelivery, confirmState] = useGuestConfirmDeliveryMutation();
  const [confirmMsg, setConfirmMsg] = useState("");
  const [disputeOrder, disputeState] = useGuestDisputeOrderMutation();
  const [disputeOpen, setDisputeOpen] = useState(false);

  const { data: order, isLoading, isError, refetch } = useGetGuestOrderDetailQuery(
    { reference, phone },
    { skip: !phone },
  );

  const purchaseTracked = useRef(false);
  useEffect(() => {
    if (!justPlaced || !order || purchaseTracked.current) return;
    purchaseTracked.current = true;
    trackMetaEvent(
      "Purchase",
      {
        content_ids: order.items.map((i) => i.productId ?? i.id),
        content_type: "product",
        num_items: order.items.length,
        value: order.total,
        currency: "NGN",
      },
      `purchase-${reference}`,
    );
  }, [justPlaced, order, reference]);

  const handleConfirmDelivery = async () => {
    setConfirmMsg("");
    try {
      await confirmDelivery({ reference, phone }).unwrap();
      setConfirmMsg("Thanks! Delivery confirmed and the seller has been paid.");
      refetch();
    } catch (err) {
      setConfirmMsg(errorMessage(err));
    }
  };

  const [disputeMsg, setDisputeMsg] = useState("");
  const submitDispute = async ({ reason, description }) => {
    setDisputeMsg("");
    try {
      await disputeOrder({ reference, phone, reason, description }).unwrap();
      setDisputeOpen(false);
      setDisputeMsg("Reported. Our team will review it and get back to you.");
      refetch();
    } catch (err) {
      setDisputeMsg(errorMessage(err));
    }
  };

  const { download: downloadDigital, progress: downloadProgress, downloadingId } =
    useDigitalDownload();
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = async (item) => {
    setDownloadError("");
    const res = await downloadDigital(
      `/orders/guest/${reference}/items/${item.id}/download?phone=${encodeURIComponent(phone)}`,
      { auth: false, itemId: item.id },
    );
    if (!res.ok) setDownloadError(res.message);
  };

  if (!phone) {
    return (
      <StoreThemeShell>
        <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-3 px-4 text-center font-shop">
          <p className="text-[14px] font-semibold">We need your phone number</p>
          <p className="text-[12.5px] opacity-70">
            Look up this order from the Orders page with the phone number you
            checked out with.
          </p>
          <Link href={`/store/${code}/orders`} className="text-[13px] font-semibold text-shop-accent-1 hover:underline">
            Look up an order
          </Link>
        </div>
      </StoreThemeShell>
    );
  }

  if (isLoading) {
    return (
      <StoreThemeShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-shop-accent-1" />
        </div>
      </StoreThemeShell>
    );
  }

  if (isError || !order) {
    return (
      <StoreThemeShell>
        <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-3 px-4 text-center font-shop">
          <p className="text-[14px] font-semibold">Order not found</p>
          <p className="max-w-[380px] text-[12.5px] leading-[18px] opacity-70">
            We don&apos;t have this order on file for that phone number. Check
            the confirmation email we sent you - it has the exact phone
            number on file for this order, in case there was a typo. Copy it
            from there and try again.
          </p>
        </div>
      </StoreThemeShell>
    );
  }

  const meta = statusMeta(order.status);

  return (
    <StoreThemeShell>
      <div className="mx-auto w-full max-w-[700px] px-4 py-8 font-shop md:py-12">
        {justPlaced && (
          <div className="mb-6 flex flex-col items-center gap-2 rounded-[14px] bg-shop-surface p-6 text-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            <p className="text-[16px] font-semibold">Order placed</p>
            <p className="max-w-[380px] text-[12.5px] opacity-70">
              Save this page or remember your phone number - it&apos;s how you&apos;ll find
              this order again, no account needed.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] font-semibold">{order.reference}</p>
            <p className="text-[12px] opacity-70">
              {new Date(order.placedAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.tone}`}>
            {meta.label}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 rounded-[12px] bg-shop-surface p-4">
          {order.items.map((i) => {
            const isDownloading = downloadingId === i.id;
            return (
              <div key={i.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
                    {i.image && <Image src={i.image} alt={i.title} fill className="object-contain p-1.5" sizes="56px" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[13px] font-medium">{i.title}</p>
                    {i.variantLabel && <p className="text-[11.5px] opacity-70">{i.variantLabel}</p>}
                    <p className="text-[11.5px] opacity-70">Qty {i.qty}</p>
                  </div>
                  <p className="shrink-0 text-[13px] font-semibold">{formatPrice(i.price * i.qty)}</p>
                </div>
                {i.canDownload && (
                  <div className="flex flex-col gap-1.5 pl-[68px]">
                    <button
                      type="button"
                      onClick={() => handleDownload(i)}
                      disabled={isDownloading}
                      className="flex w-fit items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1 disabled:opacity-70"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      {isDownloading
                        ? `Downloading… ${downloadProgress ?? 0}%`
                        : "Download file"}
                    </button>
                    {isDownloading && downloadProgress != null && (
                      <div className="h-1 w-40 overflow-hidden rounded-full bg-shop-bg">
                        <div
                          className="h-full rounded-full bg-shop-accent-1 transition-[width]"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {downloadError && (
            <p className="text-[11.5px] font-medium text-red-500">{downloadError}</p>
          )}
          <div className="mt-1 flex flex-col gap-1 border-t border-shop-border pt-2 text-[13px]">
            <div className="flex justify-between opacity-80">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-[14px] font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.address ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-shop-surface p-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
            <div className="text-[12.5px] leading-[19px] opacity-80">
              <p className="font-medium">{order.address.name}</p>
              <p>{order.address.line1}, {order.address.city}, {order.address.state}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[12px] bg-shop-surface p-4 text-[12.5px] opacity-70">
            Digital order - nothing to ship.
          </div>
        )}

        {order.tracking && (
          <div className="mt-4 rounded-[12px] bg-shop-surface p-4 text-[12.5px]">
            <p className="font-medium">Tracking</p>
            <p className="opacity-70">
              {order.tracking.carrier} {order.tracking.number ? `· ${order.tracking.number}` : ""}
            </p>
          </div>
        )}

        {["SHIPPED", "DELIVERED"].includes(order.status) && (
          <div className="mt-4 flex flex-col items-center gap-2.5 rounded-[12px] bg-shop-surface p-5 text-center">
            <p className="text-[13px] font-medium">Received your order?</p>
            <p className="max-w-[380px] text-[11.5px] opacity-70">
              Confirming releases your payment to the seller. Only confirm once the
              item has actually arrived.
            </p>
            <button
              type="button"
              onClick={handleConfirmDelivery}
              disabled={confirmState.isLoading}
              className="mt-1 flex items-center gap-2 rounded-[10px] bg-shop-accent-1 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark disabled:opacity-70"
            >
              {confirmState.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PackageCheck className="h-4 w-4" />
              )}
              Confirm Delivery
            </button>
            {confirmMsg && <p className="text-[11.5px] opacity-80">{confirmMsg}</p>}
          </div>
        )}

        {REFUNDABLE_STATUSES.includes(order.status) && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-[12px] bg-shop-surface p-4 text-center">
            <button
              type="button"
              onClick={() => setDisputeOpen(true)}
              className="text-[12.5px] font-semibold text-shop-accent-1 hover:underline"
            >
              Report a problem with this order
            </button>
            {disputeMsg && <p className="text-[11.5px] opacity-80">{disputeMsg}</p>}
          </div>
        )}

        <p className="mt-6 text-center text-[11.5px] opacity-60">
          Your payment is held securely and released to the seller once delivery is
          confirmed.
        </p>

        {disputeOpen && (
          <DisputeModal
            allowPhotos={false}
            submitting={disputeState.isLoading}
            onClose={() => setDisputeOpen(false)}
            onSubmit={submitDispute}
          />
        )}
      </div>
    </StoreThemeShell>
  );
}
