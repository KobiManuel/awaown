import { baseApi } from "./baseApi";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWallet: build.query({
      query: () => "/wallet",
      providesTags: ["Wallet"],
    }),
    topUpWallet: build.mutation({
      query: (amount) => ({
        url: "/wallet/top-up",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Wallet", "Me", "Notification"],
    }),
    verifyWalletTopUp: build.mutation({
      query: (reference) => ({
        url: "/wallet/top-up/verify",
        method: "POST",
        body: { reference },
      }),
      invalidatesTags: ["Wallet", "Me", "Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWalletQuery,
  useTopUpWalletMutation,
  useVerifyWalletTopUpMutation,
} = walletApi;
