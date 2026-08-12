"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselArrows = ({ targetSelector, amount = 320 }) => {
  const scroll = (dir) => {
    const track = document.querySelector(targetSelector);
    if (!track) return;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CarouselArrows;
