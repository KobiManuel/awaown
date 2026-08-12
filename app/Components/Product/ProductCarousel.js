"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const ProductCarousel = ({ products, title }) => {
  const trackRef = useRef(null);

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const cardWidth = card ? card.getBoundingClientRect().width + 20 : 260;
    track.scrollBy({ left: dir * cardWidth * 2, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1460px] px-4 font-shop md:px-8">
      {title && (
        <SectionHeader title={title}>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCards(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCards(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-shop-border text-shop-heading transition-colors hover:border-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </SectionHeader>
      )}
      <div
        ref={trackRef}
        className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((p, i) => (
          <div
            data-card
            key={i}
            className="w-[46vw] shrink-0 sm:w-[220px] md:w-[240px] lg:w-[260px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
