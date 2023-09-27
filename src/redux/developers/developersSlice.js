import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const developersAdapter = createEntityAdapter();

const initialState = developersAdapter.getInitialState({
  count: "",
  activeCount: "",
});

export const developersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevelopers: builder.query({
      query: (args) => ({
        url: `/developer`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedDevelopers = responseData.Developer;
        let aCount = loadedDevelopers?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return developersAdapter.setAll(initialState, loadedDevelopers);
      },
      providesTags: (result, error, arg) => [
        { type: "Developers", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Developers", id })),
      ],
    }),
    getDeveloperById: builder.query({
      query: (args) => `/developer/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Developers", id: args.id },
      ],
    }),
    addDeveloper: builder.mutation({
      query: (args) => ({
        url: "/developer",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Developers", id: "LIST" }],
    }),
    updateDeveloper: builder.mutation({
      query: (args) => ({
        url: `/developer/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Developers", id: arg.id },
      ],
    }),
    deleteDeveloper: builder.mutation({
      query: (args) => ({
        url: `/developer/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Developers"],
    }),
  }),
});

export const {
  useGetDevelopersQuery,
  useLazyGetDeveloperByIdQuery,
  useLazyGetDevelopersQuery,
  useDeleteDeveloperMutation,
  useAddDeveloperMutation,
  useUpdateDeveloperMutation,
} = developersApiSlice;
