import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const addressAdapter = createEntityAdapter();
const addressActiveAdapter = createEntityAdapter();

const initialState = addressAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = addressActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddress: builder.query({
      query: (args) => ({
        url: `/address`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Address;
        const loaded = responseData.Address;
        return addressAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Address", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Address", id })),
      ],
    }),
    getActiveAddress: builder.query({
      query: (args) => ({
        url: `/address-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.count;
        initialActiveState.normalData = responseData.Address;
        const loaded = responseData.Address;
        return addressActiveAdapter.setAll(initialActiveState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveAddress", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveAddress", id })),
      ],
    }),
    getAddressById: builder.query({
      query: (args) => `/address/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Address", id: args.id }],
    }),

    addAddress: builder.mutation({
      query: (args) => ({
        url: "/address",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Address", id: "LIST" },
        { type: "ActiveAddress", id: "LIST" },
      ],
    }),
    updateAddress: builder.mutation({
      query: (args) => ({
        url: `/address/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Address", id: args.id },
        { type: "ActiveAddress", id: "LIST" },
      ],
    }),
    deleteAddress: builder.mutation({
      query: (args) => ({
        url: `/address/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Address", "ActiveAddress"],
    }),
  }),
});

export const {
  useGetAddressQuery,
  useLazyGetAddressQuery,
  useGetAddressByIdQuery,
  useLazyGetAddressByIdQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetActiveAddressQuery,
  useLazyGetActiveAddressQuery,
} = addressApiSlice;
