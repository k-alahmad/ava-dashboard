import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const amenitiesAdapter = createEntityAdapter();

const initialState = amenitiesAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const amenitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAmenities: builder.query({
      query: (args) => ({
        url: `/aminities`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        initialState.normalData = responseData.Aminities;
        const loadedAmenities = responseData.Aminities;
        return amenitiesAdapter.setAll(initialState, loadedAmenities);
      },
      providesTags: (result, error, arg) => [
        { type: "Amenities", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Amenities", id })),
      ],
    }),
    getAmenityById: builder.query({
      query: (args) => `/aminities/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Amenities", id: args.id },
      ],
    }),
    addAmenity: builder.mutation({
      query: (args) => ({
        url: "/aminities",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),
    updateAmenity: builder.mutation({
      query: (args) => ({
        url: `/aminities/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Amenities", id: arg.id },
      ],
    }),
    deleteAmenity: builder.mutation({
      query: (args) => ({
        url: `/aminities/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Amenities"],
    }),
  }),
});

export const {
  useGetAmenitiesQuery,
  useLazyGetAmenityByIdQuery,
  useLazyGetAmenitiesQuery,
  useDeleteAmenityMutation,
  useAddAmenityMutation,
  useUpdateAmenityMutation,
} = amenitiesApiSlice;
