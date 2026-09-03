"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PackageSearch, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { statusMeta } from "@/lib/order-status";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetMerchantOrdersQuery,
  useConfirmOrderReadyMutation,
} from "@/lib/api/merchantApi";
import { errorMessage } from "@/lib/api/errorMessage";

export default function MerchantOrdersPage() {
  const showToast = useToast();
  const { data, isLoading, isError } = useGetMerchantOrdersQuery();
  const [confirmReady, { isLoading: confirming }] =
    useConfirmOrderReadyMutation();

  const orders = data?.items ?? [];

  const handleConfirm = async (e, ref) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await confirmReady(ref).unwrap();
      showToast(`${ref} marked ready for pickup`);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Orders" backHref="/merchant" />

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={4} />
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-[13px] text-red-600">
          Couldn&apos;t load orders.
        </p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">
            No orders yet
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {orders.map((order) => {
            const meta = statusMeta(order.status);
            const awaiting = order.status === "AWAITING_CONFIRMATION";
            return (
              <Link
                key={order.id}
                href={`/merchant/orders/${order.reference}`}
                className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-shop-heading">
                      {order.reference}
                    </p>
                    <p className="text-[11.5px] text-shop-text/70">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.tone}`}
                    >
                      {meta.label}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] bg-shop-bg">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <p className="line-clamp-1 flex-1 text-[12.5px] text-shop-text">
                        {item.title} × {item.qty}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-shop-border pt-3">
                  <span className="text-[13px] font-semibold text-shop-heading">
                    {formatPrice(order.total)}
                  </span>
                  {awaiting ? (
                    <button
                      type="button"
                      onClick={(e) => handleConfirm(e, order.reference)}
                      disabled={confirming}
                      className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-shop-accent-1-dark disabled:opacity-70"
                    >
                      {confirming ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Confirm Ready for Pickup
                    </button>
                  ) : (
                    <span className="text-[11.5px] text-shop-text/60">
                      {new Date(order.placedAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
