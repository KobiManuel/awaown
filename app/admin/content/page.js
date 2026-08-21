"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image as ImageIcon, HelpCircle } from "lucide-react";
import { faqsSeed } from "@/lib/admin-data";
import { toggleBannerStatus } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const STATUS_TONE = {
  live: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-shop-accent-1-light text-shop-accent-1",
  draft: "bg-shop-bg text-shop-text",
  published: "bg-emerald-100 text-emerald-700",
};

export default function AdminContentPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const banners = useSelector((s) => s.admin.banners);

  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Content" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Homepage content, banners, FAQs, announcements, categories, blogs and static pages.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <ImageIcon className="h-4 w-4 text-shop-accent-1" />
          Banners
        </p>
        <div className="flex flex-col gap-2">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <div>
                <p className="text-[13px] font-medium text-shop-heading">{b.title}</p>
                <p className="text-[11.5px] text-shop-text/70">{b.location}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  dispatch(toggleBannerStatus(b.id));
                  showToast(`"${b.title}" updated`);
                }}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize ${STATUS_TONE[b.status]}`}
              >
                {b.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
          <HelpCircle className="h-4 w-4 text-shop-accent-1" />
          FAQs
        </p>
        <div className="flex flex-col gap-2">
          {faqsSeed.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-[14px] border border-shop-border bg-white p-3.5">
              <p className="text-[13px] text-shop-heading">{f.question}</p>
              <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold capitalize ${STATUS_TONE[f.status]}`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
