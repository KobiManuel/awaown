"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/lib/api/catalogApi";

const CategorySidebar = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const list = categories ?? [];

  return (
    <div className="hidden w-[300px] shrink-0 rounded-[10px] bg-white lg:flex lg:flex-col">
      <div className="flex-1 py-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-[10px]">
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          : list.map((cat) => (
              <div key={cat.slug} className="group/item relative">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="flex items-center justify-between px-5 py-[10px] text-[14px] text-shop-heading transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
                >
                  {cat.label}
                  {cat.children?.length > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                </Link>

                {cat.children?.length > 0 && (
                  <div className="invisible absolute left-full top-0 z-50 min-h-full w-[240px] rounded-r-[10px] bg-white opacity-0 shadow-xl transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100">
                    <div className="flex flex-col py-2">
                      <p className="px-5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-shop-text/50">
                        {cat.label}
                      </p>
                      {cat.children.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/shop?category=${cat.slug}`}
                          className="px-5 py-[9px] text-[13.5px] text-shop-text transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        <Link
          href="/shop"
          className="flex items-center justify-between px-5 py-[10px] text-[14px] font-semibold text-shop-accent-1 transition-colors hover:bg-shop-bg"
        >
          All Products
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CategorySidebar;
