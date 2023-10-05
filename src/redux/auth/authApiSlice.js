import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          ...credentials,
        },
      }),
    }),
    getProfile: builder.query({
      query: (args) => ({
        url: `/auth/profile`,
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (args) => ({
        url: `/auth/profile`,
        method: "PUT",
        body: args.formData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = authApiSlice;
