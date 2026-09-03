"use client";

import React from "react";
import SubBanner from "./SubBanner";
import { useHomepageContent } from "@/lib/useHomepageContent";

const OneBannerRow = () => {
  const { content, visibility } = useHomepageContent();
  if (!visibility.oneBannerRow) return null;
  const b = content.oneBannerRow;
  if (!b?.image) return null;

  return (
    <div className="mx-auto mt-8 w-full max-w-[1460px] px-4 font-shop md:mt-12 md:px-8">
      <SubBanner
        image={b.image}
        subheading={b.subheading}
        heading={b.heading}
        buttonText={b.buttonText || "Shop Now"}
        href="/shop"
        align="right"
        textColor="text-white"
        aspect="aspect-[3/2] sm:aspect-[16/6] md:aspect-[1400/220]"
        rounded="rounded-[16px]"
        headingMaxWidth="max-w-[260px] sm:max-w-[420px] md:max-w-[520px]"
      />
    </div>
  );
};

export default OneBannerRow;
