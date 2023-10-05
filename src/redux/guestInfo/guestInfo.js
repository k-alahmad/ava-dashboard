import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const guestsAdapter = createEntityAdapter();

const initialState = guestsAdapter.getInitialState({
  count: "",
  activeCount: "",
});

export const guestsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGuests: builder.query({
      query: (args) => ({
        url: `/guest-info`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        initialState.count = responseData.count;
        const loadedGuests = responseData.Guests;
        let aCount = loadedGuests?.filter((n) => n.ActiveStatus == true);
        initialState.activeCount = aCount?.length;
        return guestsAdapter.setAll(initialState, loadedGuests);
      },
      providesTags: (result, error, arg) => [
        { type: "Guests", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Guests", id })),
      ],
    }),
    getGuestById: builder.query({
      query: (args) => `/guest-info/${args.id}`,
      providesTags: (result, error, args) => [{ type: "Guests", id: args.id }],
    }),

    updateGuest: builder.mutation({
      query: (args) => ({
        url: `/guest-info/${args.id}`,
        method: "PUT",
        body: args.formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Guests", id: arg.id }],
    }),
    deleteGuest: builder.mutation({
      query: (args) => ({
        url: `/guest-info/${args.id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Guests"],
    }),
  }),
});

export const {
  useGetGuestsQuery,
  useLazyGetGuestByIdQuery,
  useLazyGetGuestsQuery,
  useDeleteGuestMutation,
  useUpdateGuestMutation,
} = guestsApiSlice;
