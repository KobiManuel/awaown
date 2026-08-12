import React, { useState } from "react";

const Company = ({ company }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="company-list-item col-span-3 flex flex-col gap-[24px] justify-center bg-[#f3f3f3] h-[135px] rounded-[24px] items-center relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Absolute positioned image */}
      <img
        src={`/assets/images/companies/${company.brand}.png`}
        alt={`${company.brand} logo`}
        className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Company light or dark logo */}
      <div className="z-[100]">
        {isHovered ? (
          <company.dark width={company.width} />
        ) : (
          <company.light width={company.width} />
        )}
      </div>
    </div>
  );
};

export default Company;
