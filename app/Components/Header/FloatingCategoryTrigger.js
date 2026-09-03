"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/api/catalogApi";

const FloatingCategoryTrigger = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef(null);
  const { data: categories } = useGetCategoriesQuery();
  const list = categories ?? [];

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <button
        type="button"
        aria-label="Open categories"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-10 items-center justify-center rounded-r-[8px] bg-shop-accent-1 text-white shadow-lg transition-colors hover:bg-shop-accent-1-dark"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute left-10 top-1/2 z-40 max-h-[70vh] w-[280px] -translate-y-1/2 overflow-y-auto rounded-r-[10px] bg-white py-2 shadow-2xl">
          {list.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-5 py-[10px] text-[14px] text-shop-heading transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
            >
              {cat.label}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-5 py-[10px] text-[14px] font-semibold text-shop-accent-1 hover:bg-shop-bg"
          >
            All Products
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FloatingCategoryTrigger;
