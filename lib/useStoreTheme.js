"use client";

import { readRef } from "@/lib/partner-ref";
import { useGetPartnerStorefrontQuery } from "@/lib/api/storefrontApi";
import { getAccent, getTheme } from "@/lib/partner-store-options";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";

/**
 * The partner store a visitor is currently shopping through (from the `?ref=`
 * cookie), resolved to its look: CSS-variable overrides, surface colours and
 * the doodle backdrop id. Returns null when there's no active store, so callers
 * can render their default AwaOwn styling.
 *
 * Reuses the cached storefront query - if the visitor came from `/store/<code>`
 * there's no extra request.
 */
export function useStoreTheme() {
  const code = typeof document !== "undefined" ? readRef() : null;
  const { data } = useGetPartnerStorefrontQuery(code, { skip: !code });

  if (!code || !data) return null;

  const theme = getTheme(data.theme);
  return {
    code,
    name: data.name,
    storeHref: `/store/${code}`,
    themeId: data.theme || "classic",
    pattern: data.pattern || "none",
    accentHex: getAccent(data.accent).value,
    pageBg: theme.pageBg,
    cardBg: theme.cardBg,
    textColor: theme.textColor,
    subtleText: theme.subtleText,
    border: theme.border,
    vars: buildPartnerThemeVars(data.theme, data.accent, data.font),
  };
}
