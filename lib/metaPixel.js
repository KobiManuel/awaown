/**
 * Fire a Meta Pixel standard event from anywhere in the app. Safe to call
 * unconditionally - a no-op until MetaPixel.js has actually loaded fbq (no
 * NEXT_PUBLIC_META_PIXEL_ID set, on /admin, or before the script tag runs).
 *
 * Pass eventId for events the backend also sends via the Conversions API
 * (currently just Purchase, as `purchase-<order reference>`) so Meta
 * dedupes the browser and server copies of the same conversion instead of
 * double-counting it.
 */
export function trackMetaEvent(eventName, params, eventId) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) window.fbq("track", eventName, params, { eventID: eventId });
  else window.fbq("track", eventName, params);
}
