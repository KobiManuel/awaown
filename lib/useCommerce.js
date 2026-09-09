"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartLocal,
  removeFromCart as removeFromCartLocal,
  updateQty as updateQtyLocal,
} from "@/lib/store/cartSlice";
import {
  toggleWishlist as toggleWishlistLocal,
  removeFromWishlist as removeFromWishlistLocal,
} from "@/lib/store/wishlistSlice";
import {
  useAddToCartMutation,
  useUpdateCartQtyMutation,
  useRemoveCartItemMutation,
  useToggleWishlistMutation,
  useRemoveWishlistMutation,
} from "@/lib/api/commerceApi";

/**
 * One cart/wishlist API for both guests and signed-in customers.
 *
 * - Signed in as a customer → hits the backend (RTK Query); CommerceSync
 *   mirrors the result back into the `cart`/`wishlist` Redux slices.
 * - Guest → writes straight to those same Redux slices, which ReduxProvider
 *   persists to localStorage. On sign-in, GuestCommerceMerge replays the
 *   guest cart/wishlist onto the account.
 *
 * No auth wall here - the only gate is at checkout.
 */
export function useCommerce() {
  const dispatch = useDispatch();
  const authed = useSelector(
    (s) => s.auth.status === "authenticated" && s.auth.role === "customer",
  );
  const wishlistItems = useSelector((s) => s.wishlist.items);

  const [srvAdd] = useAddToCartMutation();
  const [srvUpdateQty] = useUpdateCartQtyMutation();
  const [srvRemoveItem] = useRemoveCartItemMutation();
  const [srvToggleWish] = useToggleWishlistMutation();
  const [srvRemoveWish] = useRemoveWishlistMutation();

  const guestCartId = (productId, variantId) =>
    variantId ? `${productId}::${variantId}` : productId;

  const addToCart = useCallback(
    async (
      product,
      { qty = 1, variantId = null, variantLabel = null, ref } = {},
    ) => {
      if (authed) {
        await srvAdd({
          productId: product.productId,
          qty,
          variantId: variantId ?? undefined,
          variantLabel: variantLabel ?? undefined,
          ref: ref ?? undefined,
        }).unwrap();
        return;
      }
      dispatch(
        addToCartLocal({
          id: guestCartId(product.productId, variantId),
          productId: product.productId,
          slug: product.slug ?? product.id ?? null,
          title: product.title,
          vendor: product.vendor ?? null,
          price: product.price,
          image: product.image ?? product.images?.[0] ?? null,
          qty,
          variantId,
          variantLabel,
          maxQty: product.maxQty ?? null,
        }),
      );
    },
    [authed, dispatch, srvAdd],
  );

  const updateQty = useCallback(
    async (id, qty) => {
      if (authed) await srvUpdateQty({ id, qty }).unwrap();
      else dispatch(updateQtyLocal({ id, qty }));
    },
    [authed, dispatch, srvUpdateQty],
  );

  const removeFromCart = useCallback(
    async (id) => {
      if (authed) await srvRemoveItem(id).unwrap();
      else dispatch(removeFromCartLocal(id));
    },
    [authed, dispatch, srvRemoveItem],
  );

  const isWishlisted = useCallback(
    (product) =>
      wishlistItems.some(
        (i) =>
          i.id === product.id ||
          i.id === product.slug ||
          i.productId === product.productId,
      ),
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (authed) {
        await srvToggleWish(product.productId).unwrap();
        return;
      }
      dispatch(
        toggleWishlistLocal({
          id: product.slug ?? product.id ?? product.productId,
          productId: product.productId,
          title: product.title,
          vendor: product.vendor ?? null,
          price: product.price,
          compareAt: product.compareAt ?? product.compareAtPrice ?? null,
          image: product.image ?? product.images?.[0] ?? null,
        }),
      );
    },
    [authed, dispatch, srvToggleWish],
  );

  const removeFromWishlist = useCallback(
    async (product) => {
      if (authed) {
        await srvRemoveWish(product.productId ?? product).unwrap();
        return;
      }
      dispatch(
        removeFromWishlistLocal(
          product.id ?? product.slug ?? product.productId ?? product,
        ),
      );
    },
    [authed, dispatch, srvRemoveWish],
  );

  return {
    authed,
    addToCart,
    updateQty,
    removeFromCart,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
  };
}
