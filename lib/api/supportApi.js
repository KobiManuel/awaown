import { baseApi } from "./baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyComplaints: build.query({
      query: () => "/support/complaints",
      providesTags: ["Complaint"],
    }),
    getMyComplaint: build.query({
      query: (id) => `/support/complaints/${id}`,
      providesTags: (r, e, id) => [{ type: "Complaint", id }],
    }),
    createComplaint: build.mutation({
      query: (body) => ({ url: "/support/complaints", method: "POST", body }),
      invalidatesTags: ["Complaint"],
    }),
    replyComplaint: build.mutation({
      query: ({ id, body }) => ({
        url: `/support/complaints/${id}/messages`,
        method: "POST",
        body: { body },
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Complaint", id }, "Complaint"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyComplaintsQuery,
  useGetMyComplaintQuery,
  useCreateComplaintMutation,
  useReplyComplaintMutation,
} = supportApi;
