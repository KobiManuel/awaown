import { baseApi } from "./baseApi";

export const merchantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMerchantOverview: build.query({
      query: () => "/merchant/overview",
      providesTags: ["Stats", "Verification"],
    }),
    getMerchantProducts: build.query({
      query: () => "/merchant/products",
      providesTags: ["MerchantProduct"],
    }),
    createMerchantProduct: build.mutation({
      query: (body) => ({ url: "/merchant/products", method: "POST", body }),
      invalidatesTags: ["MerchantProduct", "Stats", { type: "Product", id: "LIST" }],
    }),
    updateMerchantProduct: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/merchant/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => [
        "MerchantProduct",
        "Stats",
        { type: "Product", id: "LIST" },
        ...(result?.slug ? [{ type: "Product", id: result.slug }] : []),
      ],
    }),
    deleteMerchantProduct: build.mutation({
      query: (id) => ({ url: `/merchant/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["MerchantProduct", "Stats"],
    }),

    getMerchantOrders: build.query({
      query: () => "/merchant/orders",
      providesTags: ["MerchantOrder"],
    }),
    getMerchantOrder: build.query({
      query: (ref) => `/merchant/orders/${ref}`,
      providesTags: (r, e, ref) => [{ type: "MerchantOrder", id: ref }],
    }),
    confirmOrderReady: build.mutation({
      query: (ref) => ({
        url: `/merchant/orders/${ref}/confirm-ready`,
        method: "POST",
      }),
      invalidatesTags: (r, e, ref) => [
        { type: "MerchantOrder", id: ref },
        "MerchantOrder",
        "Stats",
        "Notification",
      ],
    }),
    setMerchantOrderTracking: build.mutation({
      query: ({ reference, ...body }) => ({
        url: `/merchant/orders/${reference}/tracking`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (r, e, { reference }) => [
        { type: "MerchantOrder", id: reference },
        "MerchantOrder",
      ],
    }),

    getMerchantStore: build.query({
      query: () => "/merchant/store",
      providesTags: ["Stats"],
    }),
    updateMerchantStore: build.mutation({
      query: (body) => ({ url: "/merchant/store", method: "PATCH", body }),
      invalidatesTags: ["Stats"],
    }),

    getMerchantPayouts: build.query({
      query: () => "/merchant/payouts",
      providesTags: ["Payout", "Verification"],
    }),
    requestMerchantPayout: build.mutation({
      query: (body) => ({ url: "/merchant/payouts", method: "POST", body }),
      invalidatesTags: ["Payout", "Stats", "Notification"],
    }),

    getMerchantVerification: build.query({
      query: () => "/merchant/verification",
      providesTags: ["Verification"],
    }),
    submitMerchantVerification: build.mutation({
      query: (body) => ({
        url: "/merchant/verification",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Verification", "Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMerchantOverviewQuery,
  useGetMerchantProductsQuery,
  useCreateMerchantProductMutation,
  useUpdateMerchantProductMutation,
  useDeleteMerchantProductMutation,
  useGetMerchantOrdersQuery,
  useGetMerchantOrderQuery,
  useConfirmOrderReadyMutation,
  useSetMerchantOrderTrackingMutation,
  useGetMerchantStoreQuery,
  useUpdateMerchantStoreMutation,
  useGetMerchantPayoutsQuery,
  useRequestMerchantPayoutMutation,
  useGetMerchantVerificationQuery,
  useSubmitMerchantVerificationMutation,
} = merchantApi;
