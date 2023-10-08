import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const jobsAdapter = createEntityAdapter();
const jobsActiveAdapter = createEntityAdapter();
const jobsUserAdapter = createEntityAdapter();

const initialState = jobsAdapter.getInitialState({
  count: "",
  activeCount: "",
});
const initialActiveState = jobsActiveAdapter.getInitialState({
  count: "",
  activeCount: "",
});
const initialUserState = jobsUserAdapter.getInitialState({
  count: "",
  activeCount: "",
});

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (args) => ({
        url: `/job`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedJobs = responseData.Jobs;
        let aCount = loadedJobs?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return jobsAdapter.setAll(initialState, loadedJobs);
      },
      providesTags: (result, error, arg) => [
        { type: "Jobs", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Jobs", id })),
      ],
    }),
    getActiveJobs: builder.query({
      query: (args) => ({
        url: `/job-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData.count;
        initialActiveState.normalData = responseData.Jobs;
        const loaded = responseData.Jobs;
        return jobsActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveJobs", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveJobs", id })),
      ],
    }),
    getJobsByUserId: builder.query({
      query: (args) => ({
        url: `/job/user/${args.id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialUserState.count = responseData.count;
        initialUserState.normalData = responseData.Jobs;
        const loaded = responseData.Jobs;
        return jobsUserAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "UserJobs", id: "LIST" },
        ...result.ids.map((id) => ({ type: "UserJobs", id })),
      ],
    }),
    getJobById: builder.query({
      query: (args) => `/job/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Jobs", id: args.id }],
    }),
    addJob: builder.mutation({
      query: (args) => ({
        url: "/job",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
    updateJob: builder.mutation({
      query: (args) => ({
        url: `/job/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Jobs", id: arg.id }],
    }),
    deleteJob: builder.mutation({
      query: (args) => ({
        url: `/job/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useLazyGetJobByIdQuery,
  useLazyGetJobsQuery,
  useDeleteJobMutation,
  useAddJobMutation,
  useUpdateJobMutation,
  useGetActiveJobsQuery,
  useLazyGetActiveJobsQuery,
  useGetJobByIdQuery,
  useLazyGetJobsByUserIdQuery,
} = jobsApiSlice;
