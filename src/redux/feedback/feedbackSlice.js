import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const feedbackAdapter = createEntityAdapter();

const initialState = feedbackAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query({
      query: (args) => ({
        url: `/feedback`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Feedback;
        const loaded = responseData.Feedback;
        return feedbackAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Feedback", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Feedback", id })),
      ],
    }),

    getFeedbackById: builder.query({
      query: (args) => `/feedback/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Feedback", id: args.id },
      ],
    }),
    deleteFeedback: builder.mutation({
      query: (args) => ({
        url: `/feedback/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const {
  useGetFeedbackQuery,
  useLazyGetFeedbackQuery,
  useGetFeedbackByIdQuery,
  useLazyGetFeedbackByIdQuery,
  useDeleteFeedbackMutation,
} = feedbackApiSlice;
