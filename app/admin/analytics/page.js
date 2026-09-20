"use client";

import React from "react";
import { BarChart3, ExternalLink } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";

// Real traffic analytics moved to Google Analytics (GA4) - see
// app/Components/Providers/GoogleAnalytics.js for the tracking side. This
// page used to be a self-built dashboard on top of a PageView table we
// tracked ourselves; that's gone now that GA covers the same ground with
// far more detail, and there's no reason to maintain both.
export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader title="Analytics" backHref="/admin" />
      <div className="mx-4 flex flex-col items-center gap-4 rounded-[16px] border border-shop-border bg-white p-8 text-center lg:mx-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-accent-1-light">
          <BarChart3 className="h-6 w-6 text-shop-accent-1" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[15px] font-semibold text-shop-heading">
            Site traffic now lives in Google Analytics
          </p>
          <p className="max-w-[420px] text-[13px] leading-[19px] text-shop-text">
            Visits, unique visitors, top pages, and every dashboard except this
            one are tracked there directly - more detail than we could build
            ourselves, updated in real time.
          </p>
        </div>
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-[10px] bg-shop-accent-1 px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-shop-accent-1-dark"
        >
          Open Google Analytics
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
