import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const categoryAdapter = createEntityAdapter();
const categoryActiveAdapter = createEntityAdapter();

const initialState = categoryAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = categoryActiveAdapter.getInitialState({
  count: "",
  normalData: [],
});

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: (args) => ({
        url: `/category`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData?.count;
        initialState.normalData = responseData.Category;
        const loaded = responseData.Category;
        return categoryAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "Category", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Category", id })),
      ],
    }),
    getActiveCategory: builder.query({
      query: (args) => ({
        url: `/category-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData?.count;
        initialActiveState.normalData = responseData.Category;
        const loaded = responseData.Category;
        return categoryActiveAdapter.setAll(initialState, loaded);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveCategory", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveCategory", id })),
      ],
    }),
    getCategoryById: builder.query({
      query: (args) => `/category/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Category", id: args.id },
      ],
    }),

    addCategory: builder.mutation({
      query: (args) => ({
        url: "/category",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "ActiveCategory", id: "LIST" },
      ],
    }),
    updateCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Category", id: args.id },
        { type: "ActiveCategory", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Category", "ActiveCategory"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetActiveCategoryQuery,
  useLazyGetActiveCategoryQuery,
} = categoryApiSlice;
