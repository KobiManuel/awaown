"use client";

import React from "react";
import StoreThemeShell from "@/app/Components/PartnerStore/StoreThemeShell";

/** Client wrapper so this .tsx page can use StoreThemeShell without tripping
 * tsc's inferred JS prop types for a plain JSX call from a .tsx file. */
export default function CheckoutShell({ children }) {
  return <StoreThemeShell className="min-h-screen">{children}</StoreThemeShell>;
}
