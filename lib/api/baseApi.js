import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, clearAuth } from "@/lib/store/authSlice";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // send/receive the httpOnly refresh cookie
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Single-flight refresh: if several queries 401 at once, only one hits
// /auth/:role/refresh and the rest wait for its result.
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const role = api.getState().auth?.role;
    const isAuthCall =
      typeof args === "string"
        ? args.includes("/auth/")
        : args?.url?.includes("/auth/");

    // Don't try to refresh a failed refresh/login/verify call itself.
    if (role && !isAuthCall) {
      if (!refreshPromise) {
        refreshPromise = rawBaseQuery(
          { url: `/auth/${role}/refresh`, method: "POST" },
          api,
          extraOptions,
        ).finally(() => {
          refreshPromise = null;
        });
      }
      const refreshResult = await refreshPromise;

      if (refreshResult.data?.accessToken) {
        api.dispatch(setAccessToken(refreshResult.data.accessToken));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  // Every domain slice injects into this one API so there's a single cache +
  // middleware. Tags let a mutation in one file invalidate a query in another.
  tagTypes: [
    "Me",
    "Product",
    "Category",
    "Cart",
    "Wishlist",
    "Order",
    "Review",
    "Wallet",
    "Notification",
    "Address",
    "MerchantProduct",
    "MerchantOrder",
    "Payout",
    "PartnerStore",
    "PartnerEarning",
    "Withdrawal",
    "Verification",
    "AdminMerchant",
    "AdminPartner",
    "AdminCustomer",
    "Complaint",
    "AdminOrder",
    "AdminFinance",
    "Banner",
    "Faq",
    "Coupon",
    "Campaign",
    "AutomationRule",
    "TeamMember",
    "Settings",
    "AuditLog",
    "Stats",
    "EmailTemplate",
  ],
  endpoints: () => ({}),
});
