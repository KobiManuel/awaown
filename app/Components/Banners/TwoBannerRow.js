import React from "react";
import SubBanner from "./SubBanner";

const TwoBannerRow = () => {
  return (
    <div className="mx-auto mt-8 grid w-full max-w-[1460px] grid-cols-1 gap-5 px-4 font-shop sm:grid-cols-2 md:mt-12 md:px-8">
      <SubBanner
        image="/v2/images/cms-banner-1.webp"
        subheading="Up To 20% Off"
        heading="White & Blue Casual Sneakers"
        buttonText="Shop Now"
        align="right"
        textColor="text-white"
        aspect="aspect-[685/240]"
      />
      <SubBanner
        image="/v2/images/cms-banner-2.webp"
        subheading="Up To 25% Off"
        heading="Casual Short Sleeve Solid Top"
        buttonText="Shop Now"
        align="right"
        textColor="text-white"
        aspect="aspect-[685/240]"
      />
    </div>
  );
};

export default TwoBannerRow;
