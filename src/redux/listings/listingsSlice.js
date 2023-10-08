import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const listingsAdapter = createEntityAdapter();

const initialState = listingsAdapter.getInitialState({
  count: "",
});

export const listingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query({
      query: (args) => ({
        url: `/list-with-us`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedListings = responseData.Listings;
        return listingsAdapter.setAll(initialState, loadedListings);
      },
      providesTags: (result, error, arg) => [
        { type: "Listings", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Listings", id })),
      ],
    }),
    getListingById: builder.query({
      query: (args) => `/list-with-us/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Listings", id: args.id },
      ],
    }),
    updateListing: builder.mutation({
      query: (args) => ({
        url: `/list-with-us/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listings", id: arg.id },
      ],
    }),
    deleteListing: builder.mutation({
      query: (args) => ({
        url: `/list-with-us/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Listings"],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useLazyGetListingByIdQuery,
  useLazyGetListingsQuery,
  useDeleteListingMutation,
  useUpdateListingMutation,
} = listingsApiSlice;
