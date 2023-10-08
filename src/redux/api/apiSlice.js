import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../auth/authSlice";
import { API_BASE_URL } from "../../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus == 403) {
    // console.log("sending refresh token");
    //send the refresh token to get new access token
    const refreshResult = await baseQuery(
      "/auth/refreshToken",
      api,
      extraOptions
    );
    // console.log(refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      //store the new token
      api.dispatch(
        setCredentials({
          accessToken: refreshResult?.data?.accessToken,
        })
      );
      // retry the original query with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "RoleUsers",
    "TeamUsers",
    "Roles",
    "ActiveRoles",
    "Teams",
    "ActiveTeams",
    "Resources",
    "LNG",
    "Articles",
    "ArticleArticles",
    "Address",
    "ActiveAddress",
    "Currency",
    "ActiveCurrency",
    "Unit",
    "ActiveUnit",
    "Developers",
    "ActiveDevelopers",
    "Category",
    "ActiveCategory",
    "Amenities",
    "Announcements",
    "Properties",
    "ActiveProperties",
    "Guests",
    "Image",
    "Enquiry",
    "Feedback",
    "Listings",
    "MetaData",
    "Job",
    "Application",
  ],
  endpoints: (builder) => ({}),
});
