"use client";

import React from "react";
import Image from "next/image";

/**
 * The "sub-banner" hover behaviour: the photo lives in
 * its own overflow-hidden layer and scales up on hover; the text overlay is
 * a separate absolutely-positioned sibling so it never scales or shifts.
 *
 * On mobile the text block still sits toward its aligned edge, but the text
 * itself reads left-aligned (more legible on narrow banners); desktop
 * restores the "true" alignment (right-aligned text in a right-positioned
 * block, etc).
 */
const SubBanner = ({
  image,
  heading,
  subheading,
  buttonText = "Shop Now",
  href = "#",
  align = "left", // left | right | center
  textColor = "text-shop-heading",
  aspect = "aspect-[3/2]",
  rounded = "rounded-[12px]",
  headingMaxWidth = "max-w-[240px] sm:max-w-[280px] md:max-w-[340px]",
}) => {
  const alignClass =
    align === "right"
      ? "left-auto right-[7%] text-left items-start sm:text-right sm:items-end"
      : align === "center"
      ? "left-0 right-0 items-center text-center"
      : "left-[7%] right-auto text-left items-start";

  return (
    <div className={`group relative w-full ${aspect} overflow-hidden ${rounded} bg-shop-bg`}>
      <a href={href} className="absolute inset-0 block overflow-hidden">
        <Image
          src={image}
          alt={heading || ""}
          fill
          className="object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </a>
      <div
        className={`pointer-events-none absolute top-0 flex h-full flex-col justify-center gap-1.5 sm:gap-2 ${alignClass} ${textColor}`}
      >
        {subheading && (
          <p className="text-[11px] font-medium leading-tight sm:text-[13px] md:text-[14px]">
            {subheading}
          </p>
        )}
        {heading && (
          <p className={`${headingMaxWidth} text-[15px] font-semibold leading-[19px] sm:text-[18px] sm:leading-[24px] md:text-[22px] md:leading-[28px]`}>
            {heading}
          </p>
        )}
        {buttonText && (
          <a
            href={href}
            className="pointer-events-auto mt-1 w-fit text-[12px] font-semibold underline decoration-2 underline-offset-4 sm:text-[13px] hover:text-shop-accent-1"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default SubBanner;
