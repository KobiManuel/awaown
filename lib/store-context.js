"use client";

// The partner store a visitor is *actively* shopping right now - drives the
// nested-page theming (product / cart / checkout). Distinct from the 30-day
// `awaown_ref` attribution cookie: this is session-scoped and cleared the
// moment the visitor leaves the store (homepage, main shop, dashboard, a
// different store...). StoreContextTracker keeps it in sync with the route.

const KEY = "awaown_active_store";
const listeners = new Set();

export function getActiveStore() {
  try {
    return sessionStorage.getItem(KEY) || null;
  } catch {
    return null;
  }
}

export function setActiveStore(code) {
  const next = code || null;
  if (getActiveStore() === next) return;
  try {
    if (next) sessionStorage.setItem(KEY, next);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function clearActiveStore() {
  setActiveStore(null);
}

export function subscribeActiveStore(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
