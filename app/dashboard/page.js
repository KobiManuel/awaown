"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Search, Bell, ShieldCheck } from "lucide-react";
import { products, dashboardCategories } from "@/lib/dashboard-data";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";
import ThemeToggle from "@/app/Components/Dashboard/ThemeToggle";

export default function DashboardHome() {
  const user = useSelector((s) => s.auth.user);
  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "A").charAt(0);

  const newArrivals = products.slice(0, 4);
  const trending = [...products].reverse().slice(0, 4);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      {/* Greeting bar */}
      <div className="flex items-center justify-between px-4 pt-5 lg:px-8 lg:pt-8">
        <div>
          <p className="text-[13px] text-shop-text lg:text-[14px]">Hi, {firstName} 👋</p>
          <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
            Find something you&apos;ll love
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle size="sm" className="lg:hidden" />
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-bg lg:h-9 lg:w-9"
          >
            <Bell className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </button>
          <Link
            href="/dashboard/account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1 text-[12px] font-semibold text-white lg:hidden"
          >
            {initial}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 lg:px-8">
        <Link
          href="/dashboard/shop"
          className="flex items-center gap-2 rounded-full bg-shop-bg px-4 py-3 text-shop-text/60 lg:max-w-[420px]"
        >
          <Search className="h-4 w-4" />
          <span className="text-[13px]">Search products, brands...</span>
        </Link>
      </div>

      {/* Escrow promo banner */}
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

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <p className="px-4 text-[14px] font-semibold text-shop-heading lg:px-8">Categories</p>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 lg:px-8">
          {dashboardCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/dashboard/shop?category=${cat.slug}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-shop-bg lg:h-16 lg:w-16">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-contain p-2.5"
                  sizes="64px"
                />
              </div>
              <span className="text-[11px] font-medium text-shop-text">{cat.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="flex flex-col gap-3 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">
            New Arrivals
          </p>
          <Link href="/dashboard/shop" className="text-[12px] font-semibold text-shop-accent-1">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {newArrivals.map((product) => (
            <AppProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">
            Trending Now
          </p>
          <Link href="/dashboard/shop" className="text-[12px] font-semibold text-shop-accent-1">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {trending.map((product) => (
            <AppProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
