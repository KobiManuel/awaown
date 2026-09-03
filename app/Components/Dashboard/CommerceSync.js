"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateCart } from "@/lib/store/cartSlice";
import { hydrateWishlist } from "@/lib/store/wishlistSlice";
import { useGetCartQuery } from "@/lib/api/commerceApi";
import { useGetWishlistQuery } from "@/lib/api/commerceApi";

/**
 * Bridge: keeps the legacy `cart`/`wishlist` Redux slices mirrored from the API
 * so every existing `useSelector(s => s.cart.items)` reader keeps working while
 * mutations go through RTK Query. Mounted once inside the customer dashboard.
 */
export default function CommerceSync() {
  const dispatch = useDispatch();
  const authed = useSelector((s) => s.auth.status === "authenticated");
  const isCustomer = useSelector((s) => s.auth.role === "customer");
  const skip = !authed || !isCustomer;

  const { data: cart } = useGetCartQuery(undefined, { skip });
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip });

  useEffect(() => {
    if (!cart) return;
    dispatch(
      hydrateCart(
        cart.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          slug: i.slug,
          title: i.title,
          vendor: i.vendor,
          price: i.price,
          image: i.image,
          qty: i.qty,
          variantId: i.variantId,
          variantLabel: i.variantLabel,
          maxQty: i.maxQty,
        })),
      ),
    );
  }, [cart, dispatch]);

  useEffect(() => {
    if (!wishlist) return;
    dispatch(
      hydrateWishlist(
        wishlist.items.map((p) => ({
          id: p.slug,
          productId: p.productId,
          title: p.title,
          vendor: p.vendor,
          price: p.price,
          compareAt: p.compareAt,
          image: p.images?.[0] ?? null,
        })),
      ),
    );
  }, [wishlist, dispatch]);

  return null;
}
