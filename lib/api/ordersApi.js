import { baseApi } from "./baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getOrder: build.query({
      query: (reference) => `/orders/${reference}`,
      providesTags: (res, err, ref) => [{ type: "Order", id: ref }],
    }),
    checkout: build.mutation({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      invalidatesTags: ["Order", "Cart", "Wallet"],
    }),
    // Real shipping preview (Fez quote when enabled, flat fallback otherwise) for
    // the checkout screen - a POST because it needs the cart/buy-now + address in
    // the body, but it's read-only so RTK Query caches it like any other query.
    getShippingQuote: build.query({
      query: (body) => ({ url: "/orders/shipping-quote", method: "POST", body }),
    }),
    // Live coupon check when the customer clicks "Apply" - a mutation (not a
    // cached query) since it's an explicit one-off action, not data the page
    // just needs to render.
    previewCoupon: build.mutation({
      query: (body) => ({ url: "/orders/coupon/preview", method: "POST", body }),
    }),

    // ── Guest checkout (partner storefronts) - no AwaOwn account, ever;
    // coming back later works by phone number instead of a login. ──────────
    guestCheckout: build.mutation({
      query: (body) => ({ url: "/orders/guest/checkout", method: "POST", body }),
    }),
    guestConfirmPayment: build.mutation({
      query: ({ reference, phone }) => ({
        url: `/orders/guest/${reference}/confirm-payment`,
        method: "POST",
        body: { phone },
      }),
    }),
    getGuestShippingQuote: build.query({
      query: (body) => ({ url: "/orders/guest/shipping-quote", method: "POST", body }),
    }),
    guestConfirmDelivery: build.mutation({
      query: ({ reference, phone }) => ({
        url: `/orders/guest/${reference}/confirm-delivery`,
        method: "POST",
        body: { phone },
      }),
    }),
    getGuestOrderLookup: build.query({
      query: ({ storeCode, phone }) =>
        `/orders/guest/lookup?storeCode=${encodeURIComponent(storeCode)}&phone=${encodeURIComponent(phone)}`,
    }),
    getGuestOrderDetail: build.query({
      query: ({ reference, phone }) =>
        `/orders/guest/${reference}?phone=${encodeURIComponent(phone)}`,
    }),
    confirmPayment: build.mutation({
      query: (reference) => ({
        url: `/orders/${reference}/confirm-payment`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [{ type: "Order", id: ref }, "Order"],
    }),
    confirmDelivery: build.mutation({
      query: (reference) => ({
        url: `/orders/${reference}/confirm-delivery`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [
        { type: "Order", id: ref },
        "Order",
        "Notification",
      ],
    }),
    requestRefund: build.mutation({
      query: ({ reference, reason, description, images }) => ({
        url: `/orders/${reference}/refund`,
        method: "POST",
        body: { reason, description, images },
      }),
      invalidatesTags: (r, e, { reference }) => [
        { type: "Order", id: reference },
        "Order",
        "Notification",
      ],
    }),
    disputeOrder: build.mutation({
      query: ({ reference, reason, description, images }) => ({
        url: `/orders/${reference}/dispute`,
        method: "POST",
        body: { reason, description, images },
      }),
      invalidatesTags: (r, e, { reference }) => [
        { type: "Order", id: reference },
        "Order",
        "Notification",
      ],
    }),
    simulateFulfilment: build.mutation({
      query: (reference) => ({
        url: `/orders/${reference}/simulate-fulfilment`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [
        { type: "Order", id: ref },
        "Order",
        "Wallet",
        "Notification",
      ],
    }),
    retryPayment: build.mutation({
      query: (reference) => ({
        url: `/orders/${reference}/retry-payment`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [{ type: "Order", id: ref }, "Order"],
    }),
    cancelOrder: build.mutation({
      query: (reference) => ({
        url: `/orders/${reference}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [
        { type: "Order", id: ref },
        "Order",
        "Notification",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCheckoutMutation,
  useGetShippingQuoteQuery,
  usePreviewCouponMutation,
  useGuestCheckoutMutation,
  useGuestConfirmPaymentMutation,
  useGetGuestShippingQuoteQuery,
  useGuestConfirmDeliveryMutation,
  useGetGuestOrderLookupQuery,
  useGetGuestOrderDetailQuery,
  useConfirmPaymentMutation,
  useConfirmDeliveryMutation,
  useRequestRefundMutation,
  useDisputeOrderMutation,
  useSimulateFulfilmentMutation,
  useRetryPaymentMutation,
  useCancelOrderMutation,
} = ordersApi;
