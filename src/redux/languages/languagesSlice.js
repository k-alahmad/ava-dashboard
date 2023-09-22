import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const lngAdapter = createEntityAdapter();

const initialState = lngAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const lngApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLNG: builder.query({
      query: (args) => ({
        url: `/language`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.length;
        initialState.normalData = responseData;
        const loaded = responseData;
        return lngAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "LNG", id: "LIST" },
        ...result.ids.map((id) => ({ type: "LNG", id })),
      ],
    }),

    getLNGById: builder.query({
      query: (args) => `/language/${args.id}`,
      providesTags: (result, error, args) => [{ type: "LNG", id: args.id }],
    }),

    addLNG: builder.mutation({
      query: (args) => ({
        url: "/language",
        method: "POST",
        body: args.form,
      }),
      invalidatesTags: [{ type: "LNG", id: "LIST" }],
    }),
    updateLNG: builder.mutation({
      query: (args) => ({
        url: `/language/${args.id}`,
        method: "PUT",
        body: args.form,
      }),
      invalidatesTags: (result, error, args) => [{ type: "LNG", id: args.id }],
    }),
    deleteLNG: builder.mutation({
      query: (args) => ({
        url: `/language/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["LNG"],
    }),
  }),
});

export const {
  useGetLNGQuery,
  useLazyGetLNGQuery,
  useGetLNGByIdQuery,
  useLazyGetLNGByIdQuery,
  useAddLNGMutation,
  useUpdateLNGMutation,
  useDeleteLNGMutation,
} = lngApiSlice;
