import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  count: "",
  activeCount: "",
  normalData: "",
});

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (args) => ({
        url: `/category`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.totalCount;
        const loaded = responseData.category;
        let aCount = loaded?.filter((n) => n.isActive == true);
        initialState.activeCount = aCount?.length;
        initialState.normalData = responseData;
        return categoriesAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Categories", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Categories", id })),
      ],
    }),
    getCategoryById: builder.query({
      query: (args) => `/category/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Categories", id: args.id },
      ],
    }),

    addCategory: builder.mutation({
      query: (args) => ({
        url: "/category",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
    updateCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Categories", id: args.id },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoriesQuery,
  useLazyGetCategoryByIdQuery,
} = categoriesApiSlice;
