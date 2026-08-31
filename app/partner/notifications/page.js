"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Bell, Wallet2, Banknote, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

// This dummy build has no dedicated notifications feed yet — derives a plausible one
// from real partner state (recent earnings, withdrawals) so the page isn't just an
// empty shell. A real backend would push these as events as they happen.
export default function PartnerNotificationsPage() {
  const earnings = useSelector((s) => s.partner.earnings);
  const withdrawals = useSelector((s) => s.partner.withdrawals);
  const verification = useSelector((s) => s.partner.verification);

  const notifications = useMemo(() => {
    const items = [];
    earnings.slice(0, 4).forEach((e) => {
      items.push({
        id: `earn-${e.id}`,
        icon: Wallet2,
        tone: "bg-emerald-100 text-emerald-700",
        text: `You earned ${formatPrice(e.netProfit)} from a sale of "${e.product}"`,
      });
    });
    withdrawals.slice(0, 3).forEach((w) => {
      items.push({
        id: `wd-${w.id}`,
        icon: Banknote,
        tone: "bg-shop-accent-1-light text-shop-accent-1",
        text: `Withdrawal of ${formatPrice(w.amount)} is ${w.status}`,
      });
    });
    if (verification.status === "verified") {
      items.push({
        id: "verified",
        icon: ShieldCheck,
        tone: "bg-emerald-100 text-emerald-700",
        text: "Your identity verification was approved",
      });
    }
    return items;
  }, [earnings, withdrawals, verification]);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[720px]">
      <AppHeader title="Notifications" backHref="/partner" />

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
    </div>
  );
}
