/**
 * Fire a Meta Pixel standard event from anywhere in the app. Safe to call
 * unconditionally - a no-op until MetaPixel.js has actually loaded fbq (no
 * NEXT_PUBLIC_META_PIXEL_ID set, on /admin, or before the script tag runs).
 */
export function trackMetaEvent(eventName, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}
