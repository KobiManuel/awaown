"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tag, Plus } from "lucide-react";
import { toggleCouponStatus, addCoupon } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const STATUS_TONE = {
  active: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-shop-accent-1-light text-shop-accent-1",
  expired: "bg-shop-bg text-shop-text",
};

export default function AdminMarketingPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const coupons = useSelector((s) => s.admin.coupons);
  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!code || !discount) return;
    dispatch(
      addCoupon({
        id: `cp-${Date.now()}`,
        code: code.toUpperCase(),
        discount,
        uses: 0,
        status: "scheduled",
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    );
    showToast(`Coupon "${code.toUpperCase()}" created`);
    setCode("");
    setDiscount("");
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Marketing"
        right={
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-label="New coupon"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1-light text-shop-accent-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Coupons, campaigns, flash sales, email, SMS and push notifications.
      </p>

      {formOpen && (
        <form onSubmit={handleAdd} className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4 lg:mx-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code (e.g. SAVE15)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Discount (e.g. 15% off)"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-shop-accent-1"
          />
          <button type="submit" className="rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white">
            Create Coupon
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <Tag className="h-4 w-4 text-shop-accent-1" />
          Coupons
        </p>
        <div className="flex flex-col gap-2">
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-semibold text-shop-heading">{c.code}</p>
                <p className="text-[11.5px] text-shop-text/70">{c.discount} · {c.uses} uses</p>
              </div>
              <button
                type="button"
                disabled={c.status === "expired"}
                onClick={() => {
                  dispatch(toggleCouponStatus(c.id));
                  showToast(`"${c.code}" updated`);
                }}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize disabled:cursor-not-allowed ${STATUS_TONE[c.status]}`}
              >
                {c.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
