import { baseApi } from "./baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Real Nigerian bank list (Paystack's own, includes fintechs) for the
    // merchant payout / partner withdrawal bank picker.
    getBanks: build.query({
      query: () => "/payments/banks",
    }),
    // Confirms an account number actually resolves to a name before a
    // payout/withdrawal is submitted - a mutation (not cached) since it's an
    // explicit one-off check tied to whatever's currently typed in the form.
    resolveAccount: build.mutation({
      query: ({ accountNumber, bankCode }) => ({
        url: `/payments/resolve-account?accountNumber=${encodeURIComponent(accountNumber)}&bankCode=${encodeURIComponent(bankCode)}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBanksQuery, useResolveAccountMutation } = paymentsApi;
