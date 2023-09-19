import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const rolesAdapter = createEntityAdapter();
const rolesActiveAdapter = createEntityAdapter();

const initialState = rolesAdapter.getInitialState({
  count: "",
});
const initialActiveState = rolesActiveAdapter.getInitialState({
  count: "",
});

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (args) => ({
        url: `/role`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.length;
        const loaded = responseData;
        return rolesAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Roles", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Roles", id })),
      ],
    }),
    getActiveRoles: builder.query({
      query: (args) => ({
        url: `/role-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.length;
        const loaded = responseData;
        return rolesActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveRoles", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveRoles", id })),
      ],
    }),
    getRoleById: builder.query({
      query: (args) => `/role/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Roles", id: args.id }],
    }),

    addRole: builder.mutation({
      query: (args) => ({
        url: "/role",
        method: "POST",
        body: args.form,
      }),
      invalidatesTags: [
        { type: "Roles", id: "LIST" },
        { type: "ActiveRoles", id: "LIST" },
      ],
    }),
    updateRole: builder.mutation({
      query: (args) => ({
        url: `/role/${args.id}`,
        method: "PUT",
        body: args.form,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Roles", id: args.id },
        { type: "ActiveRoles", id: args.id },
      ],
    }),
    deleteRole: builder.mutation({
      query: (args) => ({
        url: `/role/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Roles", "ActiveRoles"],
    }),
    updateRoleResourcesByRoleId: builder.mutation({
      query: (args) => ({
        url: `/role-resource/role/${args.id}`,
        method: "PUT",
        body: { Role_Resources: args.Role_Resources },
      }),
    }),
  }),
});

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetActiveRolesQuery,
  useLazyGetActiveRolesQuery,
  useGetRoleByIdQuery,
  useLazyGetRoleByIdQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleResourcesByRoleIdMutation,
} = rolesApiSlice;
