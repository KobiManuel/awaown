"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Search, Bell, ShieldCheck } from "lucide-react";
import { products, dashboardCategories } from "@/lib/dashboard-data";
import AppProductCard from "@/app/Components/Dashboard/AppProductCard";

export default function DashboardHome() {
  const user = useSelector((s) => s.auth.user);
  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "A").charAt(0);

  const newArrivals = products.slice(0, 4);
  const trending = [...products].reverse().slice(0, 4);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop">
      {/* Greeting bar */}
      <div className="flex items-center justify-between px-4 pt-5">
        <div>
          <p className="text-[13px] text-shop-text">Hi, {firstName} 👋</p>
          <p className="text-[17px] font-semibold text-shop-heading">
            Find something you&apos;ll love
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-bg"
          >
            <Bell className="h-4 w-4 text-shop-heading" strokeWidth={1.75} />
          </button>
          <Link
            href="/dashboard/account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1 text-[13px] font-semibold text-white"
          >
            {initial}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <Link
          href="/dashboard/shop"
          className="flex items-center gap-2 rounded-full bg-shop-bg px-4 py-3 text-shop-text/60"
        >
          <Search className="h-4 w-4" />
          <span className="text-[13px]">Search products, brands...</span>
        </Link>
      </div>

      {/* Escrow promo banner */}
      <div className="mx-4 flex items-center gap-3 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-4 text-white">
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
        <p className="px-4 text-[14px] font-semibold text-shop-heading">Categories</p>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4">
          {dashboardCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/dashboard/shop?category=${cat.slug}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-shop-bg">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-contain p-2.5"
                  sizes="56px"
                />
              </div>
              <span className="text-[11px] font-medium text-shop-text">{cat.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading">New Arrivals</p>
          <Link href="/dashboard/shop" className="text-[12px] font-semibold text-shop-accent-1">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {newArrivals.map((product) => (
            <AppProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading">Trending Now</p>
          <Link href="/dashboard/shop" className="text-[12px] font-semibold text-shop-accent-1">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trending.map((product) => (
            <AppProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
