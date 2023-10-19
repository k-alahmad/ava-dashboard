import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const unitAdapter = createEntityAdapter();
const unitActiveAdapter = createEntityAdapter();

const initialState = unitAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = unitActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const unitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnit: builder.query({
      query: (args) => ({
        url: `/unit`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Unit;
        const loaded = responseData.Unit;
        return unitAdapter.setAll(initialActiveState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Unit", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Unit", id })),
      ],
    }),
    getActiveUnit: builder.query({
      query: (args) => ({
        url: `/unit-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.length;
        initialActiveState.normalData = responseData;
        const loaded = responseData;
        return unitActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveUnit", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveUnit", id })),
      ],
    }),
    getUnitById: builder.query({
      query: (args) => `/unit/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Unit", id: args.id }],
    }),

    addUnit: builder.mutation({
      query: (args) => ({
        url: "/unit",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Unit", id: "LIST" },
        { type: "ActiveUnit", id: "LIST" },
      ],
    }),
    updateUnit: builder.mutation({
      query: (args) => ({
        url: `/unit/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Unit", id: args.id },
        { type: "ActiveUnit", id: "LIST" },
      ],
    }),
    deleteUnit: builder.mutation({
      query: (args) => ({
        url: `/unit/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Unit", "ActiveUnit"],
    }),
  }),
});

export const {
  useGetUnitQuery,
  useLazyGetUnitQuery,
  useGetUnitByIdQuery,
  useLazyGetUnitByIdQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetActiveUnitQuery,
  useLazyGetActiveUnitQuery,
} = unitApiSlice;
