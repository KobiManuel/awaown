"use client";
import { CompaniesList } from "./list";
import React from "react";
import Company from "./item";

const Companies = () => {
  return (
    <div className="flex flex-col mt-0 md:mt-[100px] max-w-[1360px] m-[auto] w-full  lg:rounded-[54px] relative overflow-hidden gap-[20px] md:gap-[80px]">
      {/* Title and Description */}
      <div className="flex flex-col w-full items-center justify-center gap-[14px]">
        <h5 className="text-[#0a0a13] text-[36px] md:text-[52px] text-center max-w-[500px] p-[20px] md:p-0 lg:max-w-[650px] font-semibold font-['TomatoGrotesk'] leading-[50px]">
          200+ fast growing companies use AwaOwn
        </h5>
        <div className="text-center max-w-[489px] text-[#667085] px-[10px] md:px-0 text-base font-normal font-['Inter'] text-[18px] leading-[28px]">
          Many companies have used AwaOwn and they trust us with the safety of
          their money.
        </div>
      </div>

      {/* Instruction Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-[20px] p-[20px] md:p-0">
        {CompaniesList.map((company, idx) => (
          <Company company={company} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Companies;
