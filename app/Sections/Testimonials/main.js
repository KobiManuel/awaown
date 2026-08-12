"use client";

import React, { useRef } from "react";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/shop-data";
import SectionHeader from "@/app/Components/Section/SectionHeader";
import CarouselArrows from "@/app/Components/Product/CarouselArrows";

const Testimonials = () => {
  const trackRef = useRef(null);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="What Our Clients Say">
        <CarouselArrows targetSelector="[data-testimonial-track]" amount={340} />
      </SectionHeader>
      <div
        ref={trackRef}
        data-testimonial-track
        className="hide-scrollbar flex gap-5 overflow-x-auto pb-2"
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex w-[300px] shrink-0 flex-col gap-4 rounded-[12px] bg-white p-6 md:w-[320px]"
          >
            <Quote className="h-6 w-6 text-shop-accent-1" />
            <p className="text-[14px] leading-[22px] text-shop-text">{t.quote}</p>
            <div className="mt-auto flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop-accent-1-light text-[14px] font-semibold text-shop-accent-1">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-shop-heading">{t.name}</p>
                <p className="text-[12px] text-shop-text/70">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
