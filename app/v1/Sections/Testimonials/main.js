"use client";

import React, { useRef, useState, useEffect } from "react";
import { testimonies } from "./testimonies";
import Testimony from "./item";

const Testimonial = () => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const updateItemsPerView = () => {
    if (window.innerWidth >= 1024) {
      setItemsPerView(3);
    } else if (window.innerWidth >= 768) {
      setItemsPerView(2);
    } else {
      setItemsPerView(1);
    }
  };

  const scrollToSlide = (index) => {
    const slider = sliderRef.current;
    if (slider) {
      const slideWidth = slider.clientWidth / itemsPerView;
      const scrollPosition = slideWidth * index * itemsPerView;
      slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (slider) {
      const slideWidth = slider.clientWidth / itemsPerView;
      const scrollPosition = slider.scrollLeft;
      const newIndex = Math.round(scrollPosition / slideWidth);
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    const slider = sliderRef.current;
    if (slider) slider.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", updateItemsPerView);
      if (slider) slider.removeEventListener("scroll", handleScroll);
    };
  }, [itemsPerView]);

  const totalSlides = Math.ceil(testimonies.length / itemsPerView);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-[40px] px-5 pt-[60px] md:gap-[60px] md:pt-[100px]">
      <div className="flex w-full flex-col items-center justify-center gap-[14px] text-center">
        <span className="rounded-full border border-[#CDCBF9] bg-[#4361FF1A] px-3 py-1 text-[14px] font-medium text-[#827CF1]">
          Testimonials
        </span>
        <h2 className="max-w-[600px] font-['TomatoGrotesk'] text-[32px] font-semibold leading-[38px] text-[#0A0A13] md:text-[48px] md:leading-[54px]">
          Loved by merchants &amp; affiliates
        </h2>
      </div>

      <div
        ref={sliderRef}
        className="hide-scrollbar relative flex w-full max-w-[1100px] gap-[20px] overflow-x-auto scroll-smooth px-5 lg:px-0"
      >
        {testimonies.map((el, idx) => (
          <Testimony
            key={idx}
            testimony={el.review}
            reviewer={el.reviewer}
            initials={el.initials}
            slug={el.slug}
            color={el.colorCode}
          />
        ))}
      </div>

      <div className="flex gap-[10px]">
        {Array.from({ length: totalSlides }, (_, index) => (
          <div
            key={index}
            className="cursor-pointer py-[10px]"
            onClick={() => scrollToSlide(index)}
          >
            <div
              className={`h-[2px] w-[40px] rounded-[4px] ${
                activeIndex === index ? "bg-[#343260]" : "bg-[#D9D9D9]"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
