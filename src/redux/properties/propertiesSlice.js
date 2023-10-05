import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const propertiesAdapter = createEntityAdapter();

const initialState = propertiesAdapter.getInitialState({
  count: "",
  activeCount: "",
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
        const loadedProperties = responseData.Properties;
        let aCount = loadedProperties?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return propertiesAdapter.setAll(initialState, loadedProperties);
      },
      providesTags: (result, error, arg) => [
        { type: "Properties", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Properties", id })),
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
      invalidatesTags: [{ type: "Properties", id: "LIST" }],
    }),
    updateProperty: builder.mutation({
      query: (args) => ({
        url: `/property/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Properties", id: arg.id },
      ],
    }),
    deleteProperty: builder.mutation({
      query: (args) => ({
        url: `/property/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Properties"],
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
} = propertiesApiSlice;
