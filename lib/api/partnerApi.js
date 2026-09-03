import { baseApi } from "./baseApi";

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPartnerOverview: build.query({
      query: () => "/partner/overview",
      providesTags: ["Stats", "Verification"],
    }),
    getPartnerMarketplace: build.query({
      query: (params = {}) => ({ url: "/partner/marketplace", params }),
      providesTags: ["PartnerStore"],
    }),
    getPartnerStore: build.query({
      query: () => "/partner/store",
      providesTags: ["PartnerStore"],
    }),
    addToPartnerStore: build.mutation({
      query: (productId) => ({
        url: "/partner/store",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["PartnerStore", "Stats"],
    }),
    removeFromPartnerStore: build.mutation({
      query: (productId) => ({
        url: `/partner/store/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PartnerStore", "Stats"],
    }),
    setPartnerDiscount: build.mutation({
      query: ({ productId, discount }) => ({
        url: `/partner/store/${productId}`,
        method: "PATCH",
        body: { discount },
      }),
      invalidatesTags: ["PartnerStore"],
    }),

    getPartnerEarnings: build.query({
      query: () => "/partner/earnings",
      providesTags: ["PartnerEarning"],
    }),
    getPartnerWithdrawals: build.query({
      query: () => "/partner/withdrawals",
      providesTags: ["Withdrawal", "Verification"],
    }),
    requestWithdrawal: build.mutation({
      query: (body) => ({
        url: "/partner/withdrawals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Withdrawal", "Stats", "PartnerEarning", "Notification"],
    }),

    savePartnerCustomization: build.mutation({
      query: (body) => ({
        url: "/partner/customization",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Stats"],
    }),

    getPartnerVerification: build.query({
      query: () => "/partner/verification",
      providesTags: ["Verification"],
    }),
    submitPartnerVerification: build.mutation({
      query: (body) => ({
        url: "/partner/verification",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Verification", "Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPartnerOverviewQuery,
  useGetPartnerMarketplaceQuery,
  useGetPartnerStoreQuery,
  useAddToPartnerStoreMutation,
  useRemoveFromPartnerStoreMutation,
  useSetPartnerDiscountMutation,
  useGetPartnerEarningsQuery,
  useGetPartnerWithdrawalsQuery,
  useRequestWithdrawalMutation,
  useSavePartnerCustomizationMutation,
  useGetPartnerVerificationQuery,
  useSubmitPartnerVerificationMutation,
} = partnerApi;
