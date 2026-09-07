"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import ImagePickerSlot from "@/app/Components/Merchant/ImagePickerSlot";

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
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-shop-border p-3">
      <ImagePickerSlot
        value={value.image}
        onChange={(url) => onChange({ image: url })}
        sources={productImages}
        title="Crop the variety photo"
        alt={value.label}
      />

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
            <MoneyInput
              value={value.price}
              onChange={(v) => onChange({ price: v })}
              placeholder="15,000"
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
