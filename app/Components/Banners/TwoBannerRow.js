"use client";

import React from "react";
import SubBanner from "./SubBanner";
import { useHomepageContent } from "@/lib/useHomepageContent";

const TwoBannerRow = () => {
  const { content, visibility } = useHomepageContent();
  if (!visibility.twoBannerRow) return null;
  const banners = content.twoBannerRow?.banners ?? [];
  if (banners.length === 0) return null;

  return (
    <div className="mx-auto mt-8 grid w-full max-w-[1460px] grid-cols-1 gap-5 px-4 font-shop sm:grid-cols-2 md:mt-12 md:px-8">
      {banners.map((b, i) => (
        <SubBanner
          key={i}
          image={b.image}
          subheading={b.subheading}
          heading={b.heading}
          buttonText={b.buttonText || "Shop Now"}
          href="/shop"
          align="right"
          textColor="text-white"
          aspect="aspect-[685/240]"
        />
      ))}
    </div>
  );
};

export default TwoBannerRow;
