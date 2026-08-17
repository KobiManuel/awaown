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

const CART_KEY = "awaown_cart";
const WISHLIST_KEY = "awaown_wishlist";
const AUTH_KEY = "awaown_auth";
const ORDERS_KEY = "awaown_orders";
const MERCHANT_KEY = "awaown_merchant";
const PARTNER_KEY = "awaown_partner";

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
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      const merchant = JSON.parse(localStorage.getItem(MERCHANT_KEY) || "null");
      const partner = JSON.parse(localStorage.getItem(PARTNER_KEY) || "null");
      store.dispatch(hydrateCart(cart));
      store.dispatch(hydrateWishlist(wishlist));
      store.dispatch(hydrateAuth(auth));
      store.dispatch(hydrateOrders(orders));
      if (merchant) store.dispatch(hydrateMerchant(merchant));
      if (partner) store.dispatch(hydratePartner(partner));
    } catch {
      // ignore malformed storage
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(CART_KEY, JSON.stringify(state.cart.items));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist.items));
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify(state.auth.isAuthenticated ? state.auth.user : null),
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders.items));
      localStorage.setItem(MERCHANT_KEY, JSON.stringify(state.merchant));
      localStorage.setItem(PARTNER_KEY, JSON.stringify(state.partner));
    });

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
