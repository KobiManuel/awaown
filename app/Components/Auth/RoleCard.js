"use client";

import React from "react";

const RoleCard = ({ icon, title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-[16px] border p-4 text-left transition-colors ${
      selected
        ? "border-shop-accent-1 bg-shop-accent-1-light"
        : "border-shop-border bg-white hover:border-shop-accent-1/40"
    }`}
  >
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
        selected ? "border-shop-accent-1 bg-white" : "border-shop-border bg-shop-bg"
      }`}
    >
      {icon}
    </div>
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="text-[14px] font-semibold text-shop-heading">{title}</p>
      <p className="text-[12.5px] leading-[18px] text-shop-text">{description}</p>
    </div>
  </button>
);

export default RoleCard;
