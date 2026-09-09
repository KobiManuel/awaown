"use client";

import { useSyncExternalStore } from "react";
import {
  getActiveStore,
  subscribeActiveStore,
} from "@/lib/store-context";
import { useGetPartnerStorefrontQuery } from "@/lib/api/storefrontApi";
import { getAccent, getTheme } from "@/lib/partner-store-options";
import { buildPartnerThemeVars } from "@/lib/partner-theme-vars";

/**
 * The partner store a visitor is *actively* shopping right now (session-scoped -
 * see lib/store-context + StoreContextTracker), resolved to its look: CSS
 * variable overrides, surface colours and the doodle backdrop id. Returns null
 * when there's no active store, so callers render default AwaOwn styling.
 *
 * NOT tied to the 30-day `awaown_ref` attribution cookie - leaving the store
 * (homepage, main shop, dashboard, another store) drops the theme immediately.
 * Reuses the cached storefront query, so no extra request when the visitor came
 * from `/store/<code>`.
 */
export function useStoreTheme() {
  const code = useSyncExternalStore(
    subscribeActiveStore,
    getActiveStore,
    () => null,
  );
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
