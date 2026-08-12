"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";
import { hydrateCart } from "@/lib/store/cartSlice";
import { hydrateWishlist } from "@/lib/store/wishlistSlice";

const CART_KEY = "awaown_cart";
const WISHLIST_KEY = "awaown_wishlist";

const ReduxProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;

    // Hydrate from localStorage after mount (client-only, avoids SSR mismatch).
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      store.dispatch(hydrateCart(cart));
      store.dispatch(hydrateWishlist(wishlist));
    } catch {
      // ignore malformed storage
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(CART_KEY, JSON.stringify(state.cart.items));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist.items));
    });

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
