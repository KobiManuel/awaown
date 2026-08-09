import React from "react";
import { Star } from "lucide-react";

const Testimony = ({ initials, color, slug, reviewer, testimony }) => {
  return (
    <div className="slider-md-width lg:w-[32%] shrink-0 rounded-[20px] relative">
      <div
        style={{ backgroundColor: color }}
        className="top px-[40px] rounded-[24px] rounded-br-none py-[40px] flex flex-col gap-[14px]"
      >
        <div className="flex gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-[16px] w-[16px] fill-[#0A0A13] text-[#0A0A13]"
            />
          ))}
        </div>
        <p className="text-[18px] font-[300] leading-[28px]">{testimony}</p>
      </div>
      <div className="footer flex">
        <div className="user-card min-w-[240px] relative">
          <div
            style={{ backgroundColor: color }}
            className="absolute w-[100%] h-[100%] z-[1]"
          ></div>
          <div className="flex py-[20px] rounded-tr-[24px] gap-[14px] bg-white z-[100] relative">
            <div
              style={{ backgroundColor: color }}
              className="avatar flex w-[60px] h-[60px] shrink-0 items-center justify-center rounded-[30px] text-[16px] font-semibold text-[#0A0A13]"
            >
              {initials}
            </div>
            <div className="details flex flex-col gap-[8px] justify-center">
              <p className="text-[18px] font-[400]">{reviewer}</p>
              <p className="text-[14px] font-[400] text-grey-500">{slug}</p>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundColor: color }}
          className="remainder w-full rounded-b-[24px] relative"
        ></div>
      </div>
    </div>
  );
};

export default Testimony;
