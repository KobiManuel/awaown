import React from "react";
import Image from "next/image";
import { categories } from "@/lib/shop-data";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const ShopByCategories = () => {
  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="Shop By Categories" />
      <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <a
            href="#"
            key={cat.title}
            className="group flex w-[130px] shrink-0 flex-col items-center gap-3 text-center md:w-[150px]"
          >
            <div
              className="relative h-[110px] w-[110px] overflow-hidden rounded-full transition-transform group-hover:scale-105 md:h-[130px] md:w-[130px]"
              style={{ backgroundColor: cat.color }}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="rounded-full object-cover"
                sizes="130px"
              />
            </div>
            <div>
              <p className="text-[14px] font-medium text-shop-heading group-hover:text-shop-accent-1">
                {cat.title}
              </p>
              <p className="text-[12px] text-shop-text/70">({cat.count} Items)</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategories;
