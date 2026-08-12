import React from "react";
import CategorySidebar from "@/app/Components/Header/CategorySidebar";
import HeroSlider from "./HeroSlider";

const HeroSection = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1460px] items-stretch gap-5 px-4 pt-4 font-shop md:px-8 md:pt-6">
      <CategorySidebar />
      <HeroSlider />
    </div>
  );
};

export default HeroSection;
