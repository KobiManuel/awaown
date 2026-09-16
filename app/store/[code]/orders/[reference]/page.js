"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/shop-data";
import { statusMeta } from "@/lib/order-status";
import { useGetGuestOrderDetailQuery } from "@/lib/api/ordersApi";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

export default function PartnerStoreOrderDetailPage() {
  const { code, reference } = useParams();
  const search = useSearchParams();
  const phone = search.get("phone") || "";
  const justPlaced = search.get("placed") === "true";

  const { data: order, isLoading, isError } = useGetGuestOrderDetailQuery(
    { reference, phone },
    { skip: !phone },
  );

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
          <p className="text-[12.5px] opacity-70">
            Double check the phone number matches the one used at checkout.
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
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
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
          ))}
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

        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-shop-surface p-4">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
          <div className="text-[12.5px] leading-[19px] opacity-80">
            <p className="font-medium">{order.address.name}</p>
            <p>{order.address.line1}, {order.address.city}, {order.address.state}</p>
            <p>{order.address.phone}</p>
          </div>
        </div>

        {order.tracking && (
          <div className="mt-4 rounded-[12px] bg-shop-surface p-4 text-[12.5px]">
            <p className="font-medium">Tracking</p>
            <p className="opacity-70">
              {order.tracking.carrier} {order.tracking.number ? `· ${order.tracking.number}` : ""}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-[11.5px] opacity-60">
          Your payment is held securely and released to the seller once delivery is
          confirmed.
        </p>
      </div>
    </StoreThemeShell>
  );
}
