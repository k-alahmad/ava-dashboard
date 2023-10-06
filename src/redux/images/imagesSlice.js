import { apiSlice } from "../api/apiSlice";

export const imagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImageById: builder.query({
      query: (args) => `/image/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Image", id: args.id }],
    }),

    updateImage: builder.mutation({
      query: (args) => ({
        url: `/images/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Image", id: args.id },
      ],
    }),
    deleteImage: builder.mutation({
      query: (args) => ({
        url: `/images/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Image"],
    }),
    deleteAllProjectImages: builder.mutation({
      query: (args) => ({
        url: `/projects/deleteallimages/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Image"],
    }),
    deleteAllPropertyImages: builder.mutation({
      query: (args) => ({
        url: `/property/images/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Image"],
    }),
  }),
});

export const {
  useDeleteAllProjectImagesMutation,
  useDeleteAllPropertyImagesMutation,
  useDeleteImageMutation,
  useLazyGetImageByIdQuery,
  useGetImageByIdQuery,
  useUpdateImageMutation,
} = imagesApiSlice;
