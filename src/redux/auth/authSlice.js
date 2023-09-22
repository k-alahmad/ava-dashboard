import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: sessionStorage.getItem("token") ?? null },
  reducers: {
    setCredentials: (state, action) => {
      const { foundUser, accessToken } = action.payload;
      state.user = foundUser;
      sessionStorage.setItem("token", accessToken);
      state.token = sessionStorage.getItem("token");
    },
    logOut: (state, action) => {
      (state.user = null), (state.token = null);
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
