"use client";

import React from "react";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";
import { useStoreTheme } from "@/lib/useStoreTheme";

/** Client wrapper so the cart page inherits an active partner store's look. */
export default function CartShell({ children }) {
  const storeThemed = !!useStoreTheme();
  return (
    <StoreThemeShell>
      <div
        className={`flex min-h-screen w-full flex-col ${
          storeThemed ? "" : "bg-shop-bg"
        }`}
      >
        {children}
      </div>
    </StoreThemeShell>
  );
}
