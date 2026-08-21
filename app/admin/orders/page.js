"use client";

import React from "react";
import { useSelector } from "react-redux";
import { PackageSearch } from "lucide-react";
import {
  formatPrice,
  MERCHANT_ORDER_STATUS_LABEL,
  MERCHANT_ORDER_STATUS_TONE,
} from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function AdminOrdersPage() {
  const orders = useSelector((s) => s.merchant.orders);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Orders" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Complete order lifecycle: payment status, escrow, delivery and refunds.
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-shop-heading">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-shop-heading">{order.id}</p>
                <p className="line-clamp-1 text-[11.5px] text-shop-text/70">
                  {order.customerName} · {order.address}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${MERCHANT_ORDER_STATUS_TONE[order.status]}`}
              >
                {MERCHANT_ORDER_STATUS_LABEL[order.status]}
              </span>
              <span className="shrink-0 text-[13px] font-semibold text-shop-heading">
                {formatPrice(order.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
