import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Sign up ──────────────────────────────────────────────────────
    register: build.mutation({
      query: ({ role, fullName, email, password }) => ({
        url: `/auth/${role}/register`,
        method: "POST",
        body: { fullName, email, password },
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
    loginPassword: build.mutation({
      query: ({ role, email, password }) => ({
        url: `/auth/${role}/login/password`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Me"],
    }),
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

    // ── Forgot / reset password ──────────────────────────────────────
    forgotPassword: build.mutation({
      query: ({ role, email }) => ({
        url: `/auth/${role}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: build.mutation({
      query: ({ role, email, code, password }) => ({
        url: `/auth/${role}/reset-password`,
        method: "POST",
        body: { email, code, password },
      }),
      invalidatesTags: ["Me"],
    }),

    // ── Account settings ─────────────────────────────────────────────
    changePassword: build.mutation({
      query: (body) => ({
        url: `/auth/password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    setLoginMethod: build.mutation({
      query: ({ method }) => ({
        url: `/auth/login-method`,
        method: "PATCH",
        body: { method },
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

// Admin uses a distinct route prefix (no self-register). Password only.
export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminLoginPassword: build.mutation({
      query: ({ email, password }) => ({
        url: `/admin/auth/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Me"],
    }),
    adminForgotPassword: build.mutation({
      query: ({ email }) => ({
        url: `/admin/auth/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),
    adminResetPassword: build.mutation({
      query: ({ email, code, password }) => ({
        url: `/admin/auth/reset-password`,
        method: "POST",
        body: { email, code, password },
      }),
      invalidatesTags: ["Me"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useVerifyRegistrationMutation,
  useLoginPasswordMutation,
  useRequestLoginMutation,
  useVerifyLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSetLoginMethodMutation,
  useResendOtpMutation,
  useCompleteOnboardingMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;

export const {
  useAdminLoginPasswordMutation,
  useAdminForgotPasswordMutation,
  useAdminResetPasswordMutation,
} = adminAuthApi;
