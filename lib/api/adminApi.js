import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminOverview: build.query({
      query: () => "/admin/overview",
      providesTags: ["Stats", "AdminMerchant", "AdminPartner"],
    }),
    adminSearch: build.query({
      query: (q) => `/admin/search?q=${encodeURIComponent(q)}`,
    }),

    getAdminMerchants: build.query({
      query: () => "/admin/merchants",
      providesTags: ["AdminMerchant"],
    }),
    getAdminMerchant: build.query({
      query: (id) => `/admin/merchants/${id}`,
      providesTags: (r, e, id) => [{ type: "AdminMerchant", id }],
    }),
    setAdminMerchantStatus: build.mutation({
      query: ({ id, status, reason }) => ({
        url: `/admin/merchants/${id}/status`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: ["AdminMerchant", "AuditLog"],
    }),
    reviewAdminMerchantKyc: build.mutation({
      query: ({ id, approve, note }) => ({
        url: `/admin/merchants/${id}/verification`,
        method: "PATCH",
        body: { approve, note },
      }),
      invalidatesTags: ["AdminMerchant", "AuditLog", "Stats"],
    }),

    getAdminPartners: build.query({
      query: () => "/admin/partners",
      providesTags: ["AdminPartner"],
    }),
    getAdminPartner: build.query({
      query: (id) => `/admin/partners/${id}`,
      providesTags: (r, e, id) => [{ type: "AdminPartner", id }],
    }),
    setAdminPartnerStatus: build.mutation({
      query: ({ id, status, reason }) => ({
        url: `/admin/partners/${id}/status`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: ["AdminPartner", "AuditLog"],
    }),
    reviewAdminPartnerKyc: build.mutation({
      query: ({ id, approve, note }) => ({
        url: `/admin/partners/${id}/verification`,
        method: "PATCH",
        body: { approve, note },
      }),
      invalidatesTags: ["AdminPartner", "AuditLog", "Stats"],
    }),

    getAdminCustomers: build.query({
      query: () => "/admin/customers",
      providesTags: ["AdminCustomer"],
    }),
    getAdminComplaints: build.query({
      query: () => "/admin/complaints",
      providesTags: ["Complaint"],
    }),
    getAdminComplaint: build.query({
      query: (id) => `/admin/complaints/${id}`,
      providesTags: (r, e, id) => [{ type: "Complaint", id }],
    }),
    replyAdminComplaint: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/complaints/${id}/messages`,
        method: "POST",
        body: { body },
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Complaint", id }, "Complaint", "Stats"],
    }),
    resolveAdminComplaint: build.mutation({
      query: ({ id, resolved }) => ({
        url: `/admin/complaints/${id}`,
        method: "PATCH",
        body: { resolved },
      }),
      invalidatesTags: (r, e, { id }) => [
        { type: "Complaint", id },
        "Complaint",
        "AuditLog",
        "Stats",
      ],
    }),

    getAdminOrders: build.query({
      query: (status) =>
        status ? `/admin/orders?status=${status}` : "/admin/orders",
      providesTags: ["AdminOrder"],
    }),
    getAdminOrder: build.query({
      query: (reference) => `/admin/orders/${reference}`,
      providesTags: (r, e, reference) => [{ type: "AdminOrder", id: reference }],
    }),
    advanceAdminOrder: build.mutation({
      query: ({ reference, to, tracking }) => ({
        url: `/admin/orders/${reference}/advance`,
        method: "PATCH",
        body: { to, ...(tracking ? { tracking } : {}) },
      }),
      invalidatesTags: ["AdminOrder", "AuditLog", "AdminFinance"],
    }),

    getAdminProducts: build.query({
      query: (approval) =>
        approval ? `/admin/products?approval=${approval}` : "/admin/products",
      providesTags: ["Product"],
    }),
    setAdminProductApproval: build.mutation({
      query: ({ id, action, reason }) => ({
        url: `/admin/products/${id}/approval`,
        method: "PATCH",
        body: { action, reason },
      }),
      invalidatesTags: ["Product", "AuditLog", "Stats"],
    }),

    getAdminFinance: build.query({
      query: () => "/admin/finance",
      providesTags: ["AdminFinance"],
    }),
    decideRefund: build.mutation({
      query: ({ id, approve }) => ({
        url: `/admin/refunds/${id}`,
        method: "PATCH",
        body: { approve },
      }),
      invalidatesTags: ["AdminFinance", "AuditLog", "Stats"],
    }),
    decidePayout: build.mutation({
      query: ({ reference, action }) => ({
        url: `/admin/payouts/${reference}`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["AdminFinance", "AuditLog", "Stats"],
    }),
    decideWithdrawal: build.mutation({
      query: ({ reference, action }) => ({
        url: `/admin/withdrawals/${reference}`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["AdminFinance", "AuditLog", "Stats"],
    }),

    getAutomations: build.query({
      query: () => "/admin/automations",
      providesTags: ["AutomationRule"],
    }),
    toggleAutomation: build.mutation({
      query: (id) => ({ url: `/admin/automations/${id}`, method: "PATCH" }),
      invalidatesTags: ["AutomationRule", "AuditLog"],
    }),

    getAdminBanners: build.query({
      query: () => "/admin/content/banners",
      providesTags: ["Banner"],
    }),
    saveAdminBanner: build.mutation({
      query: (body) => ({
        url: "/admin/content/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),
    removeAdminBanner: build.mutation({
      query: (id) => ({
        url: `/admin/content/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
    getAdminFaqs: build.query({
      query: () => "/admin/content/faqs",
      providesTags: ["Faq"],
    }),
    saveAdminFaq: build.mutation({
      query: (body) => ({ url: "/admin/content/faqs", method: "POST", body }),
      invalidatesTags: ["Faq"],
    }),
    removeAdminFaq: build.mutation({
      query: (id) => ({ url: `/admin/content/faqs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Faq"],
    }),

    getAdminCategories: build.query({
      query: () => "/admin/content/categories",
      providesTags: ["Category"],
    }),
    saveAdminCategory: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/content/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category", "AuditLog"],
    }),
    setCategoryDefaultImage: build.mutation({
      query: (imageUrl) => ({
        url: "/admin/content/categories/default-image",
        method: "PATCH",
        body: { imageUrl },
      }),
      invalidatesTags: ["Category", "AuditLog"],
    }),

    getAdminCoupons: build.query({
      query: () => "/admin/coupons",
      providesTags: ["Coupon"],
    }),
    saveAdminCoupon: build.mutation({
      query: (body) => ({ url: "/admin/coupons", method: "POST", body }),
      invalidatesTags: ["Coupon"],
    }),
    getAdminCampaigns: build.query({
      query: () => "/admin/campaigns",
      providesTags: ["Campaign"],
    }),
    sendAdminCampaign: build.mutation({
      query: (body) => ({ url: "/admin/campaigns", method: "POST", body }),
      invalidatesTags: ["Campaign", "AuditLog"],
    }),

    getAdminTeam: build.query({
      query: () => "/admin/team",
      providesTags: ["TeamMember"],
    }),
    setTeamRole: build.mutation({
      query: ({ id, teamRole }) => ({
        url: `/admin/team/${id}`,
        method: "PATCH",
        body: { teamRole },
      }),
      invalidatesTags: ["TeamMember", "AuditLog"],
    }),
    inviteTeamMember: build.mutation({
      query: (body) => ({ url: "/admin/team", method: "POST", body }),
      invalidatesTags: ["TeamMember", "AuditLog"],
    }),
    removeTeamMember: build.mutation({
      query: (id) => ({ url: `/admin/team/${id}`, method: "DELETE" }),
      invalidatesTags: ["TeamMember", "AuditLog"],
    }),

    getAdminSettings: build.query({
      query: () => "/admin/settings",
      providesTags: ["Settings"],
    }),
    updateAdminSettings: build.mutation({
      query: (patch) => ({ url: "/admin/settings", method: "PATCH", body: patch }),
      invalidatesTags: ["Settings", "AuditLog"],
    }),

    getAuditLog: build.query({
      query: () => "/admin/audit-log",
      providesTags: ["AuditLog"],
    }),

    getAdminReports: build.query({
      query: () => "/admin/reports",
      providesTags: ["Stats"],
    }),

    getHomepageCms: build.query({
      query: () => "/admin/content/homepage",
      providesTags: ["Settings"],
    }),
    saveHomepageCms: build.mutation({
      query: (body) => ({
        url: "/admin/content/homepage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings", "AuditLog"],
    }),

    getEmailTemplates: build.query({
      query: () => "/admin/email-templates",
      providesTags: ["EmailTemplate"],
    }),
    getEmailTemplate: build.query({
      query: (key) => `/admin/email-templates/${key}`,
      providesTags: (r, e, key) => [{ type: "EmailTemplate", id: key }],
    }),
    previewEmailTemplate: build.mutation({
      query: ({ key, subject, body }) => ({
        url: `/admin/email-templates/${key}/preview`,
        method: "POST",
        body: { subject, body },
      }),
    }),
    saveEmailTemplate: build.mutation({
      query: ({ key, ...body }) => ({
        url: `/admin/email-templates/${key}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (r, e, { key }) => [
        "EmailTemplate",
        { type: "EmailTemplate", id: key },
        "AuditLog",
      ],
    }),
    testEmailTemplate: build.mutation({
      query: ({ key, to }) => ({
        url: `/admin/email-templates/${key}/test`,
        method: "POST",
        body: { to },
      }),
    }),

    setOrderTracking: build.mutation({
      query: ({ reference, ...body }) => ({
        url: `/admin/orders/${reference}/tracking`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminOrder"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminOverviewQuery,
  useAdminSearchQuery,
  useGetAdminMerchantsQuery,
  useGetAdminMerchantQuery,
  useSetAdminMerchantStatusMutation,
  useReviewAdminMerchantKycMutation,
  useGetAdminPartnersQuery,
  useGetAdminPartnerQuery,
  useSetAdminPartnerStatusMutation,
  useReviewAdminPartnerKycMutation,
  useGetAdminCustomersQuery,
  useGetAdminComplaintsQuery,
  useGetAdminComplaintQuery,
  useReplyAdminComplaintMutation,
  useResolveAdminComplaintMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useAdvanceAdminOrderMutation,
  useGetAdminProductsQuery,
  useSetAdminProductApprovalMutation,
  useGetAdminFinanceQuery,
  useDecideRefundMutation,
  useDecidePayoutMutation,
  useDecideWithdrawalMutation,
  useGetAutomationsQuery,
  useToggleAutomationMutation,
  useGetAdminBannersQuery,
  useSaveAdminBannerMutation,
  useRemoveAdminBannerMutation,
  useGetAdminFaqsQuery,
  useSaveAdminFaqMutation,
  useRemoveAdminFaqMutation,
  useGetAdminCategoriesQuery,
  useSaveAdminCategoryMutation,
  useSetCategoryDefaultImageMutation,
  useGetAdminCouponsQuery,
  useSaveAdminCouponMutation,
  useGetAdminCampaignsQuery,
  useSendAdminCampaignMutation,
  useGetAdminTeamQuery,
  useSetTeamRoleMutation,
  useInviteTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetAuditLogQuery,
  useGetAdminReportsQuery,
  useGetHomepageCmsQuery,
  useSaveHomepageCmsMutation,
  useGetEmailTemplatesQuery,
  useGetEmailTemplateQuery,
  usePreviewEmailTemplateMutation,
  useSaveEmailTemplateMutation,
  useTestEmailTemplateMutation,
  useSetOrderTrackingMutation,
} = adminApi;
