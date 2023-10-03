import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const announcementsAdapter = createEntityAdapter();

const initialState = announcementsAdapter.getInitialState({
  count: "",
  activeCount: "",
});

export const announcementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: (args) => ({
        url: `/announcement`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedAnnouncements = responseData.Announcement;
        let aCount = loadedAnnouncements?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return announcementsAdapter.setAll(initialState, loadedAnnouncements);
      },
      providesTags: (result, error, arg) => [
        { type: "Announcements", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Announcements", id })),
      ],
    }),
    getAnnouncementById: builder.query({
      query: (args) => `/announcement/${args.id}`,
      providesTags: (result, error, args) => [
        { type: "Announcements", id: args.id },
      ],
    }),
    addAnnouncement: builder.mutation({
      query: (args) => ({
        url: "/announcement",
        method: "POST",
        body: args.formData,
      }),
      invalidatesTags: [{ type: "Announcements", id: "LIST" }],
    }),
    updateAnnouncement: builder.mutation({
      query: (args) => ({
        url: `/announcement/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Announcements", id: arg.id },
      ],
    }),
    deleteAnnouncement: builder.mutation({
      query: (args) => ({
        url: `/announcement/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useLazyGetAnnouncementByIdQuery,
  useLazyGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useAddAnnouncementMutation,
  useUpdateAnnouncementMutation,
} = announcementsApiSlice;
