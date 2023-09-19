import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const teamsAdapter = createEntityAdapter();
const teamsActiveAdapter = createEntityAdapter();

const initialState = teamsAdapter.getInitialState({
  count: "",
});
const initialActiveState = teamsActiveAdapter.getInitialState({
  count: "",
});

export const teamsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (args) => ({
        url: `/team`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        const loaded = responseData.Teams;
        return teamsAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Teams", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Teams", id })),
      ],
    }),
    getActiveTeams: builder.query({
      query: (args) => ({
        url: `/team-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.count;
        const loaded = responseData.Teams;
        return teamsActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveTeams", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveTeams", id })),
      ],
    }),
    getTeamById: builder.query({
      query: (args) => `/team/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Teams", id: args.id }],
    }),

    addTeam: builder.mutation({
      query: (args) => ({
        url: "/team",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Teams", id: "LIST" },
        { type: "ActiveTeams", id: "LIST" },
      ],
    }),
    updateTeam: builder.mutation({
      query: (args) => ({
        url: `/team/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Teams", id: args.id },
        { type: "ActiveTeams", id: args.id },
      ],
    }),
    deleteTeam: builder.mutation({
      query: (args) => ({
        url: `/team/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Teams", "ActiveTeams"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useGetActiveTeamsQuery,
  useLazyGetActiveTeamsQuery,
  useGetTeamByIdQuery,
  useLazyGetTeamByIdQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamsApiSlice;
