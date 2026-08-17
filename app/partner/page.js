"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { TrendingUp, Clock, Users2, Copy, Check, Share2 } from "lucide-react";
import { partnerProfile, formatPrice } from "@/lib/partner-data";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-2 rounded-[14px] border border-shop-border bg-white p-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
      <Icon className="h-4.5 w-4.5 text-shop-accent-1" strokeWidth={1.75} />
    </div>
    <p className="text-[16px] font-bold text-shop-heading">{value}</p>
    <p className="text-[12px] text-shop-text">{label}</p>
  </div>
);

export default function PartnerHome() {
  const showToast = useToast();
  const walletBalance = useSelector((s) => s.partner.walletBalance);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(partnerProfile.referralLink).catch(() => {});
    }
    setCopied(true);
    showToast("Referral link copied");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px] lg:gap-8">
      <div className="px-4 pt-5 lg:px-8 lg:pt-8">
        <p className="text-[13px] text-shop-text">Hi, {partnerProfile.name.split(" ")[0]} 👋</p>
        <p className="text-[17px] font-semibold text-shop-heading lg:text-[22px]">
          Your partner profit at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:gap-5 lg:px-8">
        <StatCard icon={TrendingUp} label="Total Profit" value={formatPrice(partnerProfile.totalProfit)} />
        <StatCard icon={Clock} label="Pending Profit" value={formatPrice(partnerProfile.pendingProfit)} />
        <StatCard icon={Users2} label="Referrals" value={partnerProfile.totalReferrals} />
        <StatCard icon={TrendingUp} label="Wallet Balance" value={formatPrice(walletBalance)} />
      </div>

      <div className="mx-4 flex flex-col gap-3 rounded-[16px] bg-gradient-to-br from-shop-accent-1 to-shop-accent-2 p-5 text-white lg:mx-8">
        <div className="flex items-center gap-2">
          <Share2 className="h-4.5 w-4.5" strokeWidth={1.75} />
          <p className="text-[13.5px] font-semibold">Your Referral Link</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] bg-white/15 px-3.5 py-3">
          <span className="flex-1 truncate text-[12.5px] text-white/90">
            {partnerProfile.referralLink}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy referral link"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-shop-accent-1"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[12px] text-white/75">
          Share this link — every purchase made through it earns you profit.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-8">
        <p className="text-[14px] font-semibold text-shop-heading lg:text-[16px]">Quick Links</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/partner/products"
            className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            Browse Products to Resell
          </Link>
          <Link
            href="/partner/earnings"
            className="rounded-[14px] border border-shop-border bg-white p-4 text-[13px] font-medium text-shop-heading hover:border-shop-accent-1"
          >
            View Earnings History
          </Link>
        </div>
      </div>
    </div>
  );
}
