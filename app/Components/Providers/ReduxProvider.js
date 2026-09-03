"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";
import { hydrateCart } from "@/lib/store/cartSlice";
import { hydrateWishlist } from "@/lib/store/wishlistSlice";

const CART_KEY = "awaown_cart";
const WISHLIST_KEY = "awaown_wishlist";
// Auth is re-established from the httpOnly refresh cookie (see AppFrame / AuthGate).
// Cart + wishlist are the only client-persisted slices left; everything else
// (orders, merchant, partner, admin) is served by the API.
const ALL_KEYS = [CART_KEY, WISHLIST_KEY];

const SCHEMA_KEY = "awaown_schema_version";
const SCHEMA_VERSION = "2026-09-02.api-only";

const ReduxProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;

    try {
      if (localStorage.getItem(SCHEMA_KEY) !== SCHEMA_VERSION) {
        for (const key of [
          ...ALL_KEYS,
          "awaown_auth",
          "awaown_orders",
          "awaown_merchant",
          "awaown_partner",
          "awaown_admin",
        ]) {
          localStorage.removeItem(key);
        }
        localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
      }
    } catch {
      // ignore (e.g. localStorage unavailable)
    }

    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      store.dispatch(hydrateCart(cart));
      store.dispatch(hydrateWishlist(wishlist));
    } catch {
      // ignore malformed storage
    }

    const persist = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn(`[ReduxProvider] Failed to persist "${key}" to localStorage.`, err);
      }
    };

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      persist(CART_KEY, state.cart.items);
      persist(WISHLIST_KEY, state.wishlist.items);
    });

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
