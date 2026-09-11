"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { useGetAboutImagesQuery } from "@/lib/api/storefrontApi";
import AboutImageSlot from "@/app/about/AboutImageSlot";

const SECTIONS = [
  { key: "hero", label: "Hero banner" },
  { key: "merchants", label: "Merchants" },
  { key: "partners", label: "Partners" },
  { key: "investors", label: "Inventory Investors" },
  { key: "customers", label: "Customers" },
];

/** Same placeholder slots the public /about page shows - click one to upload. */
export default function AboutEditor() {
  const { data } = useGetAboutImagesQuery();
  const images = data?.images ?? {};

  return (
    <div className="flex flex-col gap-2.5 px-4 pb-4 lg:px-8">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-shop-heading">
        <ImageIcon className="h-4 w-4 text-shop-accent-1" />
        About Page Images
      </p>
      <p className="text-[11.5px] text-shop-text/60">
        Click any box to upload the photo for that section on the public{" "}
        <a href="/about" target="_blank" rel="noreferrer" className="text-shop-accent-1 underline">
          About Us page
        </a>
        .
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SECTIONS.map((s) => (
          <div key={s.key} className="flex flex-col gap-1.5">
            <AboutImageSlot
              sectionKey={s.key}
              value={images[s.key]}
              alt={s.label}
              editable
              className="aspect-square w-full rounded-[16px]"
            />
            <span className="text-center text-[11px] font-medium text-shop-text">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
