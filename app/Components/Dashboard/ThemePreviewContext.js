"use client";

import { createContext, useContext } from "react";

// Lets a page (e.g. Partner "Customize My Store") push a live CSS-variable
// override up to the shared AppFrame shell — so the sidebar/bottom nav/every
// accent-colored control on the page reflects an in-progress, unsaved edit
// immediately, without touching Redux until the user hits Save.
export const ThemePreviewContext = createContext({
  setThemePreview: () => {},
});

export function useThemePreview() {
  return useContext(ThemePreviewContext).setThemePreview;
}
