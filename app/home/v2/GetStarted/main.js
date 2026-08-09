"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const GetStarted = () => {
  return (
    <div className="flex flex-col mt-[40px] md:mt-[100px] max-w-[1360px] m-[auto] w-full  lg:rounded-[54px] relative overflow-hidden gap-[40px] md:gap-[80px]">
      {/* Title and Description */}
      <div className="flex flex-col w-full items-center justify-center gap-[8px] md:gap-[14px]">
        <Badge
          className="border-[#CDCBF9] bg-[#4361FF1A] text-[#827CF1]"
          variant="outline"
        >
          How to Start
        </Badge>
        <h5 className="text-[#0a0a13] text-[36px] md:text-[52px] text-center max-w-[500px] p-[20px] md:p-0 lg:max-w-[100%] font-semibold font-['TomatoGrotesk'] leading-[50px]">
          Getting started <br className="visible md:hidden" />
          is easy!
        </h5>
        <p className="text-center max-w-[520px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
          Follow these simple steps to <br className="visible md:hidden" />
          create your storefront.
        </p>
      </div>

      {/* Instruction Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-[20px] p-[20px] md:p-0">
        {/* Download the App Card */}
        <div className="col-span-3 flex flex-col gap-[24px]">
          <div className="w-full aspect-square bg-[#F0F0F599] rounded-[24px] overflow-hidden p-[20px] pb-[0px]">
            <div className="bg-[url(/assets/images/AppStorePage.png)] bg-white width-full h-full bg-cover rounded-t-[20px]"></div>
          </div>
          <div className="flex flex-col gap-[4px] md:gap-[16px] w-full">
            <h3 className="text-[28px] font-['TomatoGrotesk'] font-[600]">
              Sign up on the app
            </h3>
            <p className="text-[16px] font-[400] leading-[24px]">
              You can download the App from the{" "}
              <br className="hidden md:visible" />
              <Link
                href="https://apps.apple.com/gb/app/awashop/id6478110425"
                className="underline font-[700]"
              >
                App Store
              </Link>{" "}
              or{" "}
              <Link href="#" className="underline font-[700]">
                Google Play Store
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Create your shop card */}
        <div className="col-span-3 flex flex-col gap-[24px] pt-[40px]">
          <div className="w-full aspect-square bg-[#F0F0F599] bg-[url(/assets/images/CreateBusiness.png)] bg-cover rounded-[24px] overflow-hidden"></div>
          <div className="flex flex-col gap-[4px] md:gap-[16px] w-full">
            <h3 className="text-[28px] font-['TomatoGrotesk'] font-[600]">
              Create your shop
            </h3>
            <p className="text-[16px] font-[400] leading-[24px]">
              Sign up, build your business profile, and verify your identity.
            </p>
          </div>
        </div>

        {/* Upload your products card */}
        <div className="col-span-3 flex flex-col gap-[24px] pt-[40px] md:pt-0">
          <div className="w-full aspect-square bg-[#F0F0F599] bg-[url(/assets/images/uploadProducts.png)] bg-cover rounded-[24px] overflow-hidden flex justify-end items-end p-[20px]">
            <div className="w-full relative">
              <img
                src="/assets/images/VariantsCTA.png"
                alt="variants of products"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[4px] md:gap-[16px] w-full">
            <h3 className="text-[28px] font-['TomatoGrotesk'] font-[600]">
              Upload products
            </h3>
            <p className="text-[16px] font-[400] leading-[24px]">
              Add your products, including all variants like sizes and colors.
            </p>
          </div>
        </div>

        {/* Go Live card */}
        <div className="col-span-3 flex flex-col gap-[24px] pt-[40px]">
          <div className="w-full aspect-square bg-[#F0F0F599] rounded-[24px] p-[20px] pb-0 overflow-hidden">
            <div className="w-full h-full bg-[url(/assets/images/GoLive.png)] bg-cover"></div>
          </div>
          <div className="flex flex-col gap-[4px] md:gap-[16px] w-full">
            <h3 className="text-[28px] font-['TomatoGrotesk'] font-[600]">
              Go Live!
            </h3>
            <p className="text-[16px] font-[400] leading-[24px]">
              After setting up, request to go live, and your shop-link is ready!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
