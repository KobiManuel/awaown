"use client";

import React, { useMemo, useRef, useState } from "react";
import { Trash2, X, Plus, Check } from "lucide-react";
import ImagePickerSlot from "@/app/Components/Merchant/ImagePickerSlot";
import {
  VARIANT_TYPE_PRESETS,
  VARIANT_COLORS,
  variantTypeLabel,
  colorHex,
} from "@/lib/variant-options";

let seq = 0;
export const newAxis = () => ({
  id: `ax-${Date.now()}-${seq++}`,
  type: "color",
  name: "Colour",
  useImages: false,
  values: [],
});

/**
 * One variant axis (Colour, Size, Material…): its type, its option values, and
 * an optional per-value image. `axis` is
 * `{ id, type, name, useImages, values: [{ label, swatch?, image? }] }`.
 */
export default function VariantAxisEditor({
  axis,
  onChange,
  onRemove,
  canRemove,
  productImages = [],
}) {
  const isColor = axis.type === "color";
  const isCustom = axis.type === "custom";
  const preset = VARIANT_TYPE_PRESETS.find((t) => t.id === axis.type);

  const [text, setText] = useState("");
  const [colorOpen, setColorOpen] = useState(false);
  const colorBoxRef = useRef(null);

  const takenLabels = useMemo(
    () => new Set(axis.values.map((v) => v.label.toLowerCase())),
    [axis.values],
  );

  const setType = (type) => {
    const p = VARIANT_TYPE_PRESETS.find((t) => t.id === type);
    onChange({
      type,
      name:
        type === "custom"
          ? axis.name && !VARIANT_TYPE_PRESETS.some((t) => t.label === axis.name)
            ? axis.name
            : ""
          : p.label,
      // colour values carry a swatch; leaving colour clears stale swatches
      values: axis.values.map((v) => ({
        ...v,
        swatch: type === "color" ? v.swatch ?? colorHex(v.label) : undefined,
      })),
    });
  };

  const addValue = (label, swatch) => {
    const clean = label.trim();
    if (!clean || takenLabels.has(clean.toLowerCase())) return;
    onChange({
      values: [
        ...axis.values,
        {
          label: clean,
          swatch: axis.type === "color" ? swatch ?? colorHex(clean) : undefined,
          image: null,
        },
      ],
    });
    setText("");
  };

  const removeValue = (i) =>
    onChange({ values: axis.values.filter((_, k) => k !== i) });

  const setValueImage = (i, url) =>
    onChange({
      values: axis.values.map((v, k) => (k === i ? { ...v, image: url } : v)),
    });

  const colorMatches = useMemo(() => {
    const q = text.trim().toLowerCase();
    const list = q
      ? VARIANT_COLORS.filter((c) => c.label.toLowerCase().includes(q))
      : VARIANT_COLORS;
    return list.filter((c) => !takenLabels.has(c.label.toLowerCase())).slice(0, 40);
  }, [text, takenLabels]);

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-shop-border p-3.5">
      <div className="flex items-start gap-2">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <label className="flex flex-col gap-1 sm:w-[46%]">
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/50">
              Variant type
            </span>
            <select
              value={axis.type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            >
              {VARIANT_TYPE_PRESETS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          {isCustom && (
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-shop-text/50">
                Name it
              </span>
              <input
                value={axis.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. Length, Flavour, Scent"
                className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
              />
            </label>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove this variant type"
            className="mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* current values */}
      {axis.values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {axis.values.map((v, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-shop-border bg-white py-1 pl-2 pr-1 text-[12px] text-shop-heading"
            >
              {isColor && (
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: v.swatch || colorHex(v.label) || "#d4d4d4" }}
                />
              )}
              {v.label}
              <button
                type="button"
                onClick={() => removeValue(i)}
                aria-label={`Remove ${v.label}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-shop-text/50 hover:bg-shop-bg hover:text-shop-accent-3"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* value entry */}
      {isColor ? (
        <div className="relative" ref={colorBoxRef}>
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setColorOpen(true);
            }}
            onFocus={() => setColorOpen(true)}
            onBlur={() => setTimeout(() => setColorOpen(false), 150)}
            placeholder="Search colours, or type your own and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue(text);
              }
            }}
            className="w-full rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
          {colorOpen && colorMatches.length > 0 && (
            <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-[10px] border border-shop-border bg-white p-1.5 shadow-lg">
              <div className="grid grid-cols-2 gap-1">
                {colorMatches.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addValue(c.label, c.value)}
                    className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] text-shop-heading hover:bg-shop-bg"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: c.value }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            list={`sugg-${axis.id}`}
            placeholder={
              preset?.suggestions?.length
                ? `e.g. ${preset.suggestions.slice(0, 3).join(", ")}`
                : "Type a value and press Enter"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addValue(text);
              }
            }}
            className="flex-1 rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
          <datalist id={`sugg-${axis.id}`}>
            {(preset?.suggestions ?? []).map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <button
            type="button"
            onClick={() => addValue(text)}
            disabled={!text.trim()}
            className="flex shrink-0 items-center gap-1 rounded-[8px] bg-shop-accent-1 px-3 text-[12.5px] font-semibold text-white disabled:bg-shop-accent-1/40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      )}

      {/* per-value images */}
      <label className="flex items-center gap-2 text-[12px] font-medium text-shop-heading">
        <input
          type="checkbox"
          checked={axis.useImages}
          onChange={(e) => onChange({ useImages: e.target.checked })}
          className="h-4 w-4 accent-[#6d28d9]"
        />
        Show a different photo for each {variantTypeLabel(axis.type).toLowerCase()}
      </label>
      {axis.useImages && axis.values.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {axis.values.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <ImagePickerSlot
                value={v.image}
                onChange={(url) => setValueImage(i, url)}
                sources={productImages}
                size="h-14 w-14"
                title={`Crop the ${v.label} photo`}
                alt={v.label}
              />
              <span className="max-w-[56px] truncate text-[10px] text-shop-text/70">
                {v.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
