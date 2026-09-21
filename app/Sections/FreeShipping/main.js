"use client";

import React from "react";
import { Truck } from "lucide-react";
import { useHomepageContent } from "@/lib/useHomepageContent";

const FreeShipping = () => {
  const { content, isLoading } = useHomepageContent();
  if (isLoading) return null;

  const { message, bgColor } = content.freeShipping ?? {};
  const items = Array.from({ length: 8 });
  return (
    <div
      className="mt-12 flex h-[100px] items-center overflow-hidden font-shop md:mt-16"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex w-max animate-shop-marquee gap-10">
        {[...items, ...items].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 text-white">
            <Truck className="h-5 w-5 text-white" />
            <span className="text-[14px] font-semibold uppercase tracking-wide">
              Free Shipping
            </span>
            <span className="text-[14px] text-white/85">{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeShipping;
