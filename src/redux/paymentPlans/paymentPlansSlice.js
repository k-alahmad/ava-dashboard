import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const paymentPlansAdapter = createEntityAdapter();
const paymentPlansActiveAdapter = createEntityAdapter();

const initialState = paymentPlansAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = paymentPlansActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const paymentPlansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentPlans: builder.query({
      query: (args) => ({
        url: `/paymentplan`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        initialState.normalData = responseData.PaymentPlan;
        const loadedPaymentPlans = responseData.PaymentPlan;

        return paymentPlansAdapter.setAll(initialState, loadedPaymentPlans);
      },
      providesTags: (result, error, arg) => [
        { type: "PaymentPlans", id: "LIST" },
        ...result.ids.map((id) => ({ type: "PaymentPlans", id })),
      ],
    }),
    getActivePaymentPlans: builder.query({
      query: (args) => ({
        url: `/paymentplan-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData.count;
        initialActiveState.normalData = responseData.PaymentPlan;
        const loadedPaymentPlans = responseData.PaymentPlan;
        return paymentPlansActiveAdapter.setAll(
          initialActiveState,
          loadedPaymentPlans
        );
      },
      providesTags: (result, error, arg) => [
        { type: "ActivePaymentPlans", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActivePaymentPlans", id })),
      ],
    }),
    getPaymentPlanById: builder.query({
      query: (args) => `/paymentplan/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "PaymentPlans", id: args.id },
      ],
    }),
    addPaymentPlan: builder.mutation({
      query: (args) => ({
        url: "/paymentplan",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "PaymentPlans", id: "LIST" },
        { type: "ActivePaymentPlans", id: "LIST" },
      ],
    }),
    updatePaymentPlan: builder.mutation({
      query: (args) => ({
        url: `/paymentplan/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "PaymentPlans", id: arg.id },
        { type: "ActivePaymentPlans", id: arg.id },
      ],
    }),
    deletePaymentPlan: builder.mutation({
      query: (args) => ({
        url: `/paymentplan/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["PaymentPlans", "ActivePaymentPlan"],
    }),
  }),
});

export const {
  useGetPaymentPlansQuery,
  useLazyGetPaymentPlanByIdQuery,
  useLazyGetPaymentPlansQuery,
  useDeletePaymentPlanMutation,
  useAddPaymentPlanMutation,
  useUpdatePaymentPlanMutation,
  useGetActivePaymentPlansQuery,
  useLazyGetActivePaymentPlansQuery,
} = paymentPlansApiSlice;
