import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const articlesAdapter = createEntityAdapter();
const articlesActiveAdapter = createEntityAdapter();

const initialState = articlesAdapter.getInitialState({
  count: "",
  normalData: [],
});
const initialActiveState = articlesActiveAdapter.getInitialState({
  count: "",
  normalData: [],
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
        initialState.normalData = responseData.Articles;
        const loadedArticles = responseData.Articles;

        return articlesAdapter.setAll(initialState, loadedArticles);
      },
      providesTags: (result, error, arg) => [
        { type: "Articles", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Articles", id })),
      ],
    }),
    getActiveArticles: builder.query({
      query: (args) => ({
        url: `/article-active`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialActiveState.count = responseData.count;
        initialActiveState.normalData = responseData.Articles;
        const loadedArticles = responseData.Articles;
        return articlesActiveAdapter.setAll(initialActiveState, loadedArticles);
      },
      providesTags: (result, error, arg) => [
        { type: "ActiveArticles", id: "LIST" },
        ...result.ids.map((id) => ({ type: "ActiveArticles", id })),
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
      invalidatesTags: [
        { type: "Articles", id: "LIST" },
        { type: "ActiveArticles", id: "LIST" },
      ],
    }),
    updateArticle: builder.mutation({
      query: (args) => ({
        url: `/article/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Articles", id: arg.id },
        { type: "ActiveArticles", id: arg.id },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (args) => ({
        url: `/article/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Articles", "ActiveArticle"],
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
  useGetActiveArticlesQuery,
  useLazyGetActiveArticlesQuery,
} = articlesApiSlice;
