import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter();
const roleUsersAdapter = createEntityAdapter();
const teamUsersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  count: "",
});
const initialRoleState = roleUsersAdapter.getInitialState({
  count: "",
});
const initialTeamState = teamUsersAdapter.getInitialState({
  count: "",
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
        const loaded = responseData.Users;
        return usersAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Users", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Users", id })),
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
