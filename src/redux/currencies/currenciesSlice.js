import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const currencyAdapter = createEntityAdapter();
const currencyActiveAdapter = createEntityAdapter();

const initialState = currencyAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = currencyActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const currencyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrency: builder.query({
      query: (args) => ({
        url: `/currency`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Currency;
        const loaded = responseData.Currency;
        return currencyAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Currency", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Currency", id })),
      ],
    }),
    getActiveCurrency: builder.query({
      query: (args) => ({
        url: `/currency-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.length;
        initialActiveState.normalData = responseData;
        const loaded = responseData;
        return currencyActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveCurrency", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveCurrency", id })),
      ],
    }),
    getCurrencyById: builder.query({
      query: (args) => `/currency/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Currency", id: args.id },
      ],
    }),

    addCurrency: builder.mutation({
      query: (args) => ({
        url: "/currency",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Currency", id: "LIST" },
        { type: "ActiveCurrency", id: "LIST" },
      ],
    }),
    updateCurrency: builder.mutation({
      query: (args) => ({
        url: `/currency/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Currency", id: args.id },
        { type: "ActiveCurrency", id: "LIST" },
      ],
    }),
    deleteCurrency: builder.mutation({
      query: (args) => ({
        url: `/currency/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Currency", "ActiveCurrency"],
    }),
  }),
});

export const {
  useGetCurrencyQuery,
  useLazyGetCurrencyQuery,
  useGetCurrencyByIdQuery,
  useLazyGetCurrencyByIdQuery,
  useAddCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
  useGetActiveCurrencyQuery,
  useLazyGetActiveCurrencyQuery,
} = currencyApiSlice;
