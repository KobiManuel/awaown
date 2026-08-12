import React from "react";
import { Truck } from "lucide-react";

const MESSAGE = "Free delivery now on your first order and over ₦200 - Only ₦200*";

const FreeShipping = () => {
  const items = Array.from({ length: 8 });
  return (
    <div className="mt-12 flex h-[100px] items-center overflow-hidden bg-shop-accent-1 font-shop md:mt-16">
      <div className="flex w-max animate-shop-marquee gap-10">
        {[...items, ...items].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 text-white">
            <Truck className="h-5 w-5 text-white" />
            <span className="text-[14px] font-semibold uppercase tracking-wide">
              Free Shipping
            </span>
            <span className="text-[14px] text-white/85">{MESSAGE}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeShipping;
