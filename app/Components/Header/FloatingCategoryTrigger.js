"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { categoryMenu } from "@/lib/shop-data";

const FloatingCategoryTrigger = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef(null);

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
        <div className="absolute left-10 top-1/2 z-40 w-[280px] -translate-y-1/2 rounded-r-[10px] bg-white py-2 shadow-2xl">
          {categoryMenu.map((cat) => (
            <div key={cat.title} className="group/item relative">
              <a
                href={cat.href}
                className="flex items-center justify-between px-5 py-[10px] text-[14px] text-shop-heading transition-colors hover:bg-shop-bg hover:text-shop-accent-1"
              >
                {cat.title}
                {cat.children && <ChevronRight className="h-3.5 w-3.5" />}
              </a>

              {cat.children && (
                <div className="invisible absolute left-full top-0 z-50 min-h-full w-[260px] rounded-r-[10px] bg-white opacity-0 shadow-xl transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100">
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
      )}
    </div>
  );
};

export default FloatingCategoryTrigger;
