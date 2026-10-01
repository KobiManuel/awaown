"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BUTTON =
  "flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white disabled:pointer-events-none disabled:opacity-30";

/**
 * Two modes, picked by which props are passed:
 * - Scroll mode (targetSelector): nudges a free-scrolling track by `amount`
 *   px - used by sections like Testimonials where cards just scroll past.
 * - Paged mode (onPrev/onNext): the caller owns pagination state (e.g. "show
 *   4 at a time") and just wants these buttons' clicks + disabled styling -
 *   used by Featured Products, where the cards swap in pages rather than
 *   scrolling.
 */
const CarouselArrows = ({
  targetSelector,
  amount = 320,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
}) => {
  const scroll = (dir) => {
    if (!targetSelector) return;
    const track = document.querySelector(targetSelector);
    if (!track) return;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev ?? (() => scroll(-1))}
        disabled={prevDisabled}
        className={BUTTON}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext ?? (() => scroll(1))}
        disabled={nextDisabled}
        className={BUTTON}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CarouselArrows;
