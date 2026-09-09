// Option data for the merchant product-variant editor and the storefront picker.
//
// A variable product carries one or more "axes" (Colour, Size, Material, …).
// Each axis has a `type` from VARIANT_TYPE_PRESETS which drives its value input:
// the "color" type shows a swatch picker backed by VARIANT_COLORS; every other
// type is a free tag input seeded with the preset's `suggestions`.

export const VARIANT_TYPE_PRESETS = [
  { id: "color", label: "Colour", suggestions: [] },
  {
    id: "size",
    label: "Size",
    suggestions: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  },
  {
    id: "shoe-size",
    label: "Shoe size",
    suggestions: [
      "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46",
    ],
  },
  {
    id: "material",
    label: "Material",
    suggestions: [
      "Cotton", "Linen", "Silk", "Wool", "Leather", "Suede", "Denim",
      "Polyester", "Nylon", "Wood", "Bamboo", "Glass", "Ceramic",
      "Stainless steel", "Aluminium", "Plastic",
    ],
  },
  {
    id: "style",
    label: "Style / Design",
    suggestions: [
      "Plain", "Solid", "Striped", "Patterned", "Floral", "Vintage",
      "Modern", "Classic", "Slim fit", "Regular fit", "Oversized",
    ],
  },
  {
    id: "storage",
    label: "Storage capacity",
    suggestions: [
      "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB",
    ],
  },
  {
    id: "volume",
    label: "Weight / Volume",
    suggestions: [
      "30ml", "50ml", "100ml", "150ml", "250ml", "500ml", "750ml", "1L", "2L",
      "100g", "250g", "500g", "1kg", "2kg", "5kg", "10kg", "25kg", "50kg",
    ],
  },
  {
    id: "power",
    label: "Power / Voltage",
    suggestions: ["110V", "220V", "240V", "500W", "750W", "1000W", "1500W", "2000W"],
  },
  {
    id: "pack",
    label: "Pack size",
    suggestions: [
      "Single", "Pack of 2", "Pack of 3", "Pack of 4", "Pack of 6",
      "Pack of 10", "Pack of 12", "Box of 24",
    ],
  },
  { id: "custom", label: "Custom…", suggestions: [] },
];

export function variantTypeLabel(id) {
  return VARIANT_TYPE_PRESETS.find((t) => t.id === id)?.label ?? "Option";
}

