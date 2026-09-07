"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";

/**
 * A single square image slot for the product form. Tapping it opens the
 * photo-editor crop tool to upload a new image; when `sources` (the product's
 * already-uploaded photos) are passed, it first offers a menu to reuse one of
 * those or upload fresh. Used by variety rows and group-item rows.
 *
 *   <ImagePickerSlot value={url} onChange={setUrl} sources={productImages} />
 */
export default function ImagePickerSlot({
  value,
  onChange,
  sources = [],
  size = "h-16 w-16",
  title = "Crop the photo",
  aspect = 1,
  alt = "",
}) {
  const { pickAndCrop, uploading, modal } = useImageCropUpload("products");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);

  const uploadNew = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await pickAndCrop(file, { aspect, title });
    if (url) onChange(url);
    setMenuOpen(false);
  };

  const open = () => {
    if (sources.length > 0) setMenuOpen((v) => !v);
    else fileRef.current?.click();
  };

  return (
    <div className="relative shrink-0">
      {modal}
      <button
        type="button"
        onClick={open}
        className={`relative flex ${size} items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={alt} className="h-full w-full object-cover" />
        ) : uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
        ) : (
          <ImagePlus className="h-5 w-5 text-shop-text/40" />
        )}
        {uploading && value && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-4 w-4 animate-spin text-shop-accent-1" />
          </span>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
          aria-label="Remove image"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileRef}
        onChange={uploadNew}
      />

      {menuOpen && sources.length > 0 && (
        <div className="absolute left-0 top-[72px] z-20 w-52 rounded-[10px] border border-shop-border bg-white p-2 shadow-lg">
          <p className="px-1 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/50">
            Use a product photo
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {sources.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => {
                  onChange(img);
                  setMenuOpen(false);
                }}
                className={`relative aspect-square overflow-hidden rounded-[6px] border-2 ${
                  value === img ? "border-shop-accent-1" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              fileRef.current?.click();
            }}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-shop-bg py-1.5 text-[11.5px] font-semibold text-shop-heading"
          >
            <ImagePlus className="h-3.5 w-3.5" /> Upload a new photo
          </button>
        </div>
      )}
    </div>
  );
}
