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
  useConfirmPaymentMutation,
  useConfirmDeliveryMutation,
  useRequestRefundMutation,
  useDisputeOrderMutation,
  useSimulateFulfilmentMutation,
  useRetryPaymentMutation,
  useCancelOrderMutation,
} = ordersApi;
