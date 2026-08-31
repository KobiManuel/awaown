// Approved theme / accent / font options for Partner store customization.
// Partners can personalize their storefront within these bounds — keeps every
// store recognizably "powered by AwaOwn" while still feeling like their own.

export const STORE_THEMES = [
  {
    id: "classic",
    label: "Classic",
    description: "Clean white background — AwaOwn's default look.",
    pageBg: "#F7F7F8",
    cardBg: "#FFFFFF",
    textColor: "#1A1A1A",
    subtleText: "#6B6B6B",
    border: "#E5E5E5",
  },
  {
    id: "bold",
    label: "Bold",
    description: "Dark background with bright product cards.",
    pageBg: "#141118",
    cardBg: "#211C29",
    textColor: "#FFFFFF",
    subtleText: "#B8B0C4",
    border: "#332C3D",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Sandy cream background, editorial feel.",
    // cardBg was previously pure white — identical to Classic's, so surfaces (cards,
    // sidebar, white-background buttons) didn't visibly change on Warm, only the page
    // background did. Recalibrated so Warm reskins "everything" the same way Bold does:
    // a genuinely warm-tinted card surface, not just a faint page-background tint.
    pageBg: "#F3E6D3",
    cardBg: "#FFF8EC",
    textColor: "#2B2320",
    subtleText: "#8A7A68",
    border: "#E4CFAE",
  },
];

export const STORE_ACCENTS = [
  { id: "purple", label: "AwaOwn Purple", value: "#6D28D9", dark: "#5B21B6" },
  { id: "emerald", label: "Emerald", value: "#059669", dark: "#047857" },
  { id: "amber", label: "Amber", value: "#D97706", dark: "#B45309" },
  { id: "rose", label: "Rose", value: "#E11D48", dark: "#BE123C" },
  { id: "blue", label: "Blue", value: "#2563EB", dark: "#1D4ED8" },
  { id: "teal", label: "Teal", value: "#0D9488", dark: "#0F766E" },
  { id: "orange", label: "Orange", value: "#EA580C", dark: "#C2410C" },
  { id: "pink", label: "Pink", value: "#DB2777", dark: "#BE185D" },
  { id: "slate", label: "Slate", value: "#334155", dark: "#1E293B" },
];

export const STORE_FONTS = [
  { id: "brand", label: "AwaOwn Brand", heading: "brand", body: "brand" },
  { id: "modern", label: "Modern", heading: "poppins", body: "inter" },
  { id: "elegant", label: "Elegant", heading: "playfair", body: "lato" },
  { id: "contemporary", label: "Contemporary", heading: "spaceGrotesk", body: "workSans" },
  { id: "minimal", label: "Minimal", heading: "sora", body: "dmSans" },
  { id: "bold", label: "Bold", heading: "bebasNeue", body: "manrope" },
  { id: "luxury", label: "Luxury", heading: "cormorant", body: "lato" },
  { id: "friendly", label: "Friendly", heading: "outfit", body: "inter" },
  { id: "editorial", label: "Editorial", heading: "josefinSans", body: "merriweather" },
  { id: "geometric", label: "Geometric", heading: "montserrat", body: "manrope" },
  { id: "boutique", label: "Boutique", heading: "caveat", body: "workSans" },
  { id: "classic-serif", label: "Classic Serif", heading: "merriweather", body: "dmSans" },
];

export const STORE_CUSTOMIZATION_DEFAULTS = {
  theme: "classic",
  accent: "purple",
  font: "brand",
};

export function getTheme(id) {
  return STORE_THEMES.find((t) => t.id === id) || STORE_THEMES[0];
}

export function getAccent(id) {
  return STORE_ACCENTS.find((a) => a.id === id) || STORE_ACCENTS[0];
}

export function getFontPairing(id) {
  return STORE_FONTS.find((f) => f.id === id) || STORE_FONTS[0];
}
