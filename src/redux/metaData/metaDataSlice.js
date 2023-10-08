import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const metaDataAdapter = createEntityAdapter();

const initialState = metaDataAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const metaDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMetaData: builder.query({
      query: (args) => ({
        url: `/meta-data`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.MetaData;
        const loaded = responseData.MetaData;
        return metaDataAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "MetaData", id: "LIST" },
        ...result.ids.map((id) => ({ type: "MetaData", id })),
      ],
    }),

    getMetaDataById: builder.query({
      query: (args) => `/meta-data/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "MetaData", id: args.id },
      ],
    }),

    addMetaData: builder.mutation({
      query: (args) => ({
        url: "/meta-data",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "MetaData", id: "LIST" }],
    }),
    updateMetaData: builder.mutation({
      query: (args) => ({
        url: `/meta-data/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "MetaData", id: args.id },
      ],
    }),
    deleteMetaData: builder.mutation({
      query: (args) => ({
        url: `/meta-data/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["MetaData"],
    }),
  }),
});

export const {
  useGetMetaDataQuery,
  useLazyGetMetaDataQuery,
  useGetMetaDataByIdQuery,
  useLazyGetMetaDataByIdQuery,
  useAddMetaDataMutation,
  useUpdateMetaDataMutation,
  useDeleteMetaDataMutation,
  useGetActiveMetaDataQuery,
  useLazyGetActiveMetaDataQuery,
} = metaDataApiSlice;
