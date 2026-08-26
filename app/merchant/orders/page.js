"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { PackageSearch, CheckCircle2, ChevronRight } from "lucide-react";
import {
  formatPrice,
  MERCHANT_ORDER_STATUS_LABEL,
  MERCHANT_ORDER_STATUS_TONE,
} from "@/lib/merchant-data";
import { confirmOrderReady } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

export default function MerchantOrdersPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const orders = useSelector((s) => s.merchant.orders);

  const handleConfirm = (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(confirmOrderReady(order.id));
    showToast(`${order.id} marked ready for pickup`);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Orders" backHref="/merchant" />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/merchant/orders/${order.id}`}
              className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-shop-heading">{order.id}</p>
                  <p className="text-[11.5px] text-shop-text/70">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${MERCHANT_ORDER_STATUS_TONE[order.status]}`}
                  >
                    {MERCHANT_ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] bg-shop-bg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
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
                {order.status === "awaiting_confirmation" ? (
                  <button
                    type="button"
                    onClick={(e) => handleConfirm(e, order)}
                    className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-shop-accent-1-dark"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
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
          ))}
        </div>
      )}
    </div>
  );
}