// Must match the backend's slugValue() so combos keyed client-side line up with
// what the API stores.
export function slugValue(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Full CSS colour set - merchants pick from this when an axis is type "color".
// Sorted common-first, then the long tail alphabetically.
export const VARIANT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#FFFFFF" },
  { label: "Grey", value: "#808080" },
  { label: "Silver", value: "#C0C0C0" },
  { label: "Red", value: "#FF0000" },
  { label: "Maroon", value: "#800000" },
  { label: "Pink", value: "#FFC0CB" },
  { label: "Hot Pink", value: "#FF69B4" },
  { label: "Orange", value: "#FFA500" },
  { label: "Gold", value: "#FFD700" },
  { label: "Yellow", value: "#FFFF00" },
  { label: "Beige", value: "#F5F5DC" },
  { label: "Cream", value: "#FFFDD0" },
  { label: "Brown", value: "#A52A2A" },
  { label: "Tan", value: "#D2B48C" },
  { label: "Khaki", value: "#F0E68C" },
  { label: "Green", value: "#008000" },
  { label: "Olive", value: "#808000" },
  { label: "Lime", value: "#00FF00" },
  { label: "Mint Green", value: "#98FB98" },
  { label: "Teal", value: "#008080" },
  { label: "Turquoise", value: "#40E0D0" },
  { label: "Blue", value: "#0000FF" },
  { label: "Navy", value: "#000080" },
  { label: "Royal Blue", value: "#4169E1" },
  { label: "Sky Blue", value: "#87CEEB" },
  { label: "Purple", value: "#800080" },
  { label: "Violet", value: "#EE82EE" },
  { label: "Lavender", value: "#E6E6FA" },
  { label: "Indigo", value: "#4B0082" },
  { label: "Burgundy", value: "#800020" },
  { label: "Coral", value: "#FF7F50" },
  { label: "Salmon", value: "#FA8072" },
  { label: "Peach", value: "#FFDAB9" },
  { label: "Aqua", value: "#00FFFF" },
  { label: "Charcoal", value: "#36454F" },
  { label: "Ivory", value: "#FFFFF0" },
  { label: "Chocolate", value: "#D2691E" },
  { label: "Rose Gold", value: "#B76E79" },
  { label: "Wine", value: "#722F37" },
  { label: "Mustard", value: "#FFDB58" },
  { label: "Emerald", value: "#50C878" },
  { label: "Forest Green", value: "#228B22" },
  { label: "Dark Green", value: "#006400" },
  { label: "Light Blue", value: "#ADD8E6" },
  { label: "Dark Blue", value: "#00008B" },
  { label: "Cobalt", value: "#0047AB" },
  { label: "Magenta", value: "#FF00FF" },
  { label: "Fuchsia", value: "#FF00FF" },
  { label: "Plum", value: "#DDA0DD" },
  { label: "Crimson", value: "#DC143C" },
  { label: "Brick", value: "#B22222" },
  { label: "Rust", value: "#B7410E" },
  { label: "Amber", value: "#FFBF00" },
  { label: "Sand", value: "#C2B280" },
  { label: "Camel", value: "#C19A6B" },
  { label: "Taupe", value: "#483C32" },
  { label: "Slate", value: "#708090" },
  { label: "Steel Blue", value: "#4682B4" },
  { label: "Denim", value: "#1560BD" },
  { label: "Mauve", value: "#E0B0FF" },
  { label: "Lilac", value: "#C8A2C8" },
  { label: "Aquamarine", value: "#7FFFD4" },
  { label: "Chartreuse", value: "#7FFF00" },
  { label: "Sea Green", value: "#2E8B57" },
  { label: "Dark Grey", value: "#A9A9A9" },
  { label: "Light Grey", value: "#D3D3D3" },
  { label: "Off White", value: "#FAF9F6" },
  { label: "Nude", value: "#E3BC9A" },
  { label: "Baby Blue", value: "#89CFF0" },
  { label: "Baby Pink", value: "#F4C2C2" },
  { label: "Powder Blue", value: "#B0E0E6" },
  { label: "Periwinkle", value: "#CCCCFF" },
  { label: "Cyan", value: "#00FFFF" },
  { label: "Dark Red", value: "#8B0000" },
  { label: "Dark Orange", value: "#FF8C00" },
  { label: "Goldenrod", value: "#DAA520" },
  { label: "Sienna", value: "#A0522D" },
  { label: "Saddle Brown", value: "#8B4513" },
  { label: "Dark Slate Grey", value: "#2F4F4F" },
  { label: "Midnight Blue", value: "#191970" },
  { label: "Orchid", value: "#DA70D6" },
  { label: "Tomato", value: "#FF6347" },
  { label: "Firebrick", value: "#B22222" },
  { label: "Pale Green", value: "#98FB98" },
  { label: "Spring Green", value: "#00FF7F" },
  { label: "Deep Pink", value: "#FF1493" },
  { label: "Medium Purple", value: "#9370DB" },
  { label: "Slate Blue", value: "#6A5ACD" },
  { label: "Cadet Blue", value: "#5F9EA0" },
  { label: "Dark Khaki", value: "#BDB76B" },
  { label: "Rosy Brown", value: "#BC8F8F" },
  { label: "Gainsboro", value: "#DCDCDC" },
  { label: "Snow", value: "#FFFAFA" },
  { label: "Honeydew", value: "#F0FFF0" },
  { label: "Wheat", value: "#F5DEB3" },
  { label: "Moccasin", value: "#FFE4B5" },
];

const HEX_BY_NAME = VARIANT_COLORS.reduce((m, c) => {
  m[c.label.toLowerCase()] = c.value;
  return m;
}, {});

/** Best-guess hex for a colour label, for rendering an existing option's swatch. */
export function colorHex(label) {
  if (!label) return null;
  const s = String(label).trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
  return HEX_BY_NAME[s.toLowerCase()] ?? null;
}

export function isColorAxis(axis) {
  if (axis?.type === "color") return true;
  // Legacy products stored before typed axes: infer from the name, but only
  // when it's plainly a colour axis (not "colour, size, neck-line").
  const untyped = !axis?.type || axis.type === "text";
  return untyped && /^\s*colou?rs?\s*$/i.test(axis?.name || "");
}

/** Cartesian product of each axis's option values → array of {axisKey: value} maps. */
export function comboMatrix(axes) {
  const usable = (axes ?? []).filter(
    (a) => a.key && (a.options ?? []).some((o) => o.value),
  );
  if (!usable.length) return [];
  return usable.reduce(
    (acc, axis) => {
      const opts = axis.options.filter((o) => o.value);
      const next = [];
      for (const partial of acc) {
        for (const o of opts) {
          next.push({ ...partial, [axis.key]: o.value });
        }
      }
      return next;
    },
    [{}],
  );
}

/** Order-independent signature for a combination map. */
export function comboSig(optionValues) {
  return Object.keys(optionValues ?? {})
    .sort()
    .map((k) => `${k}=${optionValues[k]}`)
    .join("|");
}
