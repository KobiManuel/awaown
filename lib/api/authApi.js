import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Sign up ──────────────────────────────────────────────────────
    register: build.mutation({
      query: ({ role, fullName, email }) => ({
        url: `/auth/${role}/register`,
        method: "POST",
        body: { fullName, email },
      }),
    }),
    verifyRegistration: build.mutation({
      query: ({ role, email, code }) => ({
        url: `/auth/${role}/verify`,
        method: "POST",
        body: { email, code },
      }),
      invalidatesTags: ["Me"],
    }),

    // ── Log in ───────────────────────────────────────────────────────
    requestLogin: build.mutation({
      query: ({ role, email }) => ({
        url: `/auth/${role}/login`,
        method: "POST",
        body: { email },
      }),
    }),
    verifyLogin: build.mutation({
      query: ({ role, email, code }) => ({
        url: `/auth/${role}/login/verify`,
        method: "POST",
        body: { email, code },
      }),
      invalidatesTags: ["Me"],
    }),

    // ── Shared ───────────────────────────────────────────────────────
    resendOtp: build.mutation({
      query: ({ role, email, purpose }) => ({
        url: `/auth/resend-otp`,
        method: "POST",
        body: { role, email, purpose },
      }),
    }),
    completeOnboarding: build.mutation({
      query: (body) => ({
        url: `/onboarding/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    logout: build.mutation({
      query: ({ role }) => ({
        url: `/auth/${role}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),

    // ── Session ──────────────────────────────────────────────────────
    getMe: build.query({
      query: () => `/auth/me`,
      providesTags: ["Me"],
    }),
  }),
  overrideExisting: false,
});

// Admin uses a distinct route prefix (no self-register).
export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminRequestLogin: build.mutation({
      query: ({ email }) => ({
        url: `/admin/auth/login`,
        method: "POST",
        body: { email },
      }),
    }),
    adminVerifyLogin: build.mutation({
      query: ({ email, code }) => ({
        url: `/admin/auth/login/verify`,
        method: "POST",
        body: { email, code },
      }),
      invalidatesTags: ["Me"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useVerifyRegistrationMutation,
  useRequestLoginMutation,
  useVerifyLoginMutation,
  useResendOtpMutation,
  useCompleteOnboardingMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;

export const { useAdminRequestLoginMutation, useAdminVerifyLoginMutation } =
  adminAuthApi;
