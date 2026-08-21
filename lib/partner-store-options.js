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
    description: "Soft cream background, editorial feel.",
    pageBg: "#FBF5EE",
    cardBg: "#FFFFFF",
    textColor: "#2B2320",
    subtleText: "#7A6E63",
    border: "#EAE0D3",
  },
];

export const STORE_ACCENTS = [
  { id: "purple", label: "AwaOwn Purple", value: "#6D28D9", dark: "#5B21B6" },
  { id: "emerald", label: "Emerald", value: "#059669", dark: "#047857" },
  { id: "amber", label: "Amber", value: "#D97706", dark: "#B45309" },
];

export const STORE_FONTS = [
  { id: "brand", label: "AwaOwn Brand", heading: "brand", body: "brand" },
  { id: "modern", label: "Modern", heading: "poppins", body: "inter" },
  { id: "elegant", label: "Elegant", heading: "playfair", body: "lato" },
  { id: "contemporary", label: "Contemporary", heading: "spaceGrotesk", body: "workSans" },
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
