"use client";

import React, { useMemo, useState } from "react";
import { RotateCcw, Ban } from "lucide-react";
import MoneyInput from "@/app/Components/Inputs/MoneyInput";
import ImagePickerSlot from "@/app/Components/Merchant/ImagePickerSlot";
import { slugValue, isColorAxis, colorHex } from "@/lib/variant-options";

/**
 * The combination table for a variable product. Every cross-product of the
 * axes' values is a row; the merchant sets a price / stock / photo for each and
 * can exclude the ones they don't sell.
 *
 * `combos` is a map keyed by the combo signature →
 * `{ price, stock, image, excluded }`. `onChange` gets the next map.
 */
export default function VariantMatrix({
  axes,
  combos,
  onChange,
  basePrice = "",
  productImages = [],
}) {
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const usableAxes = useMemo(
    () =>
      (axes ?? [])
        .filter((a) => a.name?.trim() && (a.values ?? []).some((v) => v.label.trim()))
        .map((a) => ({
          key: slugValue(a.name) || "option",
          name: a.name.trim(),
          isColor: isColorAxis(a),
          options: a.values
            .filter((v) => v.label.trim())
            .map((v) => ({
              label: v.label.trim(),
              value: slugValue(v.label) || v.label.trim().toLowerCase(),
              swatch: v.swatch || colorHex(v.label),
            })),
        })),
    [axes],
  );

  const rows = useMemo(() => {
    if (!usableAxes.length) return [];
    let acc = [{}];
    for (const axis of usableAxes) {
      const next = [];
      for (const partial of acc) {
        for (const o of axis.options) {
          next.push({ ...partial, [axis.key]: o });
        }
      }
      acc = next;
    }
    return acc.map((picked) => {
      const optionValues = {};
      for (const axis of usableAxes) optionValues[axis.key] = picked[axis.key].value;
      const sig = Object.keys(optionValues)
        .sort()
        .map((k) => `${k}=${optionValues[k]}`)
        .join("|");
      return { sig, optionValues, picked };
    });
  }, [usableAxes]);

  const patch = (sig, next) =>
    onChange({ ...combos, [sig]: { ...(combos[sig] ?? {}), ...next } });

  const activeCount = rows.filter((r) => !combos[r.sig]?.excluded).length;

  if (!rows.length) {
    return (
      <p className="rounded-[10px] bg-shop-bg px-3 py-4 text-[12px] text-shop-text/70">
        Add at least one variant type with a value above and the combinations to
        price will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-shop-heading">
          Combinations ({activeCount} selling
          {activeCount !== rows.length && ` · ${rows.length - activeCount} excluded`})
        </p>
      </div>

      {/* bulk fill */}
      <div className="flex flex-wrap items-end gap-2 rounded-[10px] bg-shop-bg p-2.5">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50">
            Set all prices
          </span>
          <MoneyInput
            value={bulkPrice}
            onChange={setBulkPrice}
            placeholder={basePrice ? Number(basePrice).toLocaleString("en-NG") : "15,000"}
            className="w-28 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-shop-text/50">
            Set all stock
          </span>
          <input
            value={bulkStock}
            onChange={(e) => setBulkStock(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder="10"
            className="w-20 rounded-[6px] border border-shop-border px-2.5 py-1.5 text-[12.5px] outline-none focus:border-shop-accent-1"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (bulkPrice === "" && bulkStock === "") return;
            const next = { ...combos };
            for (const r of rows) {
              const cur = next[r.sig] ?? {};
              next[r.sig] = {
                ...cur,
                ...(bulkPrice !== "" ? { price: bulkPrice } : {}),
                ...(bulkStock !== "" ? { stock: bulkStock } : {}),
              };
            }
            onChange(next);
          }}
          className="rounded-[8px] border border-shop-accent-1 px-3 py-1.5 text-[12px] font-semibold text-shop-accent-1"
        >
          Apply to all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const c = combos[r.sig] ?? {};
          const excluded = !!c.excluded;
          return (
            <div
              key={r.sig}
              className={`flex flex-wrap items-center gap-2.5 rounded-[10px] border p-2.5 ${
                excluded ? "border-dashed border-shop-border opacity-55" : "border-shop-border"
              }`}
            >
              <ImagePickerSlot
                value={c.image}
                onChange={(url) => patch(r.sig, { image: url })}
                sources={productImages}
                size="h-11 w-11"
                title="Crop this combination's photo"
              />
              <div className="flex min-w-[120px] flex-1 flex-wrap items-center gap-1.5">
                {usableAxes.map((axis) => {
                  const opt = r.picked[axis.key];
                  return (
                    <span
                      key={axis.key}
                      className="flex items-center gap-1 rounded-full bg-shop-bg px-2 py-0.5 text-[11.5px] font-medium text-shop-heading"
                    >
                      {axis.isColor && (
                        <span
                          className="h-3 w-3 rounded-full border border-black/10"
                          style={{ backgroundColor: opt.swatch || "#d4d4d4" }}
                        />
                      )}
                      {opt.label}
                    </span>
                  );
                })}
              </div>

              {!excluded && (
                <>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-medium uppercase tracking-wide text-shop-text/50">
                      Price ₦
                    </span>
                    <MoneyInput
                      value={c.price ?? ""}
                      onChange={(v) => patch(r.sig, { price: v })}
                      placeholder={basePrice ? Number(basePrice).toLocaleString("en-NG") : "15,000"}
                      className="w-24 rounded-[6px] border border-shop-border px-2 py-1.5 text-[12px] outline-none focus:border-shop-accent-1"
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-medium uppercase tracking-wide text-shop-text/50">
                      Stock
                    </span>
                    <input
                      value={c.stock ?? ""}
                      onChange={(e) =>
                        patch(r.sig, { stock: e.target.value.replace(/[^0-9]/g, "") })
                      }
                      inputMode="numeric"
                      placeholder="0"
                      className="w-16 rounded-[6px] border border-shop-border px-2 py-1.5 text-[12px] outline-none focus:border-shop-accent-1"
                    />
                  </label>
                </>
              )}
              {excluded && (
                <span className="flex-1 text-[11.5px] text-shop-text/60">Not sold</span>
              )}

              <button
                type="button"
                onClick={() => patch(r.sig, { excluded: !excluded })}
                className="flex h-8 items-center gap-1 rounded-[8px] px-2 text-[11px] font-semibold text-shop-text/60 hover:bg-shop-bg"
              >
                {excluded ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </>
                ) : (
                  <>
                    <Ban className="h-3.5 w-3.5" /> Exclude
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
