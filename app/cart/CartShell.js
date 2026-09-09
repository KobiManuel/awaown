"use client";

import React from "react";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

/** Client wrapper so the cart page inherits an active partner store's look. */
export default function CartShell({ children }) {
  return (
    <StoreThemeShell>
      <div className="flex min-h-screen w-full flex-col bg-shop-bg">{children}</div>
    </StoreThemeShell>
  );
}
