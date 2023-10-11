import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter();
const usersActiveAdapter = createEntityAdapter();
const roleUsersAdapter = createEntityAdapter();
const teamUsersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = usersActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialRoleState = roleUsersAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialTeamState = teamUsersAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (args) => ({
        url: `/users`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        initialState.normalData = responseData.Users;
        const loaded = responseData.Users;
        return usersAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Users", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Users", id })),
      ],
    }),
    getActiveUsers: builder.query({
      query: (args) => ({
        url: `/users-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData.count;
        initialActiveState.normalData = responseData.Users;
        const loaded = responseData.Users;
        return usersAdapter.setAll(initialActiveState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "UsersActive", id: "LIST" },
        ...result.ids.map((id) => ({ type: "UsersActive", id })),
      ],
    }),
    getUserById: builder.query({
      query: (args) => `/users/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Users", id: args.id }],
    }),
    getUserByRoleId: builder.query({
      query: (args) => ({
        url: `/users/role/${args.id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialRoleState.count = responseData.count;
        initialRoleState.normalData = responseData.Users;
        const loaded = responseData.Users;
        return roleUsersAdapter.setAll(initialRoleState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "RoleUsers", id: "LIST" },
        ...result.ids.map((id) => ({ type: "RoleUsers", id })),
      ],
    }),
    getUserByTeamId: builder.query({
      query: (args) => ({
        url: `/users/team/${args.id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialTeamState.count = responseData.count;
        initialTeamState.normalData = responseData.Users;
        const loaded = responseData.Users;
        return teamUsersAdapter.setAll(initialTeamState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "TeamUsers", id: "LIST" },
        ...result.ids.map((id) => ({ type: "TeamUsers", id })),
      ],
    }),

    addUser: builder.mutation({
      query: (args) => ({
        url: "/users",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (args) => ({
        url: `/users/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Users", id: args.id },
      ],
    }),
    deleteUser: builder.mutation({
      query: (args) => ({
        url: `/users/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetActiveUsersQuery,
  useLazyGetActiveUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetUserByRoleIdQuery,
  useLazyGetUserByRoleIdQuery,
  useGetUserByTeamIdQuery,
  useLazyGetUserByTeamIdQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;
