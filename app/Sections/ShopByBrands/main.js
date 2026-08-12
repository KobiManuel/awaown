"use client";

import React from "react";
import { CompaniesList } from "@/app/v1/Components/v2/Companies/list";
import Company from "@/app/v1/Components/v2/Companies/item";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const ShopByBrands = () => {
  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="Shop By Brands" />
      {/* Company cards hardcode col-span-3 internally (v1's 12-col system),
          so the container width must be a multiple of 3 columns.
          `isolate` contains their internal z-[100] logo layer so it can
          never escape and render above the sticky header / notification
          toast at certain scroll positions. */}
      <div className="isolate grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-9">
        {CompaniesList.map((company, idx) => (
          <Company company={company} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
