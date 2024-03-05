import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const openHouseAdapter = createEntityAdapter();

const initialState = openHouseAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const openHouseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOpenHouse: builder.query({
      query: (args) => ({
        url: `/openHouse`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.OpenHouse;
        const loaded = responseData.OpenHouse;
        return openHouseAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "OpenHouse", id: "LIST" },
        ...result.ids.map((id) => ({ type: "OpenHouse", id })),
      ],
    }),

    getOpenHouseById: builder.query({
      query: (args) => `/openHouse/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "OpenHouse", id: args.id },
      ],
    }),
    deleteOpenHouse: builder.mutation({
      query: (args) => ({
        url: `/openHouse/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["OpenHouse"],
    }),
  }),
});

export const {
  useGetOpenHouseQuery,
  useLazyGetOpenHouseQuery,
  useGetOpenHouseByIdQuery,
  useLazyGetOpenHouseByIdQuery,
  useDeleteOpenHouseMutation,
} = openHouseApiSlice;
