"use client";

import React, { useState } from "react";
import { Menu, ChevronDown, Percent } from "lucide-react";
import { navLinks } from "@/lib/shop-data";

const CategoryNav = () => {
  const [navOpen, setNavOpen] = useState(null);

  return (
    <div className="hidden border-b border-shop-border bg-white font-shop lg:block">
      <div className="mx-auto flex w-full max-w-[1460px] items-center justify-between px-8 py-3">
        <div className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wide text-shop-heading">
          <Menu className="h-4 w-4" />
          Shop By Categories
        </div>

        <nav className="flex items-center gap-7">
          {navLinks.map((link) => (
            <div
              key={link.title}
              className="relative"
              onMouseEnter={() => link.children && setNavOpen(link.title)}
              onMouseLeave={() => link.children && setNavOpen(null)}
            >
              <a
                href={link.href}
                className={`flex items-center gap-1 py-2 text-[14px] font-medium hover:text-shop-accent-1 ${
                  link.title === "Home" ? "text-shop-accent-1" : "text-shop-heading"
                }`}
              >
                {link.title}
                {link.children && <ChevronDown className="h-3 w-3" />}
              </a>
              {link.children && navOpen === link.title && (
                <div className="absolute left-0 top-full z-30 w-[200px] rounded-[6px] border border-shop-border bg-white py-2 shadow-lg">
                  {link.children.map((c) => (
                    <a
                      key={c}
                      href="#"
                      className="block px-4 py-2 text-[13px] text-shop-text hover:bg-shop-bg hover:text-shop-accent-1"
                    >
                      {c}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <a
          href="#"
          className="flex items-center gap-1 text-[14px] font-semibold text-shop-accent-1"
        >
          <Percent className="h-4 w-4" />
          Top Deals
        </a>
      </div>
    </div>
  );
};

export default CategoryNav;
