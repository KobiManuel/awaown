"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categoryMenu } from "@/lib/shop-data";

const CategorySidebar = () => {
  return (
    <div className="hidden w-[300px] shrink-0 rounded-[10px] bg-white lg:flex lg:flex-col">
      <div className="flex-1 py-2">
        {categoryMenu.map((cat) => (
          <div key={cat.title} className="group/item relative">
            <Link
              href={cat.href}
              className="flex items-center justify-between px-5 py-[10px] text-[14px] text-shop-heading transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
            >
              {cat.title}
              {cat.children && <ChevronRight className="h-3.5 w-3.5" />}
            </Link>

            {cat.children && (
              <div className="invisible absolute left-full top-0 z-50 min-h-full w-[260px] translate-x-0 rounded-r-[10px] bg-white opacity-0 shadow-xl transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100">
                <div className="flex flex-col py-2">
                  {cat.children.map((c) => (
                    <a
                      key={c}
                      href="#"
                      className="px-5 py-[10px] text-[14px] text-shop-text transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
                    >
                      {c}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
