import React from "react";
import Image from "next/image";
import iPhone from "@/public/assets/images/iphone.png";
import Glasses from "@/public/assets/images/glasses.png";
import Shoes from "@/public/assets/images/shoes.png";
import Dress from "@/public/assets/images/dress.png";
import Cake from "@/public/assets/images/cake.png";
import Cosmetics from "@/public/assets/images/cosmetics.png";
import Hair from "@/public/assets/images/hair.png";

const NewAndPopular = () => {
  return (
    <div className="flex flex-col mt-[40px] md:mt-[100px] max-w-[1360px] m-[auto] w-full  lg:rounded-[54px] relative overflow-hidden gap-[20px] md:gap-[80px]">
      {/* Title and Description */}
      <div className="flex flex-col w-full items-center justify-center gap-[14px]">
        <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
          Featured
        </span>
        <h5 className="text-[#0a0a13] text-[28px] md:text-[48px] text-center max-w-[500px] md:p-0 lg:max-w-[776px] font-[500] font-['TomatoGrotesk'] leading-[40px] md:leading-[60px] tracking-[-0.96px]">
          New &amp; popular
        </h5>
        <p className="text-center max-w-[520px] text-[16px] leading-[26px] text-grey-500 md:text-[18px] md:leading-[28px]">
          Freshly-landed products from our verified merchants.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-5 gap-[8px] sm:gap-[20px] m-auto w-full max-w-[1100px] items-center p-[20px] md:p-0">
        <div className="col-span-1 aspect-square bg-[#FF9D0B] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
          <div className="w-[80%] absolute left-[50%] top-[10%] translate-x-[-50%] ">
            <Image
              src={iPhone}
              alt="Image"
              className="w-full rounded-md object-cover"
            />
          </div>
        </div>
        <div className="col-span-1 w-full flex flex-col gap-[8px] sm:gap-[20px]">
          <div className="w-[100%] shrink-0 bg-[#12A6F0] aspect-[256/125] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
            <div className="absolute w-[111.33%] top-[-20.5px]">
              <Image
                src={Glasses}
                alt="Glass Store"
                className="w-full object-cover"
              />
            </div>
          </div>
          <div className="w-full aspect-square bg-[#31B7AC] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
            <div className="absolute w-[80%] left-[50%] top-[20%] translate-x-[-50%]">
              <Image
                src={Shoes}
                alt="Glass Store"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 w-full aspect-square md:aspect-auto md:h-[456px] bg-[#FFCF29] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
          <div className="absolute w-[171.09%] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <Image
              src={Dress}
              alt="Dress Store"
              className="w-full object-cover"
            />
          </div>
        </div>
        <div className="col-span-1 w-full flex flex-col gap-[8px] sm:gap-[20px]">
          <div className="w-full aspect-square bg-[#FF8844] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
            <div className="absolute w-[80%] left-[50%] top-[40%] translate-x-[-50%] ">
              <Image
                src={Cake}
                alt="Image"
                className="w-full rounded-md object-cover"
              />
            </div>
          </div>
          <div className="w-[100%] shrink-0 bg-[#EED6B0] aspect-[256/125] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
            <div className="absolute w-[81.64%] top-[24%]">
              <Image
                src={Cosmetics}
                alt="Cosmetics Store"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 aspect-square bg-[#000000] rounded-[10px] sm:rounded-[20px] relative overflow-hidden">
          <div className="absolute w-[80%] left-[50%] top-[20%] translate-x-[-50%]">
            <Image
              src={Hair}
              alt="Glass Store"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAndPopular;
