import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const propertiesAdapter = createEntityAdapter();
const propertiesActiveAdapter = createEntityAdapter();

const initialState = propertiesAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = propertiesActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const propertiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (args) => ({
        url: `/property`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        initialState.normalData = responseData.Properties;
        const loadedProperties = responseData.Properties;

        return propertiesAdapter.setAll(initialState, loadedProperties);
      },
      providesTags: (result, error, arg) => [
        { type: "Properties", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Properties", id })),
      ],
    }),
    getActiveProperties: builder.query({
      query: (args) => ({
        url: `/property-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData.count;
        initialActiveState.normalData = responseData.Properties;
        const loadedProperties = responseData.Properties;
        return propertiesActiveAdapter.setAll(
          initialActiveState,
          loadedProperties
        );
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveProperties", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveProperties", id })),
      ],
    }),
    getPropertyById: builder.query({
      query: (args) => `/property/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Properties", id: args.id },
      ],
    }),
    addProperty: builder.mutation({
      query: (args) => ({
        url: "/property",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Properties", id: "LIST" },
        { type: "ActiveProperties", id: "LIST" },
      ],
    }),
    updateProperty: builder.mutation({
      query: (args) => ({
        url: `/property/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Properties", id: arg.id },
        { type: "ActiveProperties", id: arg.id },
      ],
    }),
    deleteProperty: builder.mutation({
      query: (args) => ({
        url: `/property/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Properties", "ActiveProperties"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useLazyGetPropertyByIdQuery,
  useLazyGetPropertiesQuery,
  useDeletePropertyMutation,
  useAddPropertyMutation,
  useUpdatePropertyMutation,
  useGetActivePropertiesQuery,
  useLazyGetActivePropertiesQuery,
} = propertiesApiSlice;
