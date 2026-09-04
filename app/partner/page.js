"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Clock,
  Store,
  Copy,
  Check,
  Share2,
  ShieldAlert,
} from "lucide-react";
import { formatPrice } from "@/lib/partner-data";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import BannerImageButton from "@/app/Components/Dashboard/BannerImageButton";
import {
  useGetPartnerOverviewQuery,
  useSavePartnerCustomizationMutation,
} from "@/lib/api/partnerApi";

const StatCard = ({ icon: Icon, label, value, href }) => {
  const Wrapper = href ? Link : "div";
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
        <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
      </div>
      <p className="text-[16px] font-bold text-shop-heading">{value}</p>
      <p className="text-[12px] text-shop-text">{label}</p>
    </Wrapper>
  );
};

export default function PartnerHome() {
  const showToast = useToast();
  const { data, isLoading } = useGetPartnerOverviewQuery();
  const [saveCustomization] = useSavePartnerCustomizationMutation();
  const [copied, setCopied] = useState(false);

  const p = data?.profile;
  const stats = data?.stats;
  const verified = data?.verification?.status === "VERIFIED";
  const pendingVerif = data?.verification?.status === "PENDING";

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const fullLink = p ? `${origin}${p.referralLink}` : "";

  const handleCopy = () => {
    if (navigator?.clipboard) navigator.clipboard.writeText(fullLink).catch(() => {});
    setCopied(true);
    showToast("Store link copied");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      <div className="relative mx-4 mt-4 flex h-32 items-end overflow-hidden rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 lg:mx-8 lg:mt-8 lg:h-40">
        {p?.bannerUrl && (
          <Image
            src={p.bannerUrl}
            alt="Store banner"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex w-full items-end justify-between p-4">
          <p className="text-[16px] font-bold text-white lg:text-[20px]">
            {p?.storeName ?? "…"}
          </p>
          <div className="flex gap-2">
            <BannerImageButton
              hasBanner={!!p?.bannerUrl}
              onUploaded={(url) => saveCustomization({ bannerUrl: url }).unwrap()}
            />
            {p?.referralLink && (
              <Link
                href={p.referralLink}
                target="_blank"
                className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] font-semibold text-shop-heading"
              >
                Preview Store
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <p className="text-[13px] text-shop-text">
          Hi, {p?.displayName?.split(" ")[0] ?? "there"} 👋
        </p>
        <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
          Welcome back
        </p>
      </div>

      {!verified && (
        <Link
          href="/partner/account"
          className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 lg:mx-8"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-amber-700"
            strokeWidth={1.75}
          />
          <span className="text-[12.5px] leading-[18px] text-amber-800">
            {pendingVerif
              ? "Your identity verification is under review — we'll notify you once it's approved."
              : "You'll need to verify your identity before your first withdrawal."}
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
              label="Cleared Profit (net)"
              value={formatPrice(stats.clearedProfit)}
            />
            <StatCard
              icon={Clock}
              label="Pending in Escrow"
              value={formatPrice(stats.pendingProfit)}
            />
            <StatCard
              icon={TrendingUp}
              label="Wallet Balance"
              value={formatPrice(stats.walletBalance)}
            />
            <StatCard
              icon={Store}
              label="My Store"
              value={`${stats.listings} items`}
              href="/partner/store"
            />
          </>
        )}
      </div>

      <div className="mx-4 flex flex-col gap-3 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-5 text-white lg:mx-8">
        <div className="flex items-center gap-2">
          <Share2 className="h-4.5 w-4.5" strokeWidth={1.75} />
          <p className="text-[13.5px] font-semibold">My Store Link</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] bg-white/15 px-3.5 py-3">
          <span className="flex-1 truncate text-[12.5px] text-white/90">
            {fullLink || "…"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy store link"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-shop-accent-1"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[12px] text-white/75">
          Share this link to send people to your whole store. Add{" "}
          <code className="rounded bg-white/15 px-1">?ref={p?.referralCode}</code>{" "}
          to any product link to earn on that sale.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">
          Quick Links
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/partner/store"
            className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            Manage My Store
          </Link>
          <Link
            href="/partner/earnings"
            className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            View Earnings History
          </Link>
          <Link
            href="/partner/store/marketplace"
            className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            Add from the Marketplace
          </Link>
          {p?.referralLink && (
            <Link
              href={p.referralLink}
              target="_blank"
              className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
            >
              Preview My Store
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
