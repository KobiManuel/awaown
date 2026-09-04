import { baseApi } from "./baseApi";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    getProducts: build.query({
      query: (params = {}) => ({ url: "/products", params }),
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((p) => ({ type: "Product", id: p.slug })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProduct: build.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (res, err, slug) => [{ type: "Product", id: slug }],
    }),
    getRelatedProducts: build.query({
      query: (slug) => `/products/${slug}/related`,
    }),
    getStockAlert: build.query({
      query: (slug) => `/products/${slug}/stock-alert`,
      providesTags: (r, e, slug) => [{ type: "Product", id: `${slug}-alert` }],
    }),
    subscribeStockAlert: build.mutation({
      query: (slug) => ({
        url: `/products/${slug}/stock-alert`,
        method: "POST",
      }),
      invalidatesTags: (r, e, slug) => [{ type: "Product", id: `${slug}-alert` }],
    }),
    getReviews: build.query({
      query: (slug) => `/products/${slug}/reviews`,
      providesTags: (res, err, slug) => [{ type: "Review", id: slug }],
    }),
    createReview: build.mutation({
      query: ({ slug, rating, body }) => ({
        url: `/products/${slug}/reviews`,
        method: "POST",
        body: { rating, body },
      }),
      invalidatesTags: (res, err, { slug }) => [
        { type: "Review", id: slug },
        { type: "Product", id: slug },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetStockAlertQuery,
  useSubscribeStockAlertMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
} = catalogApi;
