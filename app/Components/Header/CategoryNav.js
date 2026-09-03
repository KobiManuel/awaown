"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, Percent } from "lucide-react";
import { navLinks } from "@/lib/shop-data";
import { useGetCategoriesQuery } from "@/lib/api/catalogApi";

const CategoryNav = () => {
  const { data: categories } = useGetCategoriesQuery();
  const catList = categories ?? [];
  const [open, setOpen] = useState(null);

  return (
    <div className="hidden border-b border-shop-border bg-white font-shop lg:block">
      <div className="mx-auto flex w-full max-w-[1460px] items-center justify-between px-8 py-3">
        <Link
          href="/shop"
          className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wide text-shop-heading hover:text-shop-accent-1"
        >
          <Menu className="h-4 w-4" />
          Shop By Categories
        </Link>

        <nav className="flex items-center gap-7">
          {navLinks.map((link) => {
            const dropdown = link.categories
              ? catList.map((c) => ({
                  label: c.label,
                  href: `/shop?category=${c.slug}`,
                }))
              : link.children ?? null;

            return (
              <div
                key={link.title}
                className="relative"
                onMouseEnter={() => dropdown && setOpen(link.title)}
                onMouseLeave={() => setOpen(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 py-2 text-[14px] font-medium hover:text-shop-accent-1 ${
                    link.title === "Home" ? "text-shop-accent-1" : "text-shop-heading"
                  }`}
                >
                  {link.title}
                  {dropdown && <ChevronDown className="h-3 w-3" />}
                </Link>
                {dropdown && open === link.title && (
                  <div className="absolute left-0 top-full z-30 max-h-[70vh] w-[210px] overflow-y-auto rounded-[6px] border border-shop-border bg-white py-2 shadow-lg">
                    {dropdown.map((c) => (
                      <Link
                        key={c.href + c.label}
                        href={c.href}
                        className="block px-4 py-2 text-[13px] text-shop-text hover:bg-shop-bg hover:text-shop-accent-1"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Link
          href="/shop?deals=1"
          className="flex items-center gap-1 text-[14px] font-semibold text-shop-accent-1"
        >
          <Percent className="h-4 w-4" />
          Top Deals
        </Link>
      </div>
    </div>
  );
};

export default CategoryNav;
