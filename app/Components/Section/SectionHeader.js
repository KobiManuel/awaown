import React from "react";

/**
 * The Optimall theme wraps every section title in a white rounded bar that
 * sits on top of the page's light blue-grey background. Optional right-side
 * slot for carousel arrows / "View All" links.
 */
const SectionHeader = ({ title, children, className = "" }) => {
  return (
    <div
      className={`mb-6 flex items-center justify-between rounded-[8px] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      <h2 className="text-[18px] font-semibold text-shop-heading md:text-[20px]">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default SectionHeader;
