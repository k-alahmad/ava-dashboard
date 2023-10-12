import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const applicationAdapter = createEntityAdapter();

const initialState = applicationAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplication: builder.query({
      query: (args) => ({
        url: `/applicant`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Applicantion;
        const loaded = responseData.Applicantion;
        return applicationAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Application", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Application", id })),
      ],
    }),

    getApplicationById: builder.query({
      query: (args) => `/applicant/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "applicant", id: args.id },
      ],
    }),
    deleteApplication: builder.mutation({
      query: (args) => ({
        url: `/applicant/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useGetApplicationQuery,
  useLazyGetApplicationQuery,
  useGetApplicationByIdQuery,
  useLazyGetApplicationByIdQuery,
  useDeleteApplicationMutation,
} = applicationApiSlice;
