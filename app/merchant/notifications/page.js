"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Bell, PackageCheck, BadgeCheck, XCircle, Banknote } from "lucide-react";
import { MERCHANT_ORDER_STATUS_LABEL } from "@/lib/merchant-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

// This dummy build has no dedicated notifications feed yet — derives a plausible one
// from real merchant state (recent orders, product approvals) so the page isn't just
// an empty shell. A real backend would push these as events as they happen.
export default function MerchantNotificationsPage() {
  const orders = useSelector((s) => s.merchant.orders);
  const products = useSelector((s) => s.merchant.products);

  const notifications = useMemo(() => {
    const items = [];
    orders.slice(0, 4).forEach((o) => {
      items.push({
        id: `order-${o.id}`,
        icon: PackageCheck,
        tone: "bg-shop-accent-1-light text-shop-accent-1",
        text: `Order ${o.id} is ${MERCHANT_ORDER_STATUS_LABEL[o.status] || o.status}`,
      });
    });
    products
      .filter((p) => p.approvalStatus === "approved" || p.approvalStatus === "rejected")
      .slice(0, 3)
      .forEach((p) => {
        const approved = p.approvalStatus === "approved";
        items.push({
          id: `product-${p.id}`,
          icon: approved ? BadgeCheck : XCircle,
          tone: approved ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-shop-accent-3",
          text: approved
            ? `"${p.title}" was approved and is now live`
            : `"${p.title}" was rejected${p.rejectionReason ? ` — ${p.rejectionReason}` : ""}`,
        });
      });
    return items;
  }, [orders, products]);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Notifications" backHref="/merchant" />

      <div className="flex flex-col gap-2 px-4 lg:px-0">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 rounded-[14px] border border-shop-border bg-white p-3.5">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${n.tone}`}>
              <n.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="text-[13px] leading-[19px] text-shop-heading">{n.text}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Bell className="h-8 w-8 text-shop-text/30" strokeWidth={1.5} />
            <p className="text-[13px] text-shop-text">You&apos;re all caught up — no notifications yet.</p>
          </div>
        )}
      </div>

      <div className="mx-4 flex items-center gap-3 rounded-[14px] bg-shop-bg p-3.5 lg:mx-0">
        <Banknote className="h-4.5 w-4.5 shrink-0 text-shop-accent-1" strokeWidth={1.75} />
        <p className="text-[12px] leading-[18px] text-shop-text">
          You&apos;ll also get notified here about payouts, verification updates and new
          Partner Program activity on your products.
        </p>
      </div>
    </div>
  );
}
