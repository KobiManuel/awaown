"use client";

import { createContext, useContext } from "react";

// Lets a page (e.g. Partner "Customize My Store") push a live preview up to the
// shared AppFrame shell so the sidebar / bottom nav / every accent-colored
// control - and the doodle backdrop - reflect an in-progress, unsaved edit
// immediately, without touching Redux until the user hits Save.
export const ThemePreviewContext = createContext({
  setThemePreview: () => {},
  setPatternPreview: () => {},
});

export function useThemePreview() {
  return useContext(ThemePreviewContext).setThemePreview;
}

// Pass `{ pattern, color }` to preview a backdrop, or `null` to clear it.
export function useStorePatternPreview() {
  return useContext(ThemePreviewContext).setPatternPreview;
}
