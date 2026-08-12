"use client";

import React, { useState } from "react";
import ProductCard from "@/app/Components/Product/ProductCard";
import { fashionTabs } from "@/lib/shop-data";

const tabNames = Object.keys(fashionTabs);

const FashionTabs = () => {
  const [active, setActive] = useState(tabNames[0]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-6 rounded-[8px] bg-white px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {tabNames.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`relative pb-3 text-[16px] font-semibold transition-colors ${
              active === tab ? "text-shop-accent-1" : "text-shop-text hover:text-shop-heading"
            }`}
          >
            {tab}
            {active === tab && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-shop-accent-1" />
            )}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {fashionTabs[active].map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </div>
  );
};

export default FashionTabs;
