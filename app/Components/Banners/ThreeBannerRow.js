"use client";

import React from "react";
import Link from "next/link";
import { useHomepageContent } from "@/lib/useHomepageContent";

const ThreeBannerRow = () => {
  const { content, visibility } = useHomepageContent();
  if (!visibility.threeBannerRow) return null;
  const banners = content.threeBannerRow?.banners ?? [];
  if (banners.length === 0) return null;

  return (
    <div className="mx-auto mt-8 grid w-full max-w-[1460px] grid-cols-1 gap-5 px-4 font-shop sm:grid-cols-3 md:mt-12 md:px-8">
      {banners.map((b, i) => (
        <div
          key={i}
          className="group relative aspect-[446/180] w-full overflow-hidden rounded-[12px] bg-shop-bg"
        >
          <Link href="/shop" className="absolute inset-0 block overflow-hidden">
            <img
              src={b.image}
              alt={b.heading}
              className="h-full w-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]"
            />
          </Link>
          <div className="pointer-events-none absolute right-[7%] top-0 flex h-full flex-col items-start justify-center gap-1 text-left text-shop-heading sm:items-end sm:text-right">
            <p className="max-w-[160px] text-[14px] font-semibold leading-[18px] sm:max-w-[190px] sm:text-[17px] sm:leading-[22px] md:text-[19px] md:leading-[24px]">
              {b.heading}
            </p>
            {b.price && (
              <p className="text-[12px] font-medium sm:text-[13px]">
                {b.price.includes(":") ? (
                  <>
                    {b.price.split(":")[0]}:{" "}
                    <strong>{b.price.split(":").slice(1).join(":")}</strong>
                  </>
                ) : (
                  <strong>{b.price}</strong>
                )}
              </p>
            )}
            <Link
              href="/shop"
              className="pointer-events-auto mt-1 w-fit text-[12px] font-semibold underline decoration-2 underline-offset-4 hover:text-shop-accent-1 sm:text-[13px]"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreeBannerRow;
