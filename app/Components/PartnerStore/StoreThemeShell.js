"use client";

import React from "react";
import { useStoreTheme } from "@/lib/useStoreTheme";
import StorePattern from "@/app/Components/PartnerStore/StorePattern";

/**
 * Wraps a public shopping-flow page (product detail, cart, checkout) so it
 * carries the partner store's look - accent, fonts, surface colours and the
 * doodle backdrop - whenever the visitor is shopping through that store's link.
 * With no active store it renders children untouched.
 *
 * @param {boolean} [paint=true]     apply the store's page background + text colour
 * @param {boolean} [backdrop=true]  draw the doodle pattern behind the content
 */
export default function StoreThemeShell({
  children,
  paint = true,
  backdrop = true,
  className = "",
}) {
  const st = useStoreTheme();
  if (!st) return <>{children}</>;

  return (
    <div
      data-store-theme=""
      className={`relative isolate min-h-full ${className}`}
      style={{
        ...st.vars,
        ...(paint
          ? { backgroundColor: st.pageBg, color: st.textColor }
          : {}),
      }}
    >
      {backdrop && st.pattern !== "none" && (
        <StorePattern
          pattern={st.pattern}
          color={st.accentHex}
          opacity={st.themeId === "bold" ? 0.22 : 0.14}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
