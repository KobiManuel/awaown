"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X, Trash2 } from "lucide-react";
import { useImageCropUpload } from "@/app/Components/Media/useImageCropUpload";

let seq = 0;
export const newVariety = () => ({
  key: `v-${Date.now()}-${seq++}`,
  label: "",
  price: "",
  stock: "",
  image: null,
});

/**
 * One variety row for the add / edit product forms: its own image with preview,
 * name, price and inventory quantity. `value` is `{ label, price, stock, image }`
 * (strings for the numeric fields).
 *
 * `productImages` — the product's already-uploaded photos. When present, tapping
 * the image slot lets the seller reuse one of those OR upload a new one.
 */
export default function VarietyRow({
  value,
  onChange,
  onRemove,
  canRemove,
  productImages = [],
}) {
  const { pickAndCrop, uploading, modal } = useImageCropUpload("products");
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef(null);

  const uploadNew = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await pickAndCrop(file, {
      aspect: 1,
      title: "Crop the variety photo",
    });
    if (url) onChange({ image: url });
    setPickerOpen(false);
  };

  const openImageStep = () => {
    if (productImages.length > 0) setPickerOpen((v) => !v);
    else fileRef.current?.click();
  };

  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-shop-border p-3">
      {modal}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={openImageStep}
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-shop-border bg-shop-bg"
        >
          {value.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.image} alt={value.label} className="h-full w-full object-cover" />
          ) : uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-shop-text/50" />
          ) : (
            <ImagePlus className="h-5 w-5 text-shop-text/40" />
          )}
        </button>
        {value.image && (
          <button
            type="button"
            onClick={() => onChange({ image: null })}
            className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
            aria-label="Remove image"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}

        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={uploadNew} />

        {pickerOpen && productImages.length > 0 && (
          <div className="absolute left-0 top-[72px] z-20 w-52 rounded-[10px] border border-shop-border bg-white p-2 shadow-lg">
            <p className="px-1 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/50">
              Use a product photo
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {productImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    onChange({ image: img });
                    setPickerOpen(false);
                  }}
                  className={`relative aspect-square overflow-hidden rounded-[6px] border-2 ${
                    value.image === img ? "border-shop-accent-1" : "border-transparent"
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
                setPickerOpen(false);
                fileRef.current?.click();
              }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-shop-bg py-1.5 text-[11.5px] font-semibold text-shop-heading"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Upload a new photo
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <input
          value={value.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Variety name, e.g. Red or 500ml"
          className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
        />
        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50">
              Price (₦)
            </span>
            <input
              value={value.price}
              onChange={(e) => onChange({ price: e.target.value.replace(/[^0-9]/g, "") })}
              inputMode="numeric"
              placeholder="15000"
              className="w-full rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50">
              Inventory qty
            </span>
            <input
              value={value.stock}
              onChange={(e) => onChange({ stock: e.target.value.replace(/[^0-9]/g, "") })}
              inputMode="numeric"
              placeholder="10"
              className="w-full rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
            />
          </label>
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove variety"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
