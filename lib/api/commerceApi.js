import { baseApi } from "./baseApi";

export const commerceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Cart ─────────────────────────────────────────────────────────
    getCart: build.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: build.mutation({
      query: (body) => ({ url: "/cart", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQty: build.mutation({
      query: ({ id, qty }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: { qty },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: build.mutation({
      query: (id) => ({ url: `/cart/${id}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: build.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

    // ── Wishlist ─────────────────────────────────────────────────────
    getWishlist: build.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    toggleWishlist: build.mutation({
      query: (productId) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlist: build.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // ── Addresses ────────────────────────────────────────────────────
    getAddresses: build.query({
      query: () => "/addresses",
      providesTags: ["Address"],
    }),
    addAddress: build.mutation({
      query: (body) => ({ url: "/addresses", method: "POST", body }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    removeAddress: build.mutation({
      query: (id) => ({ url: `/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Address"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQtyMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useRemoveWishlistMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useRemoveAddressMutation,
} = commerceApi;
