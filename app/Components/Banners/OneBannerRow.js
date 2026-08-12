import React from "react";
import SubBanner from "./SubBanner";

const OneBannerRow = () => {
  return (
    <div className="mx-auto mt-8 w-full max-w-[1460px] px-4 font-shop md:mt-12 md:px-8">
      <SubBanner
        image="/v2/images/offer-banner-1.webp"
        subheading="Limited Offer"
        heading="Buy Best Refurbished Apple iPhone 12 Mini Online"
        buttonText="Shop Now"
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
