"use client";

import { useEffect, useRef } from "react";
import { useSelector, useStore } from "react-redux";
import {
  useAddToCartMutation,
  useToggleWishlistMutation,
} from "@/lib/api/commerceApi";

const FLAG = "awaown_merge_guest";

/**
 * After a guest signs in, fold whatever they built up as a guest (cart +
 * wishlist, persisted in localStorage → the Redux slices) onto their account.
 *
 * The checkout wall sets `awaown_merge_guest` before sending a guest to sign
 * in; this runs once on the first authed dashboard load, replays the items to
 * the API, then clears the flag. The guest slice snapshot is captured
 * synchronously on mount so CommerceSync's server fetch can't race it away.
 */
export default function GuestCommerceMerge() {
  const store = useStore();
  const authed = useSelector(
    (s) => s.auth.status === "authenticated" && s.auth.role === "customer",
  );
  const [addToCart] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const snapshot = useRef(null);
  if (snapshot.current === null) {
    let pending = false;
    try {
      pending = localStorage.getItem(FLAG) === "1";
    } catch {
      /* localStorage unavailable */
    }
    const st = store.getState();
    snapshot.current = {
      pending,
      cart: pending ? st.cart.items.filter((i) => i.productId) : [],
      wishlist: pending ? st.wishlist.items.filter((i) => i.productId) : [],
    };
  }

  const done = useRef(false);

  useEffect(() => {
    const snap = snapshot.current;
    if (!snap.pending || !authed || done.current) return;
    done.current = true;
    try {
      localStorage.removeItem(FLAG);
    } catch {
      /* ignore */
    }
    if (!snap.cart.length && !snap.wishlist.length) return;

    (async () => {
      for (const it of snap.cart) {
        try {
          await addToCart({
            productId: it.productId,
            qty: it.qty,
            variantId: it.variantId ?? undefined,
            variantLabel: it.variantLabel ?? undefined,
          }).unwrap();
        } catch {
          /* skip items that no longer exist / are out of stock */
        }
      }
      for (const w of snap.wishlist) {
        try {
          await toggleWishlist(w.productId).unwrap();
        } catch {
          /* ignore */
        }
      }
    })();
  }, [authed, addToCart, toggleWishlist]);

  return null;
}
