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
  }),
});

export const { useLoginMutation, useGetProfileQuery, useLazyGetProfileQuery } =
  authApiSlice;
