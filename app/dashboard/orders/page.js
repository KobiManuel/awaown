"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ChevronRight, PackageSearch } from "lucide-react";
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/dashboard-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

export default function OrdersPage() {
  const orders = useSelector((s) => s.orders.items);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="My Orders" backHref="/dashboard/account" showBackOnDesktop />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shop-bg">
            <PackageSearch className="h-7 w-7 text-shop-text/40" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-shop-heading">No orders yet</p>
          <p className="text-[13px] text-shop-text">Your order history will show up here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 lg:px-8">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-shop-heading">{order.id}</p>
                  <p className="text-[11.5px] text-shop-text/70">
                    {new Date(order.placedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ORDER_STATUS_TONE[order.status]}`}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="relative h-11 w-11 overflow-hidden rounded-[8px] border-2 border-white bg-shop-bg"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                        sizes="44px"
                      />
                    </div>
                  ))}
                </div>
                {order.items.length > 3 && (
                  <span className="text-[11px] text-shop-text/70">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-shop-border pt-2.5">
                <span className="text-[13px] font-semibold text-shop-heading">
                  {formatPrice(order.total)}
                </span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-shop-accent-1">
                  View Details
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
