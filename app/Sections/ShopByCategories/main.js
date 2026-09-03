"use client";

import React from "react";
import Link from "next/link";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/lib/api/catalogApi";

const ShopByCategories = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const list = categories ?? [];

  if (!isLoading && list.length === 0) return null;

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="Shop By Categories" />
      <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex w-[130px] shrink-0 flex-col items-center gap-3 md:w-[150px]">
                <Skeleton className="h-[110px] w-[110px] rounded-full md:h-[130px] md:w-[130px]" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : list.map((cat) => (
              <Link
                href={`/shop?category=${cat.slug}`}
                key={cat.slug}
                className="group flex w-[130px] shrink-0 flex-col items-center gap-3 text-center md:w-[150px]"
              >
                <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-shop-accent-1-light text-[32px] font-bold text-shop-accent-1 transition-transform group-hover:scale-105 md:h-[130px] md:w-[130px]">
                  {cat.label.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-shop-heading group-hover:text-shop-accent-1">
                    {cat.label}
                  </p>
                  <p className="text-[12px] text-shop-text/70">
                    {cat.productCount > 0
                      ? `${cat.productCount} ${cat.productCount === 1 ? "item" : "items"}`
                      : "Browse"}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default ShopByCategories;
