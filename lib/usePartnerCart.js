"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPartnerCartItem,
  removePartnerCartItem,
  updatePartnerCartQty,
  clearPartnerCartForStore,
} from "@/lib/store/partnerCartSlice";

const cartItemId = (productId, variantId) =>
  variantId ? `${productId}::${variantId}` : productId;

/**
 * The cart for one partner store, kept apart from the main site's cart. A
 * guest buying from a partner's link never touches AwaOwn's own cart/account
 * system - see backend OrdersService's "Guest checkout" section for why.
 *
 *   const cart = usePartnerCart(code);
 *   cart.add(product, { qty, variantId, variantLabel });
 */
export function usePartnerCart(code) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.partnerCart.byStore[code] ?? []);

  const add = useCallback(
    (product, { qty = 1, variantId = null, variantLabel = null } = {}) => {
      dispatch(
        addPartnerCartItem({
          code,
          item: {
            id: cartItemId(product.productId, variantId),
            productId: product.productId,
            variantId,
            variantLabel,
            title: product.title,
            image: product.image ?? product.images?.[0] ?? null,
            price: product.price,
            deliveryType: product.deliveryType ?? "PHYSICAL",
            qty,
            maxQty: product.maxQty ?? null,
          },
        }),
      );
    },
    [code, dispatch],
  );

  const updateQty = useCallback(
    (id, qty) => dispatch(updatePartnerCartQty({ code, id, qty })),
    [code, dispatch],
  );

  const remove = useCallback(
    (id) => dispatch(removePartnerCartItem({ code, id })),
    [code, dispatch],
  );

  const clear = useCallback(() => dispatch(clearPartnerCartForStore(code)), [code, dispatch]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return { items, add, updateQty, remove, clear, count, subtotal };
}
