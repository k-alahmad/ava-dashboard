import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const enquiryAdapter = createEntityAdapter();

const initialState = enquiryAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const enquiryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnquiry: builder.query({
      query: (args) => ({
        url: `/enquiry`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.EnquiryForm;
        const loaded = responseData.EnquiryForm;
        return enquiryAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Enquiry", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Enquiry", id })),
      ],
    }),

    getEnquiryById: builder.query({
      query: (args) => `/enquiry/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Enquiry", id: args.id }],
    }),
    deleteEnquiry: builder.mutation({
      query: (args) => ({
        url: `/enquiry/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Enquiry"],
    }),
  }),
});

export const {
  useGetEnquiryQuery,
  useLazyGetEnquiryQuery,
  useGetEnquiryByIdQuery,
  useLazyGetEnquiryByIdQuery,
  useDeleteEnquiryMutation,
} = enquiryApiSlice;
