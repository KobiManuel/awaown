"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  TrendingUp,
  ShoppingBag,
  Package,
  Star,
  ChevronRight,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { statusMeta } from "@/lib/order-status";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetMerchantOverviewQuery,
  useGetMerchantOrdersQuery,
  useUpdateMerchantStoreMutation,
} from "@/lib/api/merchantApi";
import BannerImageButton from "@/app/Components/Dashboard/BannerImageButton";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
      <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
    </div>
    <p className="text-[18px] font-bold text-shop-heading">{value}</p>
    <p className="text-[12px] text-shop-text">{label}</p>
  </div>
);

export default function MerchantHome() {
  const { data, isLoading } = useGetMerchantOverviewQuery();
  const { data: orders, isLoading: ordersLoading } = useGetMerchantOrdersQuery();
  const [updateStore] = useUpdateMerchantStoreMutation();

  const verified = data?.verification?.status === "VERIFIED";
  const pendingVerif = data?.verification?.status === "PENDING";
  const stats = data?.stats;
  const recent = orders?.items?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      <div className="relative mx-4 mt-4 flex h-32 items-end overflow-hidden rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 lg:mx-8 lg:mt-8 lg:h-40">
        {data?.profile?.bannerUrl && (
          <Image
            src={data.profile.bannerUrl}
            alt="Store banner"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex w-full items-end justify-between p-4">
          <p className="text-[16px] font-bold text-white lg:text-[20px]">
            {data?.profile?.storeName ?? "…"}
          </p>
          <div className="flex gap-2">
            <BannerImageButton
              hasBanner={!!data?.profile?.bannerUrl}
              onUploaded={(url) => updateStore({ bannerUrl: url }).unwrap()}
            />
            {data?.profile?.storeSlug && (
              <Link
                href={`/shop/${data.profile.storeSlug}`}
                target="_blank"
                className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
              >
                Preview Store
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-1.5">
          <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
            {data?.profile?.ownerName
              ? `Welcome back, ${data.profile.ownerName}`
              : "Your store"}
          </p>
          {verified && (
            <BadgeCheck
              className="h-4.5 w-4.5 text-shop-accent-1"
              strokeWidth={1.75}
            />
          )}
        </div>
        <Link
          href="/merchant/products/new"
          className="flex items-center gap-1.5 rounded-full bg-shop-accent-1 px-4 py-2.5 text-[12.5px] font-semibold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </div>

      {!verified && (
        <Link
          href="/merchant/account"
          className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 lg:mx-8"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-amber-700"
            strokeWidth={1.75}
          />
          <span className="text-[12.5px] leading-[18px] text-amber-800">
            {pendingVerif
              ? "Your identity verification is under review — we'll notify you once it's approved."
              : "You'll need to verify your identity before your first payout."}
          </span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:gap-5 lg:px-8">
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[14px]" />
          ))
        ) : (
          <>
            <StatCard
              icon={TrendingUp}
              label="Revenue Today"
              value={formatPrice(stats.revenueToday)}
            />
            <StatCard
              icon={ShoppingBag}
              label="Orders Today"
              value={stats.ordersToday}
            />
            <StatCard
              icon={Package}
              label="Total Products"
              value={stats.totalProducts}
            />
            <StatCard
              icon={Star}
              label="Store Rating"
              value={stats.rating || "—"}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">
            Recent Orders
          </p>
          <Link
            href="/merchant/orders"
            className="text-[12px] font-semibold text-shop-accent-1"
          >
            View all
          </Link>
        </div>
        {ordersLoading ? (
          <SkeletonRows count={3} />
        ) : recent.length === 0 ? (
          <p className="py-6 text-center text-[12.5px] text-shop-text/70">
            No orders yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((order) => {
              const meta = statusMeta(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/merchant/orders/${order.reference}`}
                  className="flex items-center gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-shop-bg">
                    {order.items[0]?.image && (
                      <Image
                        src={order.items[0].image}
                        alt={order.items[0].title}
                        fill
                        className="object-contain p-1.5"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-shop-heading">
                      {order.customerName}
                    </p>
                    <p className="text-[11.5px] text-shop-text/70">
                      {order.reference}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.tone}`}
                  >
                    {meta.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-shop-text/40" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
