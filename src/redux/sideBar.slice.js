import { createSlice } from "@reduxjs/toolkit";

const sideBar = createSlice({
  name: "sideBar",
  initialState: {
    sideNavOpen: false,
  },
  reducers: {
    openSideNav: (state, action) => {
      state.sideNavOpen = true;
    },
    closeSideNav: (state, action) => {
      state.sideNavOpen = false;
    },
  },
});
export const { openSideNav, closeSideNav } = sideBar.actions;
export const selectSideNav = (state) => state.sideBarAction;
export const selectSideNavStatus = (state) => state.sideBarAction.sideNavOpen;

export default sideBar.reducer;
