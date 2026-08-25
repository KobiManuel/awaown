import { getTheme, getAccent, getFontPairing } from "@/lib/partner-store-options";
import { STORE_FONT_FAMILIES } from "@/app/Components/PartnerStore/storeFonts";

function lighten(hex, amount = 0.85) {
  const n = hex.replace("#", "");
  const r = parseInt(n.substring(0, 2), 16);
  const g = parseInt(n.substring(2, 4), 16);
  const b = parseInt(n.substring(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

// Builds the CSS-variable override AppFrame applies to reskin the whole Partner
// dashboard shell (sidebar, bottom nav, page background, card surfaces, text
// colors, every accent-colored control) to match a partner's own store theme —
// not just their public storefront preview.
export function buildPartnerThemeVars(themeId, accentId, fontId) {
  const theme = getTheme(themeId);
  const accent = getAccent(accentId);
  const fontPairing = getFontPairing(fontId);
  const bodyFont = STORE_FONT_FAMILIES[fontPairing.body];
  return {
    "--shop-bg": theme.pageBg,
    "--shop-surface": theme.cardBg,
    "--shop-text": theme.subtleText,
    "--shop-heading": theme.textColor,
    "--shop-border": theme.border,
    "--shop-accent-1": accent.value,
    "--shop-accent-1-dark": accent.dark,
    "--shop-accent-1-light": lighten(accent.value),
    "--shop-font-family": bodyFont.style.fontFamily,
  };
}
