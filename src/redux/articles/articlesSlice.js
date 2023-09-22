import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const articlesAdapter = createEntityAdapter();

const initialState = articlesAdapter.getInitialState({
  count: "",
  activeCount: "",
});

export const articlesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (args) => ({
        url: `/article`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedArticles = responseData.Articles;
        let aCount = loadedArticles?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return articlesAdapter.setAll(initialState, loadedArticles);
      },
      providesTags: (result, error, arg) => [
        { type: "Articles", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Articles", id })),
      ],
    }),
    getArticleById: builder.query({
      query: (args) => `/article/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Articles", id: args.id },
      ],
    }),
    addArticle: builder.mutation({
      query: (args) => ({
        url: "/article",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),
    updateArticle: builder.mutation({
      query: (args) => ({
        url: `/article/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Articles", id: arg.id },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (args) => ({
        url: `/article/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useLazyGetArticleByIdQuery,
  useLazyGetArticlesQuery,
  useDeleteArticleMutation,
  useAddArticleMutation,
  useUpdateArticleMutation,
} = articlesApiSlice;
