"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  {
    image: "/v2/images/main-banner-1.webp",
    discount: "FLAT 40% DISCOUNT",
    title: "Unihertz Tank 3 Pro 5G Smartphone",
    price: "STARTS AT: ₦599.50",
  },
  {
    image: "/v2/images/main-banner-2.webp",
    discount: "FLAT 30% DISCOUNT",
    title: "Women's Solid Formal Pink Blazer",
    price: "STARTS AT: ₦69.50",
  },
];

const AUTOPLAY_MS = 5000;

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setActive((idx + slides.length) % slides.length);
  }, []);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, [restartTimer]);

  const handleDotClick = (idx) => {
    goTo(idx);
    restartTimer();
  };

  return (
    <div className="relative w-full flex-1 overflow-hidden rounded-[10px] font-shop">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] sm:aspect-[4/3] md:aspect-[1100/495]">
        {slides.map((slide, idx) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === active ? "opacity-100 z-10" : "pointer-events-none opacity-0 z-0"
            }`}
          >
            <div className="group absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.1]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 px-6 text-white sm:px-10 md:px-16">
              <p className="text-[13px] font-medium uppercase tracking-wide sm:text-[15px]">
                {slide.discount}
              </p>
              <h1 className="max-w-[420px] text-[26px] font-semibold leading-[32px] sm:text-[38px] sm:leading-[44px] md:text-[46px] md:leading-[52px]">
                {slide.title}
              </h1>
              <p className="text-[14px] font-medium sm:text-[16px]">
                {slide.price.split(":")[0]}:{" "}
                <strong className="text-[18px] sm:text-[22px]">
                  {slide.price.split(":")[1]}
                </strong>
              </p>
              <a
                href="#"
                className="pointer-events-auto mt-2 w-fit bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-wide text-shop-heading transition-colors hover:bg-shop-accent-1 hover:text-white"
              >
                Shop Now
              </a>
            </div>
          </div>
        ))}

        {/* Dot indicators - positioned within the actual image box, not the stretched flex wrapper */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => handleDotClick(idx)}
              className={`h-[8px] rounded-full transition-all ${
                idx === active ? "w-[22px] bg-white" : "w-[8px] bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
