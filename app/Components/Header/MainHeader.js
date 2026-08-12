"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Search, Layers, Heart, ShoppingCart, Menu, Phone } from "lucide-react";

const MainHeader = ({ onMenuClick }) => {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0),
  );
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  return (
    <div className="border-b border-shop-border bg-white font-shop">
      <div className="mx-auto flex w-full max-w-[1460px] items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center lg:hidden"
        >
          <Menu className="h-6 w-6 text-shop-heading" />
        </button>

        <Link
          href="/"
          className="relative h-12 w-45 shrink-0 md:h-16 md:w-60"
        >
          <Image
            src="/v2/images/awa-logo.webp"
            alt="AwaOwn"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <div className="hidden flex-1 items-center md:flex">
          <div className="flex w-full max-w-[720px] items-center">
            <input
              type="text"
              placeholder="Search"
              className="h-11 w-full rounded-l-[4px]  px-4 text-[14px] text-shop-heading outline-none placeholder:text-shop-text/60 border border-shop-accent-1 focus:border-shop-accent-1"
            />
            <button
              type="button"
              className="flex h-11 shrink-0 items-center gap-2 bg-shop-accent-1 px-6 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-shop-accent-1-dark"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-5">
          <div className="hidden items-center gap-2 xl:flex">
            <Phone className="h-5 w-5 text-shop-accent-1" />
            <div className="leading-tight">
              <p className="text-[12px] text-shop-text">Need Help?</p>
              <p className="text-[14px] font-semibold text-shop-accent-1">
                +234 803 210 5000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" aria-label="Compare" className="relative">
              <Layers className="h-6 w-6 text-shop-heading" strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-shop-accent-1 text-[10px] text-white">
                0
              </span>
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="h-6 w-6 text-shop-heading" strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-shop-accent-1 text-[10px] text-white">
                {wishlistCount}
              </span>
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingCart
                className="h-6 w-6 text-shop-heading"
                strokeWidth={1.5}
              />
              <span className="absolute -right-2 -top-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-shop-accent-1 text-[10px] text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="flex items-center px-4 pb-4 md:hidden">
        <input
          type="text"
          placeholder="Search"
          className="h-10 w-full rounded-l-[4px] border border-shop-border px-3 text-[14px] outline-none placeholder:text-shop-text/60"
        />
        <button
          type="button"
          className="flex h-10 shrink-0 items-center justify-center bg-shop-accent-1 px-4 text-white"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
