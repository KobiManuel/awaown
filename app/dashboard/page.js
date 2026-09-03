"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Search, Bell, ShieldCheck } from "lucide-react";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";
import ThemeToggle from "@/app/Components/Dashboard/ThemeToggle";
import { SkeletonProductGrid, Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api/catalogApi";
import { useGetNotificationsQuery } from "@/lib/api/notificationsApi";

function Row({ title, products, isLoading }) {
  return (
    <div className="flex flex-col gap-3 px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">
          {title}
        </p>
        <Link
          href="/dashboard/shop"
          className="text-[12px] font-semibold text-shop-accent-1"
        >
          View all
        </Link>
      </div>
      {isLoading ? (
        <SkeletonProductGrid count={4} className="lg:grid-cols-4 lg:gap-5" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <AppProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const user = useSelector((s) => s.auth.user);
  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "A").charAt(0);

  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data: newest, isLoading: newestLoading } = useGetProductsQuery({
    sort: "newest",
    limit: 4,
  });
  const { data: trending, isLoading: trendingLoading } = useGetProductsQuery({
    sort: "rating",
    limit: 4,
  });
  const { data: notifications } = useGetNotificationsQuery();
  const unread = notifications?.unread ?? 0;

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      <div className="flex items-center justify-between px-4 pt-5 lg:px-8 lg:pt-8">
        <div>
          <p className="text-[13px] text-shop-text lg:text-[14px]">
            Hi, {firstName} 👋
          </p>
          <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
            Find something you&apos;ll love
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle size="sm" className="lg:hidden" />
          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-shop-bg lg:h-9 lg:w-9"
          >
            <Bell className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-shop-accent-3 px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
          <Link
            href="/dashboard/account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1 text-[12px] font-semibold text-white lg:hidden"
          >
            {initial}
          </Link>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <Link
          href="/dashboard/shop"
          className="flex items-center gap-2 rounded-full bg-shop-bg px-4 py-3 text-shop-text/60 lg:max-w-[420px]"
        >
          <Search className="h-4 w-4" />
          <span className="text-[13px]">Search products, brands...</span>
        </Link>
      </div>

      <div className="mx-4 flex items-center gap-3 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white lg:mx-8 lg:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold leading-[18px]">
            Every order is Escrow Protected
          </p>
          <p className="text-[12px] leading-[16px] text-white/75">
            We hold your payment until delivery is confirmed.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="px-4 text-[14px] font-semibold text-shop-heading lg:px-8">
          Categories
        </p>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 lg:px-8">
          {catsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex shrink-0 flex-col items-center gap-1.5">
                  <Skeleton className="h-14 w-14 rounded-full lg:h-16 lg:w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))
            : (categories ?? []).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/dashboard/shop?category=${cat.slug}`}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-shop-bg text-[13px] font-semibold text-shop-accent-1 lg:h-16 lg:w-16">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-contain p-2.5"
                        sizes="64px"
                      />
                    ) : (
                      cat.label.charAt(0)
                    )}
                  </div>
                  <span className="max-w-[64px] truncate text-[11px] font-medium text-shop-text">
                    {cat.label}
                  </span>
                </Link>
              ))}
        </div>
      </div>

      <Row
        title="New Arrivals"
        products={newest?.items ?? []}
        isLoading={newestLoading}
      />
      <div className="pb-6">
        <Row
          title="Trending Now"
          products={trending?.items ?? []}
          isLoading={trendingLoading}
        />
      </div>
    </div>
  );
}
