"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const AppHeader = ({ title, backHref = "/dashboard", right = null }) => (
  <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-shop-border bg-white/95 px-4 py-3.5 font-shop backdrop-blur">
    <Link
      href={backHref}
      aria-label="Back"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-shop-bg"
    >
      <ChevronLeft className="h-5 w-5 text-shop-heading" />
    </Link>
    <h1 className="flex-1 truncate text-[15px] font-semibold text-shop-heading">
      {title}
    </h1>
    {right}
  </header>
);

export default AppHeader;
