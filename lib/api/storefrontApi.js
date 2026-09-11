import { baseApi } from "./baseApi";

export const storefrontApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPartnerStorefront: build.query({
      query: (code) => `/storefront/partner/${code}`,
    }),
    getMerchantStorefront: build.query({
      query: (slug) => `/storefront/merchant/${slug}`,
    }),
    getHomepageContent: build.query({
      query: () => `/storefront/homepage`,
      providesTags: ["Settings"],
    }),
    getPublicFaqs: build.query({
      query: () => `/storefront/faqs`,
      providesTags: ["Faq"],
    }),
    getAboutImages: build.query({
      query: () => `/storefront/about-images`,
      providesTags: ["Settings"],
    }),
    getSocialProof: build.query({
      query: () => `/storefront/social-proof`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPartnerStorefrontQuery,
  useGetMerchantStorefrontQuery,
  useGetHomepageContentQuery,
  useGetPublicFaqsQuery,
  useGetSocialProofQuery,
  useGetAboutImagesQuery,
} = storefrontApi;
