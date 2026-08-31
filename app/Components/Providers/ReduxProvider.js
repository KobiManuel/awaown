"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";
import { hydrateCart } from "@/lib/store/cartSlice";
import { hydrateWishlist } from "@/lib/store/wishlistSlice";
import { hydrateAuth } from "@/lib/store/authSlice";
import { hydrateOrders } from "@/lib/store/ordersSlice";
import { hydrateMerchant } from "@/lib/store/merchantSlice";
import { hydratePartner } from "@/lib/store/partnerSlice";
import { hydrateAdmin } from "@/lib/store/adminSlice";

const CART_KEY = "awaown_cart";
const WISHLIST_KEY = "awaown_wishlist";
const AUTH_KEY = "awaown_auth";
const ORDERS_KEY = "awaown_orders";
const MERCHANT_KEY = "awaown_merchant";
const PARTNER_KEY = "awaown_partner";
const ADMIN_KEY = "awaown_admin";
const ALL_KEYS = [CART_KEY, WISHLIST_KEY, AUTH_KEY, ORDERS_KEY, MERCHANT_KEY, PARTNER_KEY, ADMIN_KEY];

const SCHEMA_KEY = "awaown_schema_version";
// Bump this any time seed/demo data changes in a way testers should see fresh —
// new products, changed eligibility flags, new fields on an existing record, etc.
// Every hydration path below (hydrateMerchant, hydratePartner, ...) trusts
// whatever's in localStorage over the current seed data when a key exists, so
// without this, a tester's browser keeps replaying an old snapshot forever and
// never sees anything shipped after their first visit — this is what caused the
// "why don't I see my new demo products" and "why is this order missing a
// timestamp" reports. Bumping this wipes all `awaown_*` keys once, so the next
// load starts clean from the current seed data.
const SCHEMA_VERSION = "2026-08-27.1";

const ReduxProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;

    // If the seed-data schema has moved on since this browser last visited,
    // wipe every persisted key before hydrating so stale demo state (missing
    // fields, outdated eligibility, incomplete history) can't shadow the
    // current seed data. See SCHEMA_VERSION above.
    try {
      if (localStorage.getItem(SCHEMA_KEY) !== SCHEMA_VERSION) {
        for (const key of ALL_KEYS) localStorage.removeItem(key);
        localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
      }
    } catch {
      // ignore (e.g. localStorage unavailable)
    }

    // Hydrate from localStorage after mount (client-only, avoids SSR mismatch).
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      const merchant = JSON.parse(localStorage.getItem(MERCHANT_KEY) || "null");
      const partner = JSON.parse(localStorage.getItem(PARTNER_KEY) || "null");
      const admin = JSON.parse(localStorage.getItem(ADMIN_KEY) || "null");
      store.dispatch(hydrateCart(cart));
      store.dispatch(hydrateWishlist(wishlist));
      store.dispatch(hydrateAuth(auth));
      store.dispatch(hydrateOrders(orders));
      if (merchant) store.dispatch(hydrateMerchant(merchant));
      if (partner) store.dispatch(hydratePartner(partner));
      if (admin) store.dispatch(hydrateAdmin(admin));
    } catch {
      // ignore malformed storage
    }

    // Each key is persisted independently — localStorage has a hard quota shared
    // across the whole origin, and a large image (a banner, a product photo) can
    // push one key's JSON over what's left. Without isolating these, one
    // QuotaExceededError would throw out of the subscriber and silently skip
    // every key after it, making unrelated state (e.g. admin) stop persisting
    // too. `readImageAsCompressedDataURL` (lib/file-utils.js) is the real fix —
    // this is a defense-in-depth backstop, not a substitute for it.
    const persist = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn(`[ReduxProvider] Failed to persist "${key}" to localStorage — likely over quota (large image?).`, err);
      }
    };

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      persist(CART_KEY, state.cart.items);
      persist(WISHLIST_KEY, state.wishlist.items);
      persist(AUTH_KEY, state.auth.isAuthenticated ? state.auth.user : null);
      persist(ORDERS_KEY, state.orders.items);
      persist(MERCHANT_KEY, state.merchant);
      persist(PARTNER_KEY, state.partner);
      persist(ADMIN_KEY, state.admin);
    });

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
