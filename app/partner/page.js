"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { TrendingUp, Clock, Store, Copy, Check, Share2, ShieldAlert } from "lucide-react";
import { partnerProfile, formatPrice } from "@/lib/partner-data";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

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
  const walletBalance = useSelector((s) => s.partner.walletBalance);
  const earnings = useSelector((s) => s.partner.earnings);
  const storeName = useSelector((s) => s.partner.storeName);
  const verification = useSelector((s) => s.partner.verification);
  const [copied, setCopied] = useState(false);

  const clearedProfit = earnings
    .filter((e) => e.status === "cleared")
    .reduce((sum, e) => sum + e.netProfit, 0);
  const pendingProfit = earnings
    .filter((e) => e.status === "escrow")
    .reduce((sum, e) => sum + e.netProfit, 0);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(partnerProfile.referralLink).catch(() => {});
    }
    setCopied(true);
    showToast("Store link copied");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      <div className="px-4 pt-5 lg:px-8 lg:pt-8">
        <p className="text-[13px] text-shop-text">Hi, {partnerProfile.name.split(" ")[0]} 👋</p>
        <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
          {storeName}
        </p>
      </div>

      {verification.status !== "verified" && (
        <Link
          href="/partner/account"
          className="mx-4 flex items-center gap-3 rounded-[12px] bg-amber-50 p-3.5 lg:mx-8"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.75} />
          <span className="text-[12.5px] leading-[18px] text-amber-800">
            {verification.status === "pending"
              ? "Your identity verification is under review — we'll notify you once it's approved."
              : "You'll need to verify your identity before your first withdrawal. You can do this any time before then."}
          </span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:gap-5 lg:px-8">
        <StatCard icon={TrendingUp} label="Cleared Profit (net)" value={formatPrice(clearedProfit)} />
        <StatCard icon={Clock} label="Pending in Escrow" value={formatPrice(pendingProfit)} />
        <StatCard icon={TrendingUp} label="Wallet Balance" value={formatPrice(walletBalance)} />
        <StatCard icon={Store} label="My Store" value="View" href="/partner/store" />
      </div>

      <div className="mx-4 flex flex-col gap-3 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-5 text-white lg:mx-8">
        <div className="flex items-center gap-2">
          <Share2 className="h-4.5 w-4.5" strokeWidth={1.75} />
          <p className="text-[13.5px] font-semibold">My Store Link</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] bg-white/15 px-3.5 py-3">
          <span className="flex-1 truncate text-[12.5px] text-white/90">
            {partnerProfile.referralLink}
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
          Share this link to send people to your whole store, or grab a link to a single
          product from My Store.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">Quick Links</p>
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
            href={partnerProfile.referralLink.replace("https://awaown.com", "")}
            target="_blank"
            className="col-span-2 rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            Preview My Store — see it the way visitors do
          </Link>
        </div>
      </div>
    </div>
  );
}
