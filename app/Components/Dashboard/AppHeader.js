"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// showBackOnDesktop: true for genuine sub-pages (product detail, checkout, order
// detail) reached by drilling in; false (default) for top-level tab pages that are
// already reachable from the desktop sidebar, where a back arrow is redundant.
const AppHeader = ({ title, backHref = "/dashboard", right = null, showBackOnDesktop = false }) => (
  <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-shop-border bg-white/95 px-4 py-3.5 font-shop backdrop-blur lg:px-8 lg:py-5">
    <Link
      href={backHref}
      aria-label="Back"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg ${
        showBackOnDesktop ? "" : "lg:hidden"
      }`}
    >
      <ChevronLeft className="h-5 w-5 text-shop-heading" />
    </Link>
    <h1 className="flex-1 truncate text-[15px] font-semibold text-shop-heading lg:text-[18px]">
      {title}
    </h1>
    {right}
  </header>
);

export default AppHeader;
